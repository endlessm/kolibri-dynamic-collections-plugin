#!/usr/bin/env python3
import sys

from setuptools import setup

import kolibri_dynamic_collections_plugin


def read_file(fname):
    """
    Read file and decode in py2k
    """
    if sys.version_info < (3,):
        return open(fname).read().decode("utf-8")
    return open(fname).read()


dist_name = "kolibri_dynamic_collections_plugin"
plugin_name = "kolibri_dynamic_collections_plugin"
repo_url = "https://github.com/endlessm/kolibri-dynamic-collections-plugin"

readme = read_file("README.md")

# Default description of the distributed package
description = """Kolibri plugin to add a Zim file viewer"""


setup(
    name=dist_name,
    version=kolibri_dynamic_collections_plugin.__version__,
    description=description,
    long_description=readme,
    long_description_content_type="text/markdown",
    author="Endless OS Foundation",
    author_email="dylan@endlessos.org",
    url=repo_url,
    packages=[
        str(plugin_name),  # https://github.com/pypa/setuptools/pull/597
    ],
    entry_points={
        "kolibri.plugins": plugin_name + " = " + plugin_name,
    },
    package_dir={plugin_name: plugin_name},
    install_requires=[],
    include_package_data=True,
    license="MIT",
    zip_safe=False,
    keywords="kolibri",
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: Implementation :: PyPy",
    ],
)
