var o = {};

/**
 * Constructor
 */
function Render() {}

/**
 * Class method getter
 * @return {Object} o
 */
Render.prototype.get = function() {
  return this.o;
};

/**
 * Class method setter
 * @param {Object} o
 */
Render.prototype.set = function(o) {
  this.o = o;
};

// Exports class
module.exports = Render;
