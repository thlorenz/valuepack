# valuepack

Community driven rating system for nodejs modules on npm in order to help in selecting the right one.

Read more [about its goals](https://github.com/thlorenz/valuepack/blob/master/goals.md).


## scripts

You can play with scripts inside `./scripts`.

All `store-*` scripts take parameters. 

- `--read` read out values of the store instead of adding them
- `--keys` pull out and print keys only
- `--values` pull out and print values only

#### store-npm-packages specific parameters

- `--owners` list owner indexes instead of packages
- `--keyword` list keyword indexes instead of packages

#### store-npm-users specific parameters

- `--github` list github login indexes instead of users

### examples

    # get package keyword count
    store-npm-packages.js --read --keyword --keys | wc -l

    # get package count
    store-npm-packages.js --read --keys | wc -l
