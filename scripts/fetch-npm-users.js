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

function retrieveOnly() {
  level(dblocation, { valueEncoding: 'json' }, function (err, db) {
    if (err) return console.error(err);
    db = sublevel(db);

    var users    =  db.sublevel(npm.users, { valueEncoding: 'json' })
      , byLogin  =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' })
      , byGithub =  db.sublevel(npm.byLogin, { valueEncoding: 'utf8' });

    dump.keys(byGithub)
  })
}

function fetchAndStoreNpmUsers(cb) {
  // TODO: request this file from couch every time
  // https://registry.npmjs.org/-/users/
  var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'npm-users.json'), 'utf8')

  level.destroy(dblocation, function () {
    level(dblocation, { valueEncoding: 'json' }, function (err, db) {
      if (err) return console.error(err);
      db = sublevel(db);
      store(db, json,  function (err, subs) {
        if (err) return console.error(err);
        console.log('Stored all npm users at: ', dblocation);
        cb()
      })
    })
  })
}

if (~process.argv.indexOf('--fresh'))
  fetchAndStoreNpmUsers(retrieveOnly)
else 
  retrieveOnly()
