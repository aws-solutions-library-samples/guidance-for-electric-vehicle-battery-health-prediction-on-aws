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

import logging
import os
import shutil
import subprocess
import sys
import time

cdk_project_relative_paths = ["deploy/"]

_file = os.path.basename(__file__)
logger = logging.getLogger(f"{_file}{__name__}")
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


def timeit(func):
    def inner(*args, **kwargs):
        start = time.time()
        response = func(*args, **kwargs)
        end = time.time()
        logger.info(f"Exec time for {func.__name__}: {end-start} secs")
        return response

    return inner


def log_on_failure(exit_code, err_msg):
    if exit_code != 0:
        logger.warning(err_msg)


def change_dir_with_return(dir):
    current_dir = os.getcwd()
    os.chdir(dir)
    return lambda: os.chdir(current_dir)


@timeit
def get_cdk_stack_names(cdk_project_path):
    try:
        return_dir = change_dir_with_return(cdk_project_path)
        cdk_cmd = shutil.which("cdk")
        cmd = [cdk_cmd, "ls"]
        logger.info(f'Running "{cmd}" (from {os.getcwd()})')
        proc = subprocess.run(cmd, capture_output=True, text=True)
        log_on_failure(proc.returncode, proc.stderr)
        return proc.stdout.split()
    finally:
        if return_dir:
            return_dir()


@timeit
def cdk_synth(cdk_project_path, stack_name):
    try:
        return_dir = change_dir_with_return(cdk_project_path)
        cdk_cmd = shutil.which("cdk")
        cmd = [cdk_cmd, "synth", stack_name]
        logger.info(f'Running "{cmd}" (from {os.getcwd()})')
        proc = subprocess.run(cmd, capture_output=True, text=True)
        log_on_failure(proc.returncode, proc.stderr)
        template_file = f"{os.getcwd()}/cdk.out/{stack_name}.template.json"
        logger.info(f"CDK has synthetized template file: {template_file}")
        return template_file
    finally:
        if return_dir:
            return_dir()


@timeit
def prepare_for_cdk_synth(cdk_project_path):
    try:
        logger.info(f"Preparing to synthetize CDK stacks at: {cdk_project_path}")
        return_dir = change_dir_with_return(cdk_project_path)
        npm_cmd = shutil.which("npm")
        cmd = [npm_cmd, "run", "build"]
        logger.info(f'Running "{cmd}" from {os.getcwd()}')
        proc = subprocess.run(cmd, capture_output=True, text=True)
        log_on_failure(proc.returncode, proc.stderr)
    finally:
        if return_dir:
            return_dir()


def validate_input():
    if len(sys.argv) < 2:
        logger.info("Please specify the full path of the CDK project to synthesize")
        exit(1)
    project_root_dir = sys.argv[1]
    if project_root_dir[-1] == "/":
        project_root_dir = project_root_dir[:-1]
    logger.info(f"Project root directory: {project_root_dir}")
    return project_root_dir


@timeit
def main():
    project_root_dir = validate_input()
    prepare_for_cdk_synth(project_root_dir)
    logger.info(f"CDK projects identified (relative from root directory): {cdk_project_relative_paths}")
    for cdk_project_path in cdk_project_relative_paths:
        cdk_project_path = f"{project_root_dir}/{cdk_project_path}"
        logger.info(f"Processing CDK project:  {cdk_project_path}")
        stack_names = get_cdk_stack_names(cdk_project_path)
        if stack_names:
            logger.info(f"CDK stacks identified: {stack_names}")
            failed_stacks = []
            for stack_name in stack_names:
                try:
                    cdk_synth(cdk_project_path, stack_name)
                except Exception as e:
                    logger.error(e)
                    failed_stacks.append(stack_name)
            if failed_stacks:
                logger.warn("The following stacks failed to synthesize: {failed_stacks}")


if __name__ == "__main__":
    main()
