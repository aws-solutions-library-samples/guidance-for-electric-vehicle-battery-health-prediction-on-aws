""" 
Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at

  http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied. See the License for the specific language governing
permissions and limitations under the License.
"""

import os
import shutil
import sys
import subprocess

# Prepares the all the lambdas for deployment
#
# Walks each directory looking for a build script and executes it if found

def exit_on_failure(exit_code, msg):
    if exit_code != 0:
        print(msg)
        exit(exit_code)

build_file_name = "build.py"

npm_cmd = shutil.which("npm")
cmd = [npm_cmd, "install"]
proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
exit_on_failure(proc.returncode, "Web app npm install failed")

dir_path = os.path.dirname(os.path.realpath(__file__))
build_file_name = os.path.basename(__file__)
exit_code = 0

for file in os.listdir(dir_path):
    if os.path.isdir(file):
        folder_path = os.path.join(dir_path, file)
        build_file_path = os.path.join(folder_path, build_file_name)
        if os.path.exists(build_file_path):
            cmd = [sys.executable, build_file_path]
            proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
            exit_code = exit_code + proc.returncode


exit(exit_code)
