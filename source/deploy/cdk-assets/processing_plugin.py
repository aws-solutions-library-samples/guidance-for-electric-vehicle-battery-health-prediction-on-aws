# Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
#
# Licensed under the Amazon Software License (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
# http://aws.amazon.com/asl/
#
# or in the "license" file accompanying this file. This file is distributed
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied. See the License for the specific language governing
# permissions and limitations under the License.

import sys
from datetime import datetime, timedelta
from random import sample

import boto3
from awsglue.context import GlueContext
from awsglue.dynamicframe import DynamicFrame
from awsglue.job import Job
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

# Parameter for removing sparsely timed data
# Useful only when data has varied timeseries lengths
# Only CUTOFF% cells have a lower cycle_life
# So (100 - CUTOFF)% cells have at least these many cycles
QUANTILE_CUTOFF = 0.5

# Arbitrarily initialized year for converting cycle_no to timestamp
INIT_YEAR = 2000

# Number of days into the future to generate forecasts for
FORECAST_HORIZON = 30

# Cells we want to generate forecasts while testing
CELLS_PER_BATTERY = 5

# Directory to put plot data while pipeline is running
OUTPUT_DIR = "tmp"

args = getResolvedOptions(
    sys.argv,
    [
        "JOB_NAME",
        "s3_bucket",
        "raw_dataset_key",
        "data_checkpoint",
    ],
)

sc = SparkContext.getOrCreate()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

s3 = boto3.client("s3")
bucket = args["s3_bucket"]
base = args["raw_dataset_key"].rsplit("/", 1)[0]


def get_account_id():
    return boto3.client("sts").get_caller_identity()["Account"]


def get_cutoff(df):
    return df.approxQuantile(["cycle_life"], [QUANTILE_CUTOFF], 0)[0][0]


# Treat int as day number offset from starting date of Jan 1, 2000
def day_num_to_date(day_num):
    # Initializing start date
    start_date = datetime(INIT_YEAR, 1, 1, 0, 0, 0)
    # converting to date
    res_date = start_date + timedelta(days=int(day_num) - 1)
    # Forecast expects yyyy-MM-dd HH:mm:ss by default
    return res_date.strftime("%Y-%m-%d %H:%M:%S")


# Randomly sample cells that have data spanning the forecast horizon
def get_test_set(df, cutoff, sampling=False):
    trunc_df = df[df["cycle_no"] == (cutoff + FORECAST_HORIZON)]
    poss_cells = [r[0] for r in trunc_df.select("battery_name").distinct().collect()]

    if not sampling:
        return poss_cells

    poss_batts = {}
    for cell in poss_cells:
        pre = cell[:2]
        if pre not in poss_batts:
            poss_batts[pre] = []
        poss_batts[pre].append(cell)

    test_cells = []
    for cell_set in poss_batts.values():
        test_cells.extend(sample(cell_set, CELLS_PER_BATTERY))

    return test_cells


# Replace Spark autogen key with expected filename for all objects in directory
def rename_files(s3_path):
    owner = get_account_id()
    files = s3.list_objects_v2(
        Bucket=bucket,
        Prefix=s3_path,
    )

    for f in files["Contents"]:
        f_name = f["Key"]
        p_name = f_name.rsplit("/", 1)[0]

        if "=" in p_name:
            cell_id = p_name.split("=", 1)[1]
            p_name = f"{p_name.rsplit('/', 1)[0]}/{cell_id}.csv"

        s3.copy_object(
            Bucket=bucket,
            CopySource=f"{bucket}/{f_name}",
            Key=p_name,
            ExpectedBucketOwner=owner,
            ExpectedSourceBucketOwner=owner,
        )

        s3.delete_object(Bucket=bucket, Key=f_name)


# Script generated for ConvertTS Transform
def ConvertTS_Transform(glueContext, dynamicFrame) -> DynamicFrame:
    df = dynamicFrame.toDF()

    # Cast columns to ensure numerical sorting
    df = (
        df.withColumn("cycle_no", df["cycle_no"].cast("int"))
        .withColumn("cycle_life", df["cycle_life"].cast("int"))
        .withColumn("qd", df["QD"].cast("float"))
    )

    # Sort values by cycle_no (timestamp) to adhere to Forecast expectations
    df = df.sort(["cycle_no", "battery_name"])

    # Change cycle_no to fake incremental days. Ex: day_num_to_date("1") -> 2000-01-01
    toDateUDF = udf(lambda i: day_num_to_date(i), StringType())
    df = df.withColumn("date", toDateUDF(df["cycle_no"]))

    return DynamicFrame.fromDF(df, glueContext, "timeseries_set")


