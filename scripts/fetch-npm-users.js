#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path        =  require('path')
  , fs          =  require('fs')
  , usersStream =  require('../lib/stream-npm-users')
  , dataDir     =  process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
  , jsonPath    =  path.join(dataDir, 'npm-users.json')

console.log('Storing fetched users data at: ', jsonPath);
usersStream().pipe(fs.createWriteStream(jsonPath, { encoding: 'utf8' }))
