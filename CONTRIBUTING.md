# Contributing

I'm happy you want to contribute. To guarantee a healthy state of this library, please make sure you read and fulfil the following sections.

## General

- Use [JavaScript Standard Style](https://standardjs.com/)
- Watch for a clean and readable code style. More [here](https://medium.com/javascript-scene/elements-of-javascript-style-caa8821cb99f)
- Avoid JavaScript before [ES6](http://es6-features.org/) wherever possible
- Edit or add tests if appropriate

## Commits

You must follow the [Angular commit schema](https://gist.github.com/stephenparish/9941e89d80e2bc58a153). Commits are linted and will fail if not following the schema so. This helps to be consistent across developers and makes [semantic release](https://github.com/semantic-release/semantic-release) available.

## Build and release

You don't need to take care of any library building when you are finished. Releases are done automatically by [semantic-release](https://github.com/semantic-release/semantic-release). You must follow the given commit schema (see [Commits section](#commits)) to trigger an automatic release with the correction versioning.