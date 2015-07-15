"use strict";

var Parser = require('./parser');
var parser = new Parser();

parser.define('e', '\\( <num1:e> \\)', function (opts) {
  return opts.num1;
});

parser.define('e', '<num1:e> \\+ <num2:e>', function (opts) {
  return opts.num1 + opts.num2;
});

parser.define('e', '<num1:e> \\- <num2:e>', function (opts) {
  return opts.num1 - opts.num2;
});

parser.define('e', '<num1:e> \\* <num2:e>', function (opts) {
  return opts.num1 * opts.num2;
});

parser.define('e', '<num1:e> \\/ <num2:e>', function (opts) {
  return opts.num1 / opts.num2;
});

parser.define('e', '<num1:n>', function (opts) {
  return parseInt(opts.num1, 10);
});

parser.define('n', '[0-9]+', true);

module.exports = parser;

// example : calc.parse('3 * ( 4 - 2 )', 'e')
