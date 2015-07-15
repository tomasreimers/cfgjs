"use strict";

var NOPARSE = 'NoPossibleParse';

function raise_no_parse_error() {
  var e = new Error('No possible parse.');
  e.name = NOPARSE;
  throw e;
}

function is_no_parse_error(e) {
  return e.name == NOPARSE;
}

var parser =  function () {
  var self = this;

  self._tokens = {};

  self.define = function (name, pattern, callback) {
    var final_pattern = '^' + pattern + '$';
    var child_token_re = /<(.+?)(\:(.+?))?>/g;
    var child_tokens = [{}]; // because match is 1-indexed
    var match;
    while (match = child_token_re.exec(final_pattern)) {
      final_pattern = final_pattern.replace(match[0], '(.+?)');
      child_tokens.push({
        'varname': match[1],
        'token': match[3]
      });
    }

    if (typeof(self._tokens[name]) === 'undefined') {
      self._tokens[name] = [];
    }

    self._tokens[name].push({
        'callback': callback,
        'child_tokens': child_tokens,
        'pattern': new RegExp(final_pattern, 'i')
    });
  };

  self.parse = function (expr, type) {
    if (typeof(type) === 'undefined') {
      return expr;
    }
    var tokens = self._tokens[type];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var match;
      if (match = token.pattern.exec(expr)) {
        try {
          if (token.callback === true) {
            return expr
          }
          var values = {};
          for (var j = 1; j < match.length; j++) {
            values[token.child_tokens[j].varname] = self.parse(match[j], token.child_tokens[j].token);
          }
          var return_value = token.callback(values);
          return return_value;
        }
        catch (e) {
          if (!is_no_parse_error(e)) {
            throw e;
          }
        }
      }
    }
    raise_no_parse_error();
  };
};

parser.is_no_parse_error = is_no_parse_error;

module.exports = parser;
