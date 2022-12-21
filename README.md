# Kolibri Dynamic Collections Editor plugin

This is a Kolibri plugin to edit dynamic collections, which are a new way to
bundle together content across multiple Kolibri channels.

## Usage

Install a release from pypi:

    pip install kolibri-dynamic-collections-plugin

Enable the plugin in Kolibri:

    kolibri plugin enable kolibri_dynamic_collections_plugin

## Development

### Getting started

Create a pipenv shell and then install additional dependencies using `bootstrap.sh`:

    pipenv shell
    ./scripts/bootstrap.sh

Install kolibri-dynamic-collections-plugin in editable mode:

    pip install -e .

To build front end code:

    yarn build

Refer to the [Usage instructions](#Usage) to enable the plugin.

### Submitting changes

Before submitting changes, please be sure to run the pre-commit checks:

    pre-commit run

If you can configure git to run these checks automatically:

    pre-commit install -f --install-hooks

## Creating a release

If you are releasing a new version, use `bump-version` with with `major`, `minor`, or `patch`. For example:

    yarn bump-version patch

This creates a new commit and a git tag. Push this to the remote:

    git push
    git push --tags

Create a `.whl` file:

    yarn dist

The file will be placed in the `dist/` directory.

Finally, upload the `.whl` file to PyPi:

    yarn release
