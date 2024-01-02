#!/usr/bin/env bash

#################### DO NOT EDIT ######################
##                                                   ##
##  This file is intended as an execution wrapper    ##
##      Please use _deploy, _post_deploy, and        ##
##       _delete for demo-specific commands.         ##
##                                                   ##
#######################################################

set -o pipefail # FAIL FAST

# Check if we are running on an M1 Mac
if [[ $(sysctl -n machdep.cpu.brand_string) =~ "Apple" ]]; then
	export DOCKER_DEFAULT_PLATFORM=linux/amd64
fi

export CURRENT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

command="$1"
label="$2"

# Check if we are inside container yet
if [[ "${DOCKER_RUNNING}" != "TRUE" ]]; then
    echo -n "Checking for Docker... "
    if docker version &> /dev/null; then
        echo "PASS"
    else
        echo "FAIL"
        echo ""
        echo "ERROR: docker is required"
        exit 2
    fi

    DOCKERFILE="${CURRENT_PATH}/../Dockerfile"
    if [ ! -f ${DOCKERFILE} ]; then
        DOCKERFILE="${CURRENT_PATH}/Dockerfile"
    fi

    # Try to pull 3 times before failing
    YQ_DOCKER_TAG="public.ecr.aws/muon/mirror/mikefarah/yq:4"
    echo "Pulling ${YQ_DOCKER_TAG}"
    n=0
    until [ "$n" -ge 3 ]; do
        docker pull -q ${YQ_DOCKER_TAG} &> /dev/null && break
        n=$((n+1))
        echo "  Retry #${n}, waiting 5 seconds..."
        sleep 5
    done

    TMP_ENV_FILE=$(mktemp df-XXXXXX)
    trap "rm -f ${TMP_ENV_FILE}" EXIT
    LAUNCH_PARAMS=$(cat ${CURRENT_PATH}/manifest.yaml | docker run -i --rm ${YQ_DOCKER_TAG} e '.launchParameters[].env' -)
    printf "CUSTOMER_NAME\nCUSTOMER_LOGO\n${LAUNCH_PARAMS}" > ${TMP_ENV_FILE}

    echo -n "Building image from '${DOCKERFILE}'... "
    build_cmd="docker build --build-arg AWS_CONTAINER_CREDENTIALS_RELATIVE_URI=$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI --build-arg AWS_REGION=$AWS_REGION -q -f ${DOCKERFILE} ${CURRENT_PATH}/.."
    DOCKER_IMAGE=$(${build_cmd})
    if [ $? -ne 0 ]; then
        echo "FAIL"
        echo ""
        echo "ERROR: Unable to build '${DOCKERFILE}', debug using:"
        echo "  ${build_cmd}"
    else
        echo "DONE"
    fi

    if [[ "$command" = "shell" ]]; then
        echo "Running /bin/bash from image ${DOCKER_IMAGE}:"
        echo ""
        docker run --privileged --rm -it \
            --env-file ${TMP_ENV_FILE} \
            -e DOCKER_RUNNING=TRUE \
            -e AWS_ACCESS_KEY_ID \
            -e AWS_SESSION_TOKEN \
            -e AWS_SECRET_ACCESS_KEY \
            -e AWS_CRED_EXPIRATION \
            -e AWS_ASSUME_ROLE_ARN \
            -e AWS_CA_BUNDLE \
            -e AWS_CLI_FILE_ENCODING \
            -e AWS_CONFIG_FILE \
            -e AWS_DEFAULT_OUTPUT \
            -e AWS_DEFAULT_REGION \
            -e AWS_PAGER \
            -e AWS_ROLE_SESSION_NAME \
            -e AWS_STS_REGIONAL_ENDPOINTS \
            -e AWS_REGION \
            -e AWS_CONTAINER_CREDENTIALS_RELATIVE_URI \
            -v ${CURRENT_PATH}/output:/src/.factory/output \
            --entrypoint /bin/bash \
            ${DOCKER_IMAGE}
        exit $?
    else
        echo "Running container from image ${DOCKER_IMAGE}:"
        echo ""
        docker run --privileged --rm -i \
            --env-file ${TMP_ENV_FILE} \
            -e DOCKER_RUNNING=TRUE \
            -e AWS_ACCESS_KEY_ID \
            -e AWS_SESSION_TOKEN \
            -e AWS_SECRET_ACCESS_KEY \
            -e AWS_CRED_EXPIRATION \
            -e AWS_ASSUME_ROLE_ARN \
            -e AWS_CA_BUNDLE \
            -e AWS_CLI_FILE_ENCODING \
            -e AWS_CONFIG_FILE \
            -e AWS_DEFAULT_OUTPUT \
            -e AWS_DEFAULT_REGION \
            -e AWS_PAGER \
            -e AWS_ROLE_SESSION_NAME \
            -e AWS_STS_REGIONAL_ENDPOINTS \
            -e AWS_REGION \
            -e AWS_CONTAINER_CREDENTIALS_RELATIVE_URI \
            -v ${CURRENT_PATH}/output:/src/.factory/output \
            ${DOCKER_IMAGE} $command $label
        exit $?
    fi
