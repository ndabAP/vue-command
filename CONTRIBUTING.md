# Contributing

I'm happy you want to contribute. Please make sure you read and fulfil the following sections.

## General

- Use [JavaScript Standard Style](https://standardjs.com/)
- Watch for a clean and readable code style. More [here](https://medium.com/javascript-scene/elements-of-javascript-style-caa8821cb99f)
- Don't be afraid of new JavaScript features
- Edit or add tests if appropriate

## Commits

You must follow the [conventional commits schema](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional). Commits are linted and will fail if not following the schema so. This helps to be consistent across developers and makes [semantic release](https://github.com/semantic-release/semantic-release) possible.

If you change the `README.md`, use `docs!` to trigger a breaking change (increases major version) to make the change visible at npmjs.com.

## Build and release

You don't need to take care of any library building when you are finished. Releases are done automatically by [semantic-release](https://github.com/semantic-release/semantic-release). You must follow the given commit schema (see [Commits section](#commits)) to trigger an automatic release with the correct versioning.
