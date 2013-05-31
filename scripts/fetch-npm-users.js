#!/usr/bin/env node
'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , level      =  require('level')
  , sublevel   =  require('level-sublevel')
  , dump       =  require('../lib/dump')
  , store      =  require('../lib/store-npm-users')
  , npm        =  require('../lib/namespaces').npm
  , dblocation =  path.join(__dirname, '..', 'store/valuepack.db')
  ;

function retrieveOnly(db, cb) {
  db = sublevel(db);

  var users    =  db.sublevel(npm.users, { valueEncoding: 'json' })
    , byLogin  =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' })
    , byGithub =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' });

  dump.keys(byGithub, function(err) { cb(err, db) })
}

function fetchAndStoreNpmUsers(db, cb) {
  // TODO: request this file from couch every time
  // https://registry.npmjs.org/-/users/
  var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'npm-users.json'), 'utf8')
  db = sublevel(db);
  store(db, json,  function (err, subs) {
    if (err) return console.error(err);
    console.log('Stored all npm users at: ', dblocation);
    cb(null, db)
  })
}

if (~process.argv.indexOf('--fresh'))
  level.destroy(dblocation, function () {
    level(dblocation, { valueEncoding: 'json' }, function (err, db) {
      if (err) return done(err, db);
      fetchAndStoreNpmUsers(db, retrieveOnly.bind(null, db, done))
    })
  })
else 
  level(dblocation, { valueEncoding: 'json' }, function (err, db) {
    if (err) return done(err, db);
    retrieveOnly(db, done)
  })

function done(err, db) {
  if (err) console.error(err);
  console.log('closing db');
  db && db.close()
}
