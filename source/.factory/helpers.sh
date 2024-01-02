# If your deployment may exceed 1-hour (the session limit for role chaining),
# this helper function will check then renew the credentials.
# HINT: Use within a loop for long-running processes
check_aws_creds() {
  MINS_BEFORE_EXPIRE=${1:-5}

  if [ -n "${AWS_CRED_EXPIRATION}" ]; then
    expires_at=$(date -ud $AWS_CRED_EXPIRATION +%s)
    now=$(date +%s)
    delta=$(( $expires_at - $now ))
    # echo "AWS credentials are expiring in $(( $delta / 60 )) minute(s)"
    if [ $delta -le $(( $MINS_BEFORE_EXPIRE * 60 )) ]; then
      if [ -n "${AWS_ASSUME_ROLE_ARN}" ]; then
        echo -n "Reset AWS credentials before renewal..."
        CURRENT_ROLE=$(aws sts get-caller-identity)
        echo ${CURRENT_ROLE}
        unset AWS_ACCESS_KEY_ID
        unset AWS_SECRET_ACCESS_KEY
        unset AWS_SESSION_TOKEN
        unset AWS_CRED_EXPIRATION
        echo -n "Renewing credentials..."
        TEMP_ROLE=$(aws sts assume-role --role-arn "${AWS_ASSUME_ROLE_ARN}" --role-session-name "CodeBuildDeploy-Refresh")
        export AWS_ACCESS_KEY_ID=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.AccessKeyId')
        export AWS_SECRET_ACCESS_KEY=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.SecretAccessKey')
        export AWS_SESSION_TOKEN=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.SessionToken')
        export AWS_CRED_EXPIRATION=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.Expiration')
        echo "DONE"
      fi
    fi
  fi
}

# Renews AWS credentials
renew_aws_creds() {
  if [ -n "${AWS_ASSUME_ROLE_ARN}" ]; then
    echo -n "Reset AWS credentials before renewal..."
    CURRENT_ROLE=$(aws sts get-caller-identity)
    echo ${CURRENT_ROLE}
    unset AWS_ACCESS_KEY_ID
    unset AWS_SECRET_ACCESS_KEY
    unset AWS_SESSION_TOKEN
    unset AWS_CRED_EXPIRATION
    echo -n "Renewing credentials..."
    TEMP_ROLE=$(aws sts assume-role --role-arn "${AWS_ASSUME_ROLE_ARN}" --role-session-name "CodeBuildDeploy-Refresh")
    export AWS_ACCESS_KEY_ID=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.SessionToken')
    export AWS_CRED_EXPIRATION=$(echo "${TEMP_ROLE}" | jq -r '.Credentials.Expiration')
    echo "DONE"
  fi
}

############################
# Cognito Helper Functions #
############################
# Generates a password
# Example: generate_password
generate_password() {
  USER_PASSWD="TempPass%`awk -v min=0 -v max=10000 'BEGIN{srand(); print int(min+rand()*(max-min+1))}'`"
}

# Creates a cognito user
# Inputs:
# 1: AWS cognito user pool id
# 2: Email / username of user
# 3 (Optional): Password
# Example to input password: create_cognito_user $USER_POOL_ID $EMAIL $PASSWORD
# Example to generate password: create_cognito_user $USER_POOL_ID $EMAIL
create_cognito_user() {
  if [ "$#" -eq 2 ]; then
    generate_password
  else
    USER_PASSWD=$3
  fi
  echo "Start: Creating '$2' in Cognito user pool '$1' with password '$USER_PASSWD'"
  aws cognito-idp admin-create-user \
    --user-pool-id "$1" \
    --username "$2" \
    --temporary-password "$USER_PASSWD" \
    --user-attributes \
      Name="email",Value="$2" \
    --output text
  aws cognito-idp admin-set-user-password \
    --user-pool-id "$1" \
    --username "$2" \
    --password "$USER_PASSWD" \
    --permanent --output text
  echo "Finish: Creating '$2' in Cognito user pool '$1' with password '$USER_PASSWD'"
}

# Adds an existing Cognito user to a group
# Inputs:
# 1: AWS cognito user pool id
# 2: Email / username
# 3: Password
# Example: cognito_add_user_to_group $USER_POOL_ID $EMAIL $PASSWORD
cognito_add_user_to_group() {
  echo "Start: Adding '$2' to '$3' group in Cognito user pool '$1'"
  aws cognito-idp admin-add-user-to-group \
    --user-pool-id $1 \
    --username $2 \
    --group-name $3
  echo "Finish: Adding '$2' to '$3' group in Cognito user pool '$1'"
}

###############################
# CodeCommit Helper Functions #
###############################
# Download and upload a folder to CodeCommit then delete the CodeCommit repo
# Inputs:
# 1: AWS Region
# 2: CodeCommit repository name
# Example: upload_codecommit $AWS_REGION $REPO_NAME $SOURCE_DIR
upload_codecommit() {
  echo "Start: Deploying '$2' to CodeCommit in '$1'"
  git clone codecommit::$1://$2
  cd $2
  cp -R $3 .
  git add . && git commit -m "Demo Factory Deployment"
  git push origin master
  cd .. && rm -rf $2
  echo "Finish: Deploying '$2' to CodeCommit in '$1'"
}

############################
# Amplify Helper Functions #
############################
# Checks the frontend status to make sure frontend deployment is successful
# Inputs:
# 1: Amplify App ID
# Example: check_amplify_status $AMPLIFY_APP_ID
check_amplify_status () {
  echo "Start: Checking amplify status for app '$1'"
  while AMPLIFY_STATUS=$(aws amplify list-jobs --app-id $1 --branch-name master --query 'jobSummaries[0].status' --output text) && [ $AMPLIFY_STATUS = "RUNNING" ]; do
    check_aws_creds
    sleep 60
  done
  if [[ "$AMPLIFY_STATUS" == "FAILED" ]] ; then
    echo "========================================================="
    echo "Error: Amplify deployment failed."
    echo "========================================================="
    exit 1
  fi
  echo "Finish: Checking amplify status for app '$1'"
}
