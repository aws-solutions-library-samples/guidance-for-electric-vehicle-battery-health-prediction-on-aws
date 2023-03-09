## Guidance for Electric Vehicle (EV) Battery Health Prediction on AWS

#### Introduction 

EV batteries, predominately lithium-ion (Li-ion) batteries, have been the bottleneck for scaling EVs, which are crucial to a net-zero economy. One challenge in the EV battery ecosystem is insufficient and inaccurate battery state of health (SOH) and remaining useful life (RUL) monitoring and prediction, resulting in shortened battery lifespan, driver frustration, lack of visibility for end-of-life processing, and wasted critical materials. Instead of the conventional static rule-of-thumb formulas, this Guidance showcases how customers can leverage the AI/ML capabilities on AWS to easily predict SOH and RUL. Better monitoring and more accurate prediction can help customers extend battery lifespan, improve driver satisfaction, reduce material waste and supply chain risks, and drive towards a sustainable future for mobility.

The sample code in this project deploys an event-driven ML pipeline for EV Battery health prediction. It also deploys a front-end digital twin displaying battery health status and prediction results. The front-end web UI also allows users to upload battery health data and processing plugin files (script to clean up data) which trigger the ML pipeline.

#### Architecture

Here is the reference architecture for this project:
![Architecture](assets/architecture.png)


## Getting Started

#### Requirements

* [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured
* [Git Installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed
* [AWS Cloud Developer Kit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) installed and configured


#### Deploying the CDK stack


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## Cleanup


## License

This library is licensed under the MIT-0 License. See the LICENSE file.

