#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , sublevel   =  require('level-sublevel')
  , leveldb    =  require('../lib/leveldb')
  , dump       =  require('../lib/dump')
  , store      =  require('../lib/store-npm-packages')
  , npm        =  require('../lib/namespaces').npm
  ;

function retrieveOnly(db, cb) {
  db = sublevel(db);

  var packages  =  db.sublevel(npm.packages, { valueEncoding: 'json' })
    , byOwner   =  db.sublevel(npm.byOwner, { valueEncoding: 'utf8' })
    , byKeyword =  db.sublevel(npm.byKeyword, { valueEncoding: 'utf8' });

  dump.all(byOwner, function(err) { cb(err, db) })
}

// TODO: request this file from couch every time
// https://registry.npmjs.org/-/all/
function storeNpmPackages(db, cb) {
  var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'all.json'), 'utf8')

  db = sublevel(db);
  store(db, json,  function (err, subs) {
    if (err) return cb(err, db);
    console.log('Stored all npm packages at: ', leveldb.location);
    cb(null, db)
  })
}

if (!~process.argv.indexOf('--read'))
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    storeNpmPackages(db, retrieveOnly.bind(null, db, leveldb.close))
  })
else 
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    retrieveOnly(db, leveldb.close)
  })