# Script generated for ExtractTrain Transform
def ExtractTrain_Transform(glueContext, dynamicFrame, plotData) -> DynamicFrame:
    df = dynamicFrame.toDF()
    cutoff = int(args["data_checkpoint"])  # get_cutoff(df)
    test_set = get_test_set(df, cutoff)

    if plotData:
        df = df[df["battery_name"].isin(test_set)]

    df_train = df[df["cycle_no"] <= cutoff]

    ts_column = "cycle_no" if plotData else "date"
    df_train = df_train[[ts_column, "battery_name", "qd"]]
    return DynamicFrame.fromDF(df_train, glueContext, "training_set")


# Script generated for ExtractTest Transform
# Option to get all possible test cells, or only a sub-sample
def ExtractTest_Transform(glueContext, dynamicFrame, plotData) -> DynamicFrame:
    df = dynamicFrame.toDF()
    cutoff = int(args["data_checkpoint"])  # get_cutoff(df)
    test_set = get_test_set(df, cutoff)

    df_test = df[df["battery_name"].isin(test_set)]
    df_test = df_test[df_test["cycle_no"] > cutoff]
    df_test = df_test[df_test["cycle_no"] <= (cutoff + FORECAST_HORIZON)]

    # DF should exactly span the forecast horizon for each test cell
    assert df_test.count() == FORECAST_HORIZON * len(test_set)

    ts_column = "cycle_no" if plotData else "date"
    df_test = df_test[[ts_column, "battery_name", "qd"]]
    return DynamicFrame.fromDF(df_test, glueContext, "testing_set")


# Script generated for ExtractTestIds Transform
# Needed by Forecast to generate a sub-sample for given IDs
def ExtractIds_Transform(glueContext, dynamicFrame) -> DynamicFrame:
    df = dynamicFrame.toDF()
    df_ids = df[["battery_name"]].drop_duplicates()
    return DynamicFrame.fromDF(df_ids, glueContext, "cell_ids")


# Script generated for SaveData Transform
def SaveData_Transform(input_node, s3_path, partition_key=None):
    header = True if partition_key else False
    partition_key = [partition_key] if partition_key else []

    glueContext.write_dynamic_frame.from_options(
        frame=input_node.coalesce(1),
        connection_type="s3",
        format="csv",
        format_options={"quoteChar": -1, "writeHeader": header},
        connection_options={"path": f"s3://{bucket}/{s3_path}", "partitionKeys": partition_key},
    )

    rename_files(s3_path)


# Import raw dataset from S3 bucket
InputRaw_Node = glueContext.create_dynamic_frame.from_options(
    format_options={
        "quoteChar": '"',
        "withHeader": True,
        "separator": ",",
        "optimizePerformance": True,
    },
    connection_type="s3",
    format="csv",
    connection_options={
        "paths": [f"s3://{bucket}/{args['raw_dataset_key']}"],
        "recurse": True,
    },
)


# Preprocessing to get timestamps from TS data
ConvertTS_Node = ConvertTS_Transform(glueContext, InputRaw_Node)


# Extract and save training dataset w timestamp as single file for Forecast
Train_ByTime_Node = ExtractTrain_Transform(glueContext, ConvertTS_Node, False)
SaveData_Transform(Train_ByTime_Node, f"{base}/train_dataset.csv")

# Extract and save training dataset w cycle_no split by cell IDs for UI
Train_ByCycle_Node = ExtractTrain_Transform(glueContext, ConvertTS_Node, True)
SaveData_Transform(Train_ByCycle_Node, f"{base}/{OUTPUT_DIR}/past", "battery_name")


# Extract and save testing dataset w timestamp as single file for Forecast
Test_ByTime_Node = ExtractTest_Transform(glueContext, ConvertTS_Node, False)
SaveData_Transform(Test_ByTime_Node, f"{base}/test_dataset.csv")

# Extract and save testing dataset w cycle_no split by cell IDs for UI
Test_ByCycle_Node = ExtractTest_Transform(glueContext, ConvertTS_Node, True)
SaveData_Transform(Test_ByCycle_Node, f"{base}/{OUTPUT_DIR}/actual", "battery_name")


# Extract and save test cell IDs for Forecast to generate predictions.
Test_Ids_Node = ExtractIds_Transform(glueContext, Test_ByTime_Node)
SaveData_Transform(Test_Ids_Node, f"{base}/test_ids.csv")


job.commit()
