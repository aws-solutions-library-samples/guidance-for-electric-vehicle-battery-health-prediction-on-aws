## Plugin Description

The processing plugin is expected to be a python script that accepts the raw dataset file uploaded in the previous step as input. The plugin will be run in an Apache Spark environment and, as such, also accepts operations from the PySpark API.

The plugin can expect `s3_bucket` and `raw_dataset_key` as arguments passed to it by the pipeline. With this information, the script can access the raw dataset file from within the SBM data store using the AWS SDK for Python (Boto3). It can be assumed that the script will have the necessary read-write permissions to S3 already granted.

The plugin should output a file titled `train_dataset.csv` which will be used for building the forecasting models. This file will have exactly 3 columns - without headers - in the stated order: 1. timestamp in the format `yyyy-MM-dd HH:mm:ss` 2. entity ID (usually at cell level), and 3. discharge capacity (Qd)

The training dataset should be saved to this S3 bucket in the same location as the raw dataset.
