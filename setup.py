"""setup.py for app"""

import os
import subprocess

from setuptools import find_packages, setup

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def get_git_sha() -> str:
    """Get the current git sha."""
    try:
        output = subprocess.check_output(["git", "rev-parse", "HEAD"])
        return output.decode().strip()
    except Exception:  # pylint: disable=broad-except
        return ""


GIT_SHA = get_git_sha()
VERSION_INFO_FILE = os.path.join(BASE_DIR, "VERSION.txt")
print("-==-" * 15)
print("VERSION: " + VERSION_INFO_FILE)
print("GIT SHA: " + GIT_SHA)
print("-==-" * 15)

VERSION_STRING = ""

with open(VERSION_INFO_FILE, "r", encoding="utf8") as version_file:
    VERSION_STRING = version_file.read().strip()
    if GIT_SHA:
        VERSION_STRING = f"{VERSION_STRING}+g{GIT_SHA[:8]}"

setup(
    version=VERSION_STRING,
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    download_url="https://github.com/inDB-ai/inDB-Web.git" + VERSION_STRING,
)
