# CFG.js
## About
CFG.js allows you to define and act upon arbitrary grammars. This can be useful when defining DSLs.

## Install

Currently you just download the directory and `require('some/path/parser.js')`.

## Use

*An example is located in `calc_example.js`.*

### Instanciate a parser
```
var Parser = require('./parser');
var parser = new Parser();
```

The parser exports a class. Simply instanciate it to get a new parser.

### Define the grammars
```
parser.define('e', '<num1:e> \\+ <num2:e>', function (opts) {
  return opts.num1 + opts.num2;
});
parser.define('e', '<num1:e> \\- <num2:e>', function (opts) {
  return opts.num1 - opts.num2;
});
```

Grammars are defined with 3 arguments:
 - **symbol**: This is how other patterns will reference this symbol.
 - **pattern**: This is a regex describing how to parse the pattern (*NB: it will be wrapped with `^` and `$`*). It can also contain 'child tokens' of the form: `<variable_name:symbol_type>`, where variable name is how it is accessed in the callback and symbole type describes how to process the sub expression.
 - **callback**: How to process the pattern. If it is simply `true` it will return any expression that matches the pattern without further processing. If it is a function it will take one argument: an object containing all the child tokens (described below) with their key being the name provided in the pattern.

Grammars are defined sequentially, for example given the above and asked to parse an `e`, the addition will be checked first and then subtraction.

### Parse
```
parser.parse('3 * ( 4 - 2 )', 'e');
```

Takes 2 arguments:
 - **expression**: Expression to evaluate.
 - **symbol**: what symbol to use to parse this expression

Returns the values of the evaluated expression. Or raises a NoPossibleParse error if it can't parse it. You can check for the error using `Parser.is_no_parse_error(error)` (returns a boolean).

## Parsing Example

Let's examine the following example:

```
parser.parse('3 * ( 4 - 2 )', 'e');
```

The parse tree may look like this:

```
parser.parse('3 * ( 4 - 2 )', 'e');
parser.parse('3', 'n') * parser.parse('( 4 - 2 )', 'e');
3 * parser.parse('4 - 2', 'e');
3 * (parser.parse('4', 'e') - parser.parse('2', 'e'));
3 * (parser.parse('4', 'n') - parser.parse('2', 'n'));
3 * (4 - 2);
3 * 2;
6;
```

## TODOs
 - Tests
 - Add to NPM

## Author and License

The MIT License (MIT)

Copyright (c) 2015 Tomas Reimers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
