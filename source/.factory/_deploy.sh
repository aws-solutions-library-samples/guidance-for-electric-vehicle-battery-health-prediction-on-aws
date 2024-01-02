#!/usr/bin/env bash

set -o pipefail # FAIL FAST
source ${CURRENT_PATH}/helpers.sh
shopt -s expand_aliases

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
# Tutorial: In addition to these we added ADMIN_EMAIL so we can use this environment variable as well
echo $ADMIN_EMAIL

# Tutorial: This package uses stack_name to determine the stack, we'll just use the DEMO_ID from your manifest
export STACK_NAME="$DEMO_ID"

# Tutorial: Deployment scrips can be very complicated or very simple. Depending on your flow.
## It is recommended you try to keep all deployment of resources contained in CDK if possible
## There are exceptions to this such as training jobs or seeding data.
npm run build
# Sometimes the build can take a while -- if credentials run out you can refresh them with this helper function
renew_aws_creds
npm run deploy.bootstrap
renew_aws_creds
npm run deploy

# Deployment is done now we'll be puling the cognito user pool
COGNITO_USER_POOL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?contains(OutputKey, 'UserPoolId')].OutputValue" --output text)

# Now we're going to create a user using a helper functon, see helpers.sh for more details
echo "Creating user..."
create_cognito_user $COGNITO_USER_POOL $ADMIN_EMAIL
echo "Deployment complete."
