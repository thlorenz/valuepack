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
  , existsSync =  fs.existsSync || path.existsSync
  ;

function retrieveOnly(db, cb) {
  db = sublevel(db);

  var packages  =  db.sublevel(npm.packages, { valueEncoding: 'json' })
    , byOwner   =  db.sublevel(npm.byOwner, { valueEncoding: 'utf8' })
    , byKeyword =  db.sublevel(npm.byKeyword, { valueEncoding: 'utf8' });

  var sub = packages
    , what = 'all'
    , argv = process.argv;

  if (~argv.indexOf('--owner')) sub = byOwner
  if (~argv.indexOf('--keyword')) sub = byKeyword
  if (~argv.indexOf('--keys')) what = 'keys'
  if (~argv.indexOf('--values')) what = 'values'

  dump[what](sub, function(err) { cb(err, db) })
}

var storeNpmPackages = module.exports = function (db, cb) {
  var dataDir = process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
    , jsonPath = path.join(dataDir, 'npm-packages.json')

  if (!existsSync(jsonPath)) 
    return console.error('Cannot find %s. Please make sure to run fetch-npm-packages first', jsonPath);
    
  var json = fs.readFileSync(jsonPath, 'utf8')

  db = sublevel(db);
  store(db, json,  function (err, subs) {
    if (err) return cb(err, db);
    console.log('Stored all npm packages at: ', leveldb.location);
    cb(null, db)
  })
}

if (module.parent) return;

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
