/**
 * Constructor
 */
function Render() {}

/**
 * Class method getter
 * @return {Object} o
 */
Render.prototype.get = function () {
  'use strict';
  return this.o;
};

/**
 * Class method setter
 * @param {Object} o
 */
Render.prototype.set = function (o) {
  'use strict';
  this.o = o;
};

// Exports class
module.exports = Render;
