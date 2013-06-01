'use strict';

var request = require('request');

module.exports = function () {
  var opts = {
      uri: 'https://registry.npmjs.org/-/users/'
    , json: true
  };

  var req = request.get(opts);
  req.on('error', console.error);
  return req;
};
