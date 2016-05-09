// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

'use strict';
var fs = require('fs');
var pixrem = require('../lib/pixrem');
var css = '.rule { font-size: 2rem }';

describe('pixrem', function () {

  it('should generate fallbacks using default settings', function () {
    var expected = '.rule { font-size: 32px; font-size: 2rem }';
    var processed = pixrem(css);

    expect(processed).toBe(expected);
  });

  it('should generate fallbacks with a pixel root em value', function () {
    var expected = '.rule { font-size: 40px; font-size: 2rem }';
    var processed = pixrem(css, '20px');

    expect(processed).toBe(expected);
  });

  it('should generate fallbacks with a em root em value', function () {
    var expected = '.rule { font-size: 48px; font-size: 2rem }';
    var processed = pixrem(css, '1.5em');

    expect(processed).toBe(expected);
  });

  it('should generate fallbacks with a rem root em value', function () {
    var expected = '.rule { font-size: 56px; font-size: 2rem }';
    var processed = pixrem(css, '1.75rem');

    expect(processed).toBe(expected);
  });

  it('should generate fallbacks with a percent root em value', function () {
    var expected = '.rule { font-size: 48px; font-size: 2rem }';
    var processed = pixrem(css, '150%');

    expect(processed).toBe(expected);
  });

  it('should generate fallbacks with a unitless root em value', function () {
    var expected = '.rule { font-size: 36px; font-size: 2rem }';
    var processed = pixrem(css, '18');

    expect(processed).toBe(expected);
  });

  it('should replace rules with fallbacks when option.replace is true', function () {
    var expected = '.rule { font-size: 40px }';
    var processed = pixrem(css, '20px', { replace: true });

    expect(processed).toBe(expected);
  });

  it('should generate integer fallbacks, rounded down', function () {
    var expected = '.rule { font-size: 49px; font-size: 2rem }';
    var processed = pixrem(css, '155%');

    expect(processed).toBe(expected);
  });

  it('should handle < 1 values and values without a leading 0', function () {
    var css = '.rule { margin: 0.5rem .5rem 0rem -2rem }';
    var expected = '.rule { margin: 8px 8px 0px -32px; margin: 0.5rem .5rem 0rem -2rem }';
    var processed = pixrem(css);

    expect(processed).toBe(expected);
  });
});
