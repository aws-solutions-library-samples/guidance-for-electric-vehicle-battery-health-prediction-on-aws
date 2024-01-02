#!/usr/bin/env bash

set -o pipefail # FAIL FAST
source ${CURRENT_PATH}/helpers.sh

# ENV Variables available include:
# - DEMO_NAME
# - DEMO_VER
# - DEMO_ID
# - DEMO_LABEL
# - AWS_ACCOUNT_ID
# - AWS_USER
# - AWS_REGION
#
# Run '.factory/go.sh check' to view all available parameters

# Ensuring CDK is installed
(cd deploy && npm install)

npm run destroy
