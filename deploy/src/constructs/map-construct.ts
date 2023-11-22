/**
 * Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 *
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *   http://aws.amazon.com/asl/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const map = cdk.aws_location;

export class MapConstruct extends Construct {
  public cfnMap: cdk.aws_location.CfnMap;

  constructor(parent: Construct, name: string, props: any) {
    super(parent, name);

    const stack = cdk.Stack.of(this);
    const ts = new Date().getTime();
    this.cfnMap = new map.CfnMap(this, name, {
      mapName: `${stack}-battery-location-map-${ts}`,
      configuration: {
        style: "VectorEsriNavigation",
      },
      description: "Locations of each battery",
      pricingPlan: "RequestBasedUsage",
    });
  }
}
