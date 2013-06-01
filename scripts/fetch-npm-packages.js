#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path           =  require('path')
  , fs             =  require('fs')
  , packagesStream =  require('../lib/stream-npm-packages')
  , dataDir        =  process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
  , jsonPath       =  path.join(dataDir, 'npm-packages.json')

console.log('Storing fetched packages data at: ', jsonPath);
packagesStream().pipe(fs.createWriteStream(jsonPath, { encoding: 'utf8' }))
