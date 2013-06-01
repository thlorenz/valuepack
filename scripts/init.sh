#!/usr/bin/env bash

[ -d ~/.valuepack ]       || mkdir ~/.valuepack
[ -d ~/.valuepack/data ]  || mkdir ~/.valuepack/data

VALUEPACK_DATA=~/.valuepack/data
VALUEPACK_DB=~/.valuepack/valuepack.db

echo 'Fetching npm users information from npm registry'
VALUEPACK_DATA=$VALUEPACK_DATA ./fetch-npm-users.js

echo 'Fetching npm packages information from npm registry'
VALUEPACK_DATA=$VALUEPACK_DATA ./fetch-npm-packages.js

echo 'Rebuilding database from fetched information'
VALUEPACK_DATA=$VALUEPACK_DATA VALUEPACK_DB=$VALUEPACK_DB ./rebuild-store.js

echo 'Your valuepack has been initialized at ~/.valuepack.'
command -v tree >/dev/null 2>&1 && tree ~/.valuepack

echo ""
echo "Be sure to include the below as environment variables when executing valuepack scripts:"
echo "    VALUEPACK_DATA=$VALUEPACK_DATA"
echo "    VALUEPACK_DB=$VALUEPACK_DB"
echo ""
echo "Example:"
echo ""
echo "VALUEPACK_DATA=$VALUEPACK_DATA VALUEPACK_DB=$VALUEPACK_DB ./store-npm-packages.js --read --keys | wc -l"
