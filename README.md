# [broccoli](https://github.com/joliss/broccoli)-eslinter

> Lint JavaScript using [Eslint](http://eslint.org/)

This is a fork of [jonathanKingston/broccoli-lint-eslint](https://github.com/jonathanKingston/broccoli-lint-eslint) used to change the test generator API. This fork may go away, however it will attempt to track it's parent fork as long as possible.

## Install

```bash
npm install --save broccoli-eslinter
```

## Example

```js
var eslint = require('broccoli-eslinter');
tree = eslint(tree, options);
```

## API

### eslint(tree, options)

#### options

##### format

Type: `String`
Default: `'eslint/lib/formatters/stylish'`

Path path to a custom formatter (See [eslint/tree/master/lib/formatters](https://github.com/eslint/eslint/tree/master/lib/formatters) for alternatives).

##### testGenerator

Type: `function`
Default: `null`

The function used to generate test modules. You can provide a custom function for your client side testing framework of choice.

The function receives the following arguments:

- relativePath - The relative path to the file being tested.
- result - An object that details the eslint errors/warnings found.
- result.messages - An array of eslint error/warning messages.
- result.errorCount - The number of errors found.
- result.warningCount - THe number of warnings found.

Example usage:
```
var path = require('path');

function testGenerator(relativePath, result) {
  var passed = (result.errorCount === 0);
  return "module('" + path.dirname(relativePath) + '");";
         "test('" + relativePath + "' should pass jshint', function() { " +
         "  ok(passed, moduleName+" should pass jshint."+(!passed ? "\n"+result.messages : '')); " +
         "});
};

return eslint(tree, {
  options: {
    configFile: this.jshintrc.app + '/eslint.json',
    rulesdir: this.jshintrc.app
  },
  testGenerator: testGenerator
});
```

##### throwOnError

Type: `Boolean`

Cause exception error on first severe error

##### options
Options native to ESLint CLI: [CLIEngine options](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)

###### configFile

Type: `String`
Default: `./.eslintrc`

Path to eslint configuration file.

###### rulePaths

Type: `Array`
Default: [built-in rules directory](https://github.com/eslint/eslint/tree/master/lib/rules)

Paths to a directory with custom rules. Your custom rules will be used in addition to the built-in ones.

Recommended read: [Working with Rules](https://github.com/eslint/eslint/blob/master/docs/developer-guide/working-with-rules.md)
