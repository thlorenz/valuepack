'use strict';
var npm = require('./namespaces').npm;

function getMaintainer(maintainers) {
  return maintainers && maintainers[0];
}

function getOwner(maintainer) {
  if (   maintainer 
      && maintainer.name
      && maintainer.name.length)
      return maintainer.name;

  return null;
}

function getEmail(maintainer, author) {
  if (   maintainer
      && maintainer.email
      && maintainer.email.length)
      return maintainer.email;

  return (author && author.email) || null;
}

function getRepoUrl(repo) {
  if (!repo) return null;
  if (!repo.url || !repo.url.length) return null;
  return repo.url;
}

function getKeywords (keywords) {
  // sometimes keywords are just a string, normalize to an array here
  if (Array.isArray(keywords)) return keywords;
  if (typeof keywords !== 'string') return [];
  return keywords.split(/[ ,:]/);
}

// simplest and fastest solution for now 
// if we ever run into memory issues, use 'npm i JSONStream'
// it will be slower due to smaller batches, but have much smaller memory footprint
var get = module.exports = function (db, json, cb) {
  var npmPackages =  db.sublevel(npm.packages, { valueEncoding: 'json' })
    , byOwner     =  db.sublevel(npm.byOwner, { valueEncoding: 'utf8' })
    , byKeyword   =  db.sublevel(npm.byKeyword, { valueEncoding: 'utf8' });

  var packages;
  try {
    packages = JSON.parse(json);
  } catch(e) { cb(e); }

  var packagesBatch = Object.keys(packages).map(function (k) {
    var p          =  packages[k]
      , maintainer =  getMaintainer(p.maintainers)

      , info = {
          type  :  'put'
        , key   :  k
        , value :  {
            name        :  k
          , owner       :  getOwner(maintainer)           || null
          , email       :  getEmail(maintainer, p.author) || null
          , repoUrl     :  getRepoUrl(p.repository)       || null
          , versions    :  p.versions                     || null
          , keywords    :  getKeywords(p.keywords)        || null
          , description :  p.description                  || null
          }
      };
      
      return info;
  });

  npmPackages.pre(function (val, add) {
    try {
      add({ prefix :  byOwner
          , type   :  'put'
          , key    :  val.value.owner
          , value  :  val.key });
    } catch(e) {
      console.error('An error occurred while adding owner for ', val.key);
    }

    try {
      val.value.keywords.forEach(function (keyword) {
        add({ prefix :  byKeyword
            , type   :  'put'
            , key    :  keyword
            , value  :  val.key });
      });
    } catch(e) {
      console.error('An error occurred while adding keywords for ', val.key);
    }
  });
  
  npmPackages.batch(
      packagesBatch 
    , function (err) { 
        cb(err, { npmPackages: npmPackages, byOwner: byOwner, byKeyword: byKeyword }); 
    }); 
};
