# Developer Submission

Read more on how to submit a demo on the [Demo Factory Wiki](https://w.amazon.com/bin/view/Global_Accounts_Solutions_Builder/DemoFactory/SubmitDemo)

To publish your demo, please review and perform the following tasks:

-   [ ] The [Demo Manifest](manifest.yaml) has been created using the [default manifest](default-manifest.yaml) as a template.
-   [ ] The [deploy script](_deploy.sh) executes all deployment steps to build and deploy the demo to an AWS account.
-   [ ] No credentials or protected information are requested in my `launchParameters`.
-   [ ] No hard-coded AWS attributes (region, credentials, etc) are present in my source code.
    -   The following variables are provided automatically as part of the launch process: `AWS_REGION`, `AWS_USER`, `AWS_ACCOUNT_ID`
-   [ ] My demo has no reliance on _non-public_ hosted resources.
-   [ ] No predefined and/or hard-coded customer references are present, including, but not limited to names, branding, logos, and/or data.
    -   Any branding should be defined by leveraging the built-in `CUSTOMER_NAME` & `CUSTOMER_LOGO` environment variables.
-   [ ] `DEMO_NAME` environment variable is used in all identifiers, including resource tagging, to allow each deployment to be unique.
-   [ ] All AWS actions (SDK and/or CLI) are not hardcoded, thereby honoring [configuration precedence](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence)
    -   It is assumed that the launch process will be executed in an environment with the AWS security context already defined.
-   [ ] All required source code and assets are committed to the provided repository.
-   [ ] I have verified that the [demo factory submission pipeline](https://eu-west-1.console.aws.amazon.com/states/home?region=eu-west-1#/statemachines/view/arn:aws:states:eu-west-1:296829188063:stateMachine:StateMachine2E01A3A5-8xBPws9YB3TT) is PASSING.
-   [ ] I have reviewed the unpublished demo details on [Demo Factory](https://demo-factory.corp.amazon.com?review=true) for readability and accuracy.
-   [ ] I have fully deployed and tested the demo in a NEW account using only the published steps on the demo page (see [TESTING](TESTING.md))
