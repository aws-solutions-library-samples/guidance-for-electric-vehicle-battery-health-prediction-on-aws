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

import { getGitContext } from "./git-context";

// returns configuration provider functions by name
export const getConfigProvider = (configType: "git") => {
    switch (configType) {
        case "git":
            return getGitContext;

        default:
            throw new Error(`Config provider ${configType} does not exist. Please choose another`);
    }
};
