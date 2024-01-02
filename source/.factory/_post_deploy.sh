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

# Tutorial: Using this we can specifically name the stack. Be aware of what this is as
# it's used to retrieve outputs later to give to the user
STACK_NAME="$DEMO_ID"


echo "Once you login, to start a pipeline, access the sample dataset and processing plugin from the Resources section of the demo in demo factory."
echo "Go to the following link to access your website (Please prefix https to the link):"
echo "https://"$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?contains(OutputKey, 'CloudFrontDistributionDomainName')].OutputValue" --output text)
echo "You should have received login information at your email from cognito. Use this to access the demo."

# UNCOMMENT for feedback for demo
echo "Thoughts on the ${DEMO_NAME} demo?"
echo "Provide feedback or report bugs here: https://form.asana.com/?k=KTZJvDeoFi-64P2VUvRQYQ&d=8442528107068"
