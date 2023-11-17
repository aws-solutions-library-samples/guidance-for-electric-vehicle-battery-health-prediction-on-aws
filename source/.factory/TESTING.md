# Submitter Testing Guide

## Testing demos using Isengard _burner_ accounts

Example Scenario:

-   My email is `norrich@amazon.com`
-   My manager is `leebru`
-   Launching a demo called `Jelly Bean Dispenser`
-   My preferred region is `us-east-1`

1. Create a temporary isengard account for your test:

    ```sh
    isengardcli create 'norrich+jellybean@amazon.com' \
        --region 'us-east-1' \
        --title 'Jelly Bean Dispenser' \
        --description 'Temporary account for Jelly Bean Dispenser demo' \
        --secondary-owner 'leebru'
    ```

    > **NOTE:** For best practices, your secondary owner should be your manager.

1. Assume the role (take on the identity) of this new account:

    > **NOTE:** This will export the credentials as environment variables, which are picked up automatically when AWS tools are used. This also allows the credentials to be passed to the deployment process.

    ```sh
    $(isengardcli creds norrich+jellybean)
    ```

1. Go to [Demo Factory](https://demo-factory.corp.amazon.com/) and follow the instructions _exactly_ to launch and test your demo.

    > **NOTE:** If your demo does not appear, it is likely not yet published. Add `?review=true` to see all entries, including those still in development.

## Submitter FAQ

If you run into any issues during developement consider the following before asking for help.

### I changed my dockerfile and now go.sh isn't working?

Make sure if you change the Dockerfile you keep yq and awscli, those dependencies are required for the go.sh to work. Be careful when changing the Dockerfile because we can only insure hte base one works, if you need to add dependencies it's adviced to add to it rather than changing the Dockerfile entirely.

### Why does my script keep exiting? My deploy script works fine.

These scripts _will_ exit and kill your program if you do not implement them. They are **required** for Demo Factory as the system relies on \_deploy.sh and the user relies on \_post_deploy.sh for instructions.

### I pushed my code to DF but I'm not seeing my Demo on the website?

Did you ensure you're meeting all of the manfest requirements? You need 2 screenshots and 1 diagram, this is a common reason the submission will fail. If you still don't know, check the Step Functions launches, yours should be there as a failed launch. When updating your manifest **DO NOT** fill them in just to pass tests. You will have to go back and update them, and it makes presentation issues harder to catch. Write manifest/presentation elements first before testing your deployments.

### Testing on DF is slow, you have to wait for an accoutn to provision every time you launch. Is there a faster way to do it?

Before launching through DF you should consider how you test it. DF is using real resources and additionally has a slower start up time to deploy accounts. For rapid and frugal testing consider the following:

1. Test your deploy.sh locally, if this script doesn't run your demo won't work
   **Note** If you're having environment set up issues you can skip testing deploy.sh on it's own
2. Test go.sh this is what DF runs. If go.sh works your demo is much more likely to work on DF. Make sure to have Docker installed, and set any necessary Environemnt Variables that DF would set for you (f.g CUSTOMER_NAME, CUSTOMER_LOGO)
3. Launch in YOUR account on DF. When launching your demo on DF if you set an account id under 'Advanced' you will be able to launch a demo directly into your **new** AWS account. Ensure you've launched the trust relationship with this [CFN LINK](https://console.aws.amazon.com/cloudformation/home?#/stacks/new?stackName=DemoFactoryAdminAccess&templateURL=https://cf-templates-v5hhy4bi69px-us-east-1.s3.amazonaws.com/20213551W4-DemoFactory_CrossAccountRole.template4kl9xtkhayu)
4. Finally test by launching into a new account. If you've succesfully completed steps 1-3 there is very little that would cause this step to fail.

### I'm stuck and there's no maintainers around, how do I fix my issue?

Post in the [#prototyping-demofactory](https://amzn-aws.slack.com/archives/C01UAL8FGH5) slack channel. Many Amazonians who've submitted to DF are in that chat and have experience submitting to DF. They've likely ran into your issues.

## Cleaning up

Once you are finished with testing, delete the temporary account:

```sh
isengardcli delete 'norrich+jellybean'
```
