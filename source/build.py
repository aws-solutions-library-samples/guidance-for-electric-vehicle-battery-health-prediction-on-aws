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

import argparse
import os
import subprocess
import sys


def exit_on_failure(exit_code, msg):
    if exit_code != 0:
        print(msg)
        exit(exit_code)


def change_dir_with_return(dir):
    current_dir = os.getcwd()
    os.chdir(dir)
    return lambda: os.chdir(current_dir)


def build_api():
    return_dir = change_dir_with_return("./api")

    cmd = [sys.executable, "build.py"]
    proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
    exit_on_failure(proc.returncode, "Api build failed")

    return_dir()


def build_web_app():
    return_dir = change_dir_with_return("./web-app")
    cmd = [sys.executable, "build.py"]
    proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
    exit_on_failure(proc.returncode, "Web app build failed")

    return_dir()


def build_deploy():
    return_dir = change_dir_with_return("./deploy")
    cmd = [sys.executable, "build.py"]
    proc = subprocess.run(cmd, stderr=subprocess.STDOUT)
    exit_on_failure(proc.returncode, "Deploy build failed")

    return_dir()


def main():
    parser = argparse.ArgumentParser(
        description="Builds parts or all of the solution.  If no arguments are passed then all builds are run"
    )
    parser.add_argument("--web", action="store_true", help="builds web app")
    parser.add_argument("--api", action="store_true", help="builds api")
    parser.add_argument("--deploy", action="store_true", help="builds deploy")
    args = parser.parse_args()

    if len(sys.argv) == 1:
        build_web_app()
        build_api()
        # needs to be last to ensure the dependencies are built before the CDK deployment can build/run
        build_deploy()
    else:
        if args.web:
            build_web_app()
        if args.api:
            build_api()
        if args.deploy:
            build_deploy()


if __name__ == "__main__":
    main()
