'use strict';

var level      =  require('level')
  , path       =  require('path')
  , dblocation =  path.join(__dirname, '..', 'store/valuepack.db');

exports.destroy =  level.destroy.bind(level, dblocation);
exports.open    =  level.bind(level, dblocation, { valueEncoding: 'json' });
