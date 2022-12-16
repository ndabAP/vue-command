# Contributing

## General

- Use [JavaScript standard style](https://standardjs.com/)
- Use [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Conventional commits

You must follow the [conventional commits](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) schema. Commits are linted and will fail if
they are not following the schema. This helps to be consistent across developers
and makes
[semantic-release](https://github.com/semantic-release/semantic-release)
possible.

If you change the `README.md`, use `docs!` to trigger a breaking change
(increases major version) to make the change visible at the npm registry.

## Build and release

You don't need to take care of any library building when you are finished.
Releases are done automatically by
[semantic-release](https://github.com/semantic-release/semantic-release). You
must follow the given commit schema
(see [Conventional commits](#Conventional-commits)) to trigger an automatic
release with the correct versioning.