fi

check_reqs() {
    echo -n "Checking for yq - YAML processor... "
    if ! command -v yq &> /dev/null; then
        echo "FAIL"
        echo ""
        echo "ERROR: yq is required"
        exit 2
    else
        echo "PASS"
    fi

    echo -n "Checking for AWS CLI... "
    if ! command -v aws &> /dev/null; then
        echo "FAIL"
        echo ""
        echo "ERROR: aws is required"
        exit 2
    else
        echo "PASS"
    fi

    echo -n "Checking for valid AWS credentials... "
    AWS_CALLER=$(aws sts get-caller-identity --output json 2> /dev/null)
    if [ $? -ne 0 ]; then
        echo "FAIL"
        echo ""
        echo "ERROR: Unable to retrieve AWS caller identity, credentials are invalid"
        echo "  If using isengard: '\$(isengardcli creds)' will export credentials as environment variables."
        exit 2
    fi
    export AWS_ACCOUNT_ID=$(jq -r '.Account' - <<< "$AWS_CALLER")
    export AWS_USER=$(jq -r '.UserId' - <<< "$AWS_CALLER")
    if [ -z "${AWS_ACCOUNT_ID}" ] || [ -z "${AWS_USER}" ]; then
        echo "FAIL"
        echo ""
        echo "ERROR: Unable to identify AWS Account ID and/or User from credentials, debug using:"
        echo "  aws sts get-caller-identity"
        exit 2
    fi
    echo "PASS"
    export CDK_DEFAULT_ACCOUNT=${AWS_ACCOUNT_ID}

    echo -n "Fetching default AWS region... "
    if [[ -z "${AWS_REGION}" ]]; then
        if [[ -z "${AWS_DEFAULT_REGION}" ]]; then
            echo "FAIL"
            echo ""
            echo "ERROR: AWS region must be specified, set AWS_DEFAULT_REGION or AWS_REGION"
            exit 2
        else
            AWS_REGION=${AWS_DEFAULT_REGION}
        fi
    fi
    echo "DONE"
    export AWS_REGION
    export CDK_DEFAULT_REGION=${AWS_REGION}

    echo -n "Setting default launch parameters... "
    export CUSTOMER_NAME=${CUSTOMER_NAME:-"Amazon Web Services"}
    export CUSTOMER_LOGO=${CUSTOMER_LOGO:-"https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"}
    echo "DONE"

    MANIFEST_FILE="${CURRENT_PATH}/manifest.yaml"
    echo -n "Looking for manifest file... "
    if [ ! -f ${MANIFEST_FILE} ]; then
        echo "FAIL"
        echo ""
        echo "ERROR: Manifest file not found at '${MANIFEST_FILE}'"
        exit 2
    else
        echo "PASS"
    fi

    echo -n "Parsing manifest... "
    export DEMO_NAME=$(yq e '.title' ${MANIFEST_FILE})
    export DEMO_VER=$(yq e '.releaseVersion' ${MANIFEST_FILE})
    export DEMO_ID=$(yq e '.id' ${MANIFEST_FILE})
    RAND=$(LC_CTYPE=C tr -dc abcdefg0123456789 </dev/urandom | head -c 8 ; echo '')
    export DEMO_LABEL=${label:-"${DEMO_ID}-${RAND}"}
    echo "DONE"
}

