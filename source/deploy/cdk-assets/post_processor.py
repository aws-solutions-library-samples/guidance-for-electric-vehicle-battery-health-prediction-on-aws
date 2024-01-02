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

import builtins as py_builtin
import math
import sys
from datetime import datetime

import boto3
from awsglue.context import GlueContext
from awsglue.dynamicframe import DynamicFrame
from awsglue.job import Job
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from pyspark.sql.functions import input_file_name
from pyspark.sql.functions import min as min_
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

INIT_YEAR = 2000
OUTPUT_DIR = "plot"

args = getResolvedOptions(sys.argv, ["JOB_NAME", "s3_bucket", "preds_path"])

sc = SparkContext.getOrCreate()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

s3 = boto3.client("s3")
bucket = args["s3_bucket"]
base_path = args["preds_path"].rsplit("/", 1)[0]
output_path = f"{base_path.rsplit('/', 1)[0]}/{OUTPUT_DIR}"


#################################################
# PART 1: Reorganize and rename prediction data #
#################################################


def get_account_id():
    return boto3.client("sts").get_caller_identity()["Account"]


# Convert date to day number offset from starting date of Jan 1, 2000
def date_to_day_num(date_str):
    req = datetime.fromisoformat(date_str[:-1])
    delta = req - datetime(INIT_YEAR, 1, 1, 0, 0, 0)
    return delta.days + 1


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
            p_id = p_name.split("=", 1)[1]
            p_name = f"{p_name.rsplit('/', 1)[0]}/{p_id}.csv"

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

    # Change fake incremental days back to cycle_no. Ex: date_to_day_num("2000-01-01") -> 1
    toDateUDF = udf(lambda i: date_to_day_num(i), StringType())
    df = df.withColumn("cycle_no", toDateUDF(df["date"])).withColumnRenamed("p50", "qd")

    # Sort values by cell_id, cycle_no to adhere to UI expectations
    df = df.sort(["item_id", "cycle_no"])

    # Drop date column
    df = df[["item_id", "cycle_no", "qd"]]

    return DynamicFrame.fromDF(df, glueContext, "timeseries_set")


# Script generated for SaveData Transform
def SaveData_Transform(input_node, s3_path, partition_key):
    glueContext.write_dynamic_frame.from_options(
        frame=input_node.coalesce(1),
        connection_type="s3",
        format="csv",
        format_options={"quoteChar": -1, "writeHeader": True},
        connection_options={"path": f"s3://{bucket}/{s3_path}", "partitionKeys": [partition_key]},
    )
    rename_files(s3_path)
    # Delete orphaned node in S3
    s3.delete_object(Bucket=bucket, Key=s3_path)


# Import forecasts from S3 bucket
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
        "paths": [f"s3://{bucket}/{args['preds_path']}"],
        "recurse": False,
    },
)

# Preprocessing to get cycle_no from TS data
ConvertTS_Node = ConvertTS_Transform(glueContext, InputRaw_Node)

SaveData_Transform(ConvertTS_Node, args["preds_path"], "item_id")

##################################################
# PART 2: Add battery-level data for SOH and RUL #
##################################################


QD_ORIG = {}


def get_qd_orig(batt):
    return QD_ORIG[batt]


# Extract battery ID from S3 file URI
def extract_battery(file):
    return file.split("/")[-1].split(".")[0][:2]


def calc_soh(qd, batt, qd_orig):
    soh = qd * 100 / qd_orig
    soh = py_builtin.min(soh, 100.0)
    return str(round(soh, 2))


# calculated assuming constant decay
# Qd = Qd_orig - J*cycle
def calc_rul(qd, batt, cycle, qd_orig):
    qd_dead = 0.8 * qd_orig
    if qd == qd_orig:
        return 100.0

    c_dead = cycle * (qd_dead - qd) / (qd - qd_orig)
    rul = (c_dead - cycle) * 100 / c_dead
    return round(py_builtin.min(rul, 100.0), 2)


# calcualted assuming logarithmic decay
# Qd = Qd_orig * J^cycle
def calc_rul2(qd, batt, cycle, qd_orig):
    qd_dead = 0.8 * qd_orig
    if qd == qd_orig:
        return 100.0

    c_dead = cycle * math.log(qd_dead / qd) / math.log(qd / qd_orig)
    rul = (c_dead - cycle) * 100 / c_dead
    return round(py_builtin.min(rul, 100.0), 2)


battUDF = udf(lambda i: extract_battery(i))
origUDF = udf(lambda i: get_qd_orig(i), "float")
sohUDF = udf(lambda i, j, k: calc_soh(i, j, k))
rulUDF = udf(lambda i, j, k, l: calc_rul(i, j, k, l))


# Read data from directory
def read_frame(key) -> DynamicFrame:
    return glueContext.create_dynamic_frame.from_options(
        format_options={
            "quoteChar": '"',
            "withHeader": True,
            "separator": ",",
            "optimizePerformance": True,
        },
        connection_type="s3",
        format="csv",
        connection_options={
            "paths": [f"s3://{bucket}/{base_path}/{key}/"],
            "recurse": False,
        },
    )


# Take avg of cell Qd values across cycles for each battery
def get_avg_qd(df):
    df = (
        df.withColumn("batt", battUDF(input_file_name()))
        .withColumn("cycle", df["cycle_no"].cast("int"))
        .withColumn("qd", df["qd"].cast("float"))
    )

    return df.groupBy("batt", "cycle").mean("qd").withColumnRenamed("avg(qd)", "qd").sort("cycle")


# Store original Qd values for each battery in dictionary
def calc_qd_orig(df):
    min_cycle = df.select(min_("cycle")).first().asDict()["min(cycle)"]
    df_min = df.filter(df["cycle"] == min_cycle).drop("cycle")
    data_min = df_min.toPandas().to_dict(orient="list")

    for i in range(0, len(data_min["batt"])):
        key = data_min["batt"][i]
        val = data_min["qd"][i]
        QD_ORIG[key] = val


# Add SOH and RUL calculations to Frame
def AddStats_Transform(glueContext, key) -> DynamicFrame:
    df = read_frame(key).toDF()
    df = get_avg_qd(df)

    if key == "past":
        calc_qd_orig(df)

    df = (
        df.withColumn("qd_orig", origUDF("batt"))
        .withColumn("soh", sohUDF("qd", "batt", "qd_orig"))
        .withColumn("rul", rulUDF("qd", "batt", "cycle", "qd_orig"))
    )
    df = df[["cycle", "soh", "rul", "qd", "batt"]]

    return DynamicFrame.fromDF(df, glueContext, f"{key}_stats_loaded")


# Delete /plot directory
boto3.resource("s3").Bucket(bucket).objects.filter(Prefix=output_path).delete()

# Load QD, SOH and RUL values by battery
for key in ["past", "actual", "predictions"]:
    StatsLoaded_Node = AddStats_Transform(glueContext, key)

    # Save data partitioned by battery in /plot
    SaveData_Transform(StatsLoaded_Node, f"{output_path}/{key}", "batt")

# Delete /tmp directory
boto3.resource("s3").Bucket(bucket).objects.filter(Prefix=base_path).delete()

job.commit()
