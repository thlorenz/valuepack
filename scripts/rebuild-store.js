#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb       =  require('../lib/leveldb')
  , storeUsers    =  require('./store-npm-users')
  , storePackages =  require('./store-npm-packages')

function rebuild() {
  leveldb.destroy(function (err) {
    if (err) return console.error(err)

    leveldb.open(function (err, db) {
      if (err) return leveldb.close(err, db);
      console.log('destroyed db')

      storeUsers(db, function (err, db) {
        if (err) return leveldb.close(err, db);
        
        storePackages(db, function (err, db) {
          if (err) return leveldb.close(err, db);
          leveldb.close(err, db)
        })
      })
    })
  })
}

if (~process.argv.indexOf('--fetch'))
  console.error('Fetching coming soon')
else
  rebuild()
