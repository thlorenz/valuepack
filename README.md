# valuepack

Community driven rating system for nodejs modules on npm in order to help in selecting the right one.

Read more [about its goals](https://github.com/thlorenz/valuepack/blob/master/goals.md).


## scripts

You can play with scripts inside `./scripts`.

### environment variables

The following environment variables are considered by the scripts:

- `VALUEPACK_DATA` the directory in which json data fetched from the npm registry is stored (defaults to
  `valuepack-mine-npm/data`)
- `VALUEPACK_DB` the path at which the leveldb data is stored (defaults to `valuepack-mine-npm/store/valuepack.db`)

### rebuild script

In order to store all data in leveldb, please run:

    ./rebuild-store.js

**Note:** rebuilding the database from local json files takes about 2mins on a MacBookAir.

### store scripts

All `store-*` scripts take parameters. 

- `--read` read out values of the store instead of adding them
- `--keys` pull out and print keys only
- `--values` pull out and print values only

Therfore if you want to query data you should always pass the `--read` flag.

#### store-npm-packages specific parameters

- `--owners` list owner indexes instead of packages
- `--keyword` list keyword indexes instead of packages

#### store-npm-users specific parameters

- `--github` list github login indexes instead of users

### examples

    # get package keyword count
    ./store-npm-packages.js --read --keyword --keys | wc -l

    # get package count
    ./store-npm-packages.js --read --keys | wc -l

    # get how may users did provide a github account
    ./store-npm-users.js --read --github --keys | wc -l
