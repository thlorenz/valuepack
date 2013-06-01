#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , leveldb    =  require('leveldb')
  , sublevel   =  require('level-sublevel')
  , dump       =  require('../lib/dump')
  , store      =  require('../lib/store-npm-users')
  , npm        =  require('../lib/namespaces').npm
  ;

function retrieveOnly(db, cb) {
  db = sublevel(db);

  var users    =  db.sublevel(npm.users, { valueEncoding: 'json' })
    , byLogin  =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' })
    , byGithub =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' });

  dump.keys(byGithub, function(err) { cb(err, db) })
}

// TODO: request this file from couch fresh before storing it
// https://registry.npmjs.org/-/users/
function storeNpmUsers(db, cb) {
  var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'npm-users.json'), 'utf8')

  db = sublevel(db);
  store(db, json,  function (err, subs) {
    if (err) return cb(err, db);
    console.log('Stored all npm users at: ', leveldb.location);
    cb(null, db)
  })
}

if (!~process.argv.indexOf('--read'))
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    storeNpmUsers(db, retrieveOnly.bind(null, db, leveldb.close))
  })
else 
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    retrieveOnly(db, leveldb.close)
  })