/**
 * Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 *
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/asl/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// import * as wafv2 from "@aws-cdk/aws-wafv2";
// import * as apigwv2 from "@aws-cdk/aws-apigatewayv2";
// import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

/**
 * Helper function to attach the waf to an apigatewayv2 http api
 * @param parent
 * @param name
 * @param webAcl
 * @param apigwv2
 * @returns
 */
export function attachWafV2ToLoadBalancer(
    /**
     * Parent construct to assign the association to.
     */
    parent: Construct,

    /**
     * Name of the construct
     */
    name: string,

    /**
     * WafV2 WebAcl
     */
    webAcl: cdk.aws_wafv2.CfnWebACL,

    /**
     * load balancer to attach the web acl to
     */
    loadBalancer: cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer
) {
    return new cdk.aws_wafv2.CfnWebACLAssociation(parent, name, {
        webAclArn: webAcl.attrArn,
        resourceArn: loadBalancer.loadBalancerArn,
    });
}
