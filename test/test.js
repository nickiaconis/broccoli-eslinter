const CLIEngine = require('eslint').CLIEngine;
const RSVP = require('rsvp');
const expect = require('chai').expect;
const FIXTURES = 'test/fixture';
const CAMELCASE = '(camelcase)';
const CONSOLE = '(no-console)';
const CUSTOM_RULES = 'testing custom rules';
const DOUBLEQUOTE = 'Strings must use doublequote.';
const FILEPATH = 'fixture/1.js';

function runEslint(path, _options) {
  const options = _options || {};

  // default options
  options.format = options.format || 'eslint/lib/formatters/compact';
  options.options = options.options || {};
  options.options.ignore = options.options.ignore || false;

  const formatter = require(options.format); // eslint-disable-line global-require
  const cliEngine = new CLIEngine(options.options);
  const outputObj = cliEngine.executeOnFiles([path]);
  const output = formatter(outputObj.results);

  return RSVP.Promise.resolve(output);
}

describe('EslintValidationFilter', function describeEslintValidationFilter() {
  function shouldReportErrors(inputTree) {
    return function _shouldReportErrors() {
      // lint test fixtures
      const promise = runEslint(inputTree);

      return promise.then(function assertLinting(buildLog) {
        expect(buildLog, 'Used eslint validation').to.have.string(CAMELCASE);
        expect(buildLog, 'Shows filepath').to.have.string(FILEPATH);
        expect(buildLog, 'Used relative config - console not allowed').to.have.string(CONSOLE);
        expect(buildLog, 'Used relative config - single quotes').to.not.have.string(DOUBLEQUOTE);
        expect(buildLog, 'No custom rules defined').to.not.have.string(CUSTOM_RULES);
      });
    };
  }

  it('should report errors', shouldReportErrors(FIXTURES));

  it('should accept rule paths', function shouldAcceptRulePaths() {
    // lint test fixtures using a custom rule
    const promise = runEslint(FIXTURES, {
      options: {
        rulePaths: ['conf/rules']
      }
    });

    return promise.then(function assertLinting(buildLog) {
      expect(buildLog, 'Used custom rule').to.have.string(CUSTOM_RULES);
    });
  });

  it('should accept config file path', function shouldAcceptConfigFile() {
    // lint test fixtures using a config file at a non-default path
    const promise = runEslint(FIXTURES, {
      options: {
        configFile: 'conf/eslint.json'
      }
    });

    return promise.then(function assertLinting(buildLog) {
      expect(buildLog, 'Used alternate config - console allowed').to.not.have.string(CONSOLE);
      expect(buildLog, 'Used alternate config - double quotes').to.have.string(DOUBLEQUOTE);
    });
  });

  it('should report the same errors', shouldReportErrors(FIXTURES));
});
