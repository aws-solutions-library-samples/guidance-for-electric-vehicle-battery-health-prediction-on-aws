# Smart Battery Manager
## Tool Versions

To build and deploy this template the following tools are required.

1. NodeJs >= 14
2. Python3 >= 3.8
3. Docker

## Template Information (remove when used in a prototype)

Template Owner: Brandt Beal

This template is a foundational template for a S3 React Website and Api proxied through CloudFront with authentication using Cognito.

The application is deployed as a single stack, where Amplify Cognito configuration is provided by an unauthenticated api found at `/api/amplify-config`.

There are two stacks to this template.  A WAF CloudFront ACL can only be installed in us-east-1 and since a single CloudFormation template can't deploy to two regions, the WAF stack and App stack have to be separate.  Deployment is still a single command as both stacks are deployed when deploying the application.

**this version is built using CDK V2**

## Architecture

![architecture](./spa-serverless-single-stack-v2.architecture.png)

## IsengardCli

<INTERNAL> Use the isengardcli assume to assume a role in the destination account

## Build 

The top level package.json is only for easy to use top level commands and doesn't contain any packages so there is no reason to install it.  When pulling latest its always best to run a build all to ensure you have the latest code. 

To build the entire project run:

```
npm run build
```

Then during development, individual parts of the project can be built separately using the scoped commands:

```
npm run build.cdk
npm run build.web
npm run build.api
```

## Deploy

If you are deploying to a new account or region you will need to bootstrap the CDK.  By default CDK bootstraps with AdministratorAccess policy which is restricted in certain environments.  If you need greater access than PowerUserAccess and IAMFullAccess, add the role arns to the list.

If you are installing the application into a region other than `us-east-1` you must bootstrap both regions.  You can do this by setting the environment variable `CDK_DEPLOY_REGION` to us-east-1 and running the command below, then clearing the environment variable to pick up the set default.  Or you can manually run the command with both regions provided.  See statements below.

```
npm run deploy.bootstrap
```

or manually

```
cd cdk && npx cdk bootstrap --cloudformation-execution-policies "arn:aws:iam::aws:policy/PowerUserAccess,arn:aws:iam::aws:policy/IAMFullAccess"
// or
cd cdk && npx cdk bootstrap ${AWS_ACCOUNT}/us-east-1 ${AWS_ACCOUNT}/us-west-1 --cloudformation-execution-policies "arn:aws:iam::aws:policy/PowerUserAccess,arn:aws:iam::aws:policy/IAMFullAccess"
```

You can either deploy manually, use the CICD flow, or use both approaches.  For the integration branch it makes sense to use the CICD flow.  For feature branches, it's usually faster to deploy manually.
### Manual Deployment

To deploy an environment by branch name, run:

```
npm run deploy
```

To deploy other environments either copy the commands and rename the stack name or use the STACK_NAME environment variable :

```
export STACK_NAME="prod"
npm run deploy
```

### CICD Deployment

The CICD deployment uses the `branch name` to name the CICD, APP and WAF stacks when contained within a git repo, and `dev` if not.  The CICD CDK stack is separate from the Application stacks in the deploy folder so that it can be an optional method of deployment.  The CICD stack is just to assist with development and is optional.

1. Make sure the code is committed to the destination branch and push to CodeCommit.
2. Run: `npm run deploy.cicd` to deploy the cicd pipeline.  It will automatically deploy the stack for you.

For example, if you are on the `main` branch and deploy the CICD pipeline three stacks will be deployed

- main-cicd - the cicd stack
- main - the application stack
- main-waf - the waf stack in us-east-1

**Once deployed, you will need to create a Cognito User to access the web application.**

The project supports individual development environments as well.  Copy one of the deployment commands from the package.json file and change the name of the stack.  It's recommended to name individual environments with your initials and a numerical suffix so that the rest of the team knows who the stack belongs to.  For example: `bab01` is a good stack name.

## Build and Deploy

Here is a helper syntax to build and deploy in one step

```
npm run build && npm run deploy
```

To deploy into another account or region you can set the context variables by:

```
npm run deploy -- -c region=eu-west-1 - c
```


## Destroy

To destroy the dev environment, run:

```
npm run destroy
```

## Development

The top level project structure follows a responsibility structure:

- [/api](./api/README.md) - contains lambda functions for the api
- [/cicd](./cicd/README.md) - contains the continuous integration and deployment code
- [/deploy](./deploy/README.md) - contains cloud development kit (CDK) to deploy the solution
- [/web-app](./web-app/README.md) - contains the SPA web client for the application

Please see the README.md files in each folder for development rules and instructions.

# Cross Platform Notes

The build and deploy is cross platform to support both Windows and Mac/Linux users.  This section details common problems when extending the build system.

## Python subprocess.run

On Windows, Python's subprocess.run isn't able to find global commands like npm because the PATH isn't provided to the process.  Passing `env=os.environ` didn't seem to have any effect.  Using the parameter `shell=True` works on Windows but the command needs to be reformatted because of the way subprocess interprets the command based on this setting.  A work around is to use `shutil` to locate the full path to the command before running it.

```
import subprocess
import shutil

npm_cmd = shutil.which("npm")
cmd = [npm_cmd, "install"]
proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
```

# Troubleshooting

## Docker issues

### Build fails during a docker step due to `OSError: [Errno 28] No space left on device:` or something similar.

Open docker desktop, click on `Images`, click on `Clean up`, check `Unused` and `Dangling`, then click `Remove`.   

or run from the command line: `docker image prune -a`