show_details() {
    SHOW_PARAMS=true

    echo ""
    echo "---------------------------- Environment ----------------------------"
    echo "  DEMO ID: ${DEMO_ID}"
    echo "  DEMO NAME: ${DEMO_NAME}"
    echo "  DEMO VERSION: ${DEMO_VER}"
    echo "  DEMO LABEL:   ${DEMO_LABEL}"
    echo "  AWS ACCOUNT ID: ${AWS_ACCOUNT_ID}"
    echo "  AWS USER:    ${AWS_USER}"
    echo "  AWS REGION:  ${AWS_REGION}"

    if $SHOW_PARAMS; then
        echo ""
        echo "  CUSTOMER_NAME: ${CUSTOMER_NAME}"
        echo "  CUSTOMER_LOGO: ${CUSTOMER_LOGO}"
        LAUNCH_PARAMS=$(yq e '.launchParameters[].env' ${MANIFEST_FILE})
        if [[ ! -z "${LAUNCH_PARAMS}" ]]; then
            while IFS= read -r param; do
                if [ "${param}" != "CUSTOMER_NAME" ] && [ "${param}" != "CUSTOMER_LOGO" ]; then
                    echo -n "  ${param}: "
                    if [ -z "${!param}" ]; then
                        echo "---ERROR---"
                        echo ""
                        echo "ERROR: Missing parameter '${param}'"
                        exit 2
                    else
                        echo "${!param}"
                    fi
                fi
            done <<< "$LAUNCH_PARAMS"
        fi
    fi

    echo "---------------------------------------------------------------------"
    echo ""
}

if [[ "$command" = "check" ]]; then
    check_reqs
    show_details
elif [[ "$command" = "dryrun" ]]; then
    check_reqs
    show_details
    echo ""
    echo "(DRY RUN) Starting deployment process:"
    echo "  SKIP: source ${CURRENT_PATH}/_deploy.sh"
    echo "(DRY RUN) Generating post-deployment instructions..."
    echo "  SKIP: source ${CURRENT_PATH}/_post_deploy.sh | tee ${CURRENT_PATH}/output/post_deploy_instructions.txt"
    echo "DONE"
elif [[ "$command" = "deploy" ]]; then
    check_reqs
    show_details

    # Run docker in docker -- this allows CDK and other docker enabled demos to work
    dockerd &> dockerd-logfile &
    echo ""
    echo "Starting deployment process:"
    source ${CURRENT_PATH}/_deploy.sh
    echo -n "Generating post-deployment instructions..."
    source ${CURRENT_PATH}/_post_deploy.sh | tee ${CURRENT_PATH}/output/post_deploy_instructions.txt
    echo "DONE"
elif [[ "$command" = "delete" ]]; then
    check_reqs
    show_details false
    echo ""
    echo "Starting teardown process:"
    source ${CURRENT_PATH}/_delete.sh
else
    echo "USAGE:"
    echo "  $0 COMMAND [LABEL]"
    echo ""
    echo "COMMANDS:"
    echo "  check     Check for pre-requisites and print launch details"
    echo "  deploy    Run deployment process"
    echo "  delete    Run teardown process"
    echo "  dryrun    Dry run deployment process, skips deployment command"
    echo "  shell     Open shell inside deployment container"
    echo ""
    echo "OPTIONS:"
    echo "  label     Unique name used for deployment setup & teardown"
    echo ""
    exit 1
fi
