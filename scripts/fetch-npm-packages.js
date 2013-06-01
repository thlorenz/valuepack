#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , sublevel   =  require('level-sublevel')
  , leveldb    =  require('../lib/leveldb')
  , dump       =  require('../lib/dump')
  , store      =  require('../lib/store-npm-users')
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
var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'all.json'), 'utf8')
leveldb.open(function (err, db) {
  if (err) return done(err);
  db = sublevel(db);
  //get(db, json, retrieveOnly.bind(null, db, done))
  retrieveOnly(db, done);
})

function done(err, db) {
  if (err) { 
    console.trace();
    console.error(err);
  }
  console.log('closing db');
  db && db.close()
}
