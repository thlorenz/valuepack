'use strict';
module.exports = function (obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
};
