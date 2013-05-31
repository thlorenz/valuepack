'use strict';

var npmusers = 'npm-users'
  , npmpackages = 'npm-packages';

exports.npm = {

    users     :  npmusers
  , byLogin   :  'index-'    + npmusers    + '-byLogin'
  , byGithub  :  'index-'    + npmusers    + '-byGithub'

  , packages  :  npmpackages
  , byOwner   :  'index-'    + npmpackages + '-byOwner'
  , byKeyword :  'index-'    + npmpackages + '-byKeyword'
};
