"use strict";

var color = require("./lib/color");
var list = require("postcss/lib/list");
var onecolor = require("onecolor");
var pkg = require("./package.json");
var postcss = require("postcss");
var re = require("./lib/regexp");

// Check comment is a source map annotation or not
var isSourceMapAnnotation = function (comment) {
  if (
    comment.parent.type === "root" &&
    comment.parent.last === comment &&
    comment.text.toLowerCase().indexOf("# sourcemappingurl=") === 0
  ) {
    return true;
  }

  return false;
};

// Set quotation mark
var setQuote = function (quote) {
  if (!quote) {
    quote = "\"";
  }

  return quote;
};

// Check string can unquote or not
var canUnquote = function (str) {
  var firstChar = str.slice(0, 1);
  var secondChar;

  if (re.number.test(firstChar)) {
    return false;
  }

  secondChar = str.slice(1, 2);

  if (
    firstChar === "-" &&
    (secondChar === "-" || secondChar === "" || re.number.test(secondChar))
  ) {
    return false;
  }

  if (re.sequenceOfIdentifiers.test(str)) {
    return true;
  }

  return false;
};

// Unquote font family name if possible
var unquoteFontFamily = function (family) {
  var quote;
  family = family.replace(re.quotedString, "$2");
  quote = setQuote(RegExp.$1);

  if (!list.space(family).every(canUnquote)) {
    family = quote + family + quote;
  }

  return family;
};

// Convert colors to HEX or `rgba()` notation
var toRGBColor = function (m, leading, c) {
  c = onecolor(c);

  /* istanbul ignore if  */
  // Return unmodified value when `one.color` failed to parse `c`
  if (!c) {
    return m;
  }

  if (c.alpha() < 1) {
    return leading + c.cssa();
  }

  return leading + c.hex() + " ";
};

// Convert to shortest color
var toShortestColor = function (m, leading, r1, r2, g1, g2, b1, b2) {
  var c = "#" + r1 + r2 + g1 + g2 + b1 + b2;

  if (r1 === r2 && g1 === g2 && b1 === b2) {
    c = "#" + r1 + g1 + b1;
  }

  if (color.shortest.hasOwnProperty(c)) {
    c = color.shortest[c];
  }

  return leading + c.toLowerCase();
};

// Remove unit from 0 length and 0 percentage if possible
var removeUnitOfZero = function (prop, m, leading, num, unit, position, value) {
  if (
    prop === "flex" ||
    prop === "-ms-flex" ||
    prop === "-webkit-flex" ||
    prop === "flex-basis" ||
    prop === "-webkit-flex-basis" ||
    value.indexOf("calc(") !== -1
  ) {
    return m;
  }

  return leading + num;
};

// Unquote inside `url()` notation if possible
var unquoteURL = function (m, leading, url) {
  var quote;
  url = url.replace(re.quotedString, "$2");
  quote = setQuote(RegExp.$1);
  url = url.replace(re.escapedBraces, "$1");

  if (re.urlNeedQuote.test(url)) {
    url = quote + url + quote;
  }

  return leading + "url(" + url + ")";
};

// Remove white spaces inside `calc()` notation
var removeCalcWhiteSpaces = function (m, leading, calc) {
  return leading + "calc(" +
    calc.replace(re.whiteSpacesBothEndsOfSymbol, "$1") + ")";
};

// Wring value of declaration
var wringValue = function (prop, value) {
  return value.replace(
    re.colorFunction,
    toRGBColor
  ).replace(
    re.colorHex,
    toShortestColor
  ).replace(
    re.colorTransparent,
    "$1transparent "
  ).trim().replace(
    re.whiteSpaces,
    " "
  ).replace(
    re.whiteSpacesAfterSymbol,
    "$1"
  ).replace(
    re.whiteSpacesBeforeSymbol,
    "$1"
  ).replace(
    re.numberLeadingZeros,
    "$1$2"
  ).replace(
    re.zeroValueUnit,
    removeUnitOfZero.bind(null, prop)
  ).replace(
    re.decimalWithZeros,
    "$1$2$3.$4"
  ).replace(
    re.urlFunction,
    unquoteURL
  ).replace(
    re.calcFunction,
    removeCalcWhiteSpaces
  );
};

// Unquote attribute selector if possible
var unquoteAttributeSelector = function (m, att, con, val) {
  var quote;

  if (!con || !val) {
    return "[" + att + "]";
  }

  val = val.trim().replace(re.quotedString, "$2");
  quote = setQuote(RegExp.$1);

  if (!canUnquote(val)) {
    val = quote + val + quote;
  }

  return "[" + att + con + val + "]";
};

// Remove white spaces from string
var removeWhiteSpaces = function (string) {
  return string.replace(re.whiteSpaces, "");
};

// Remove white spaces from both ends of `:not()`
var trimNegationFunction = function (m, not) {
  return ":not(" + not.trim() + ")";
};

// Wring selector of ruleset
var wringSelector = function (selector) {
  return selector.replace(
    re.whiteSpaces,
    " "
  ).replace(
    re.selectorAtt,
    unquoteAttributeSelector
  ).replace(
    re.selectorFunctions,
    removeWhiteSpaces
  ).replace(
    re.selectorNegationFunction,
    trimNegationFunction
  ).replace(
    re.selectorCombinators,
    "$1"
  ).replace(
    re.selectorPseudoElements,
    "$1"
  );
};

// Check keyframe is valid or not
var isValidKeyframe = function (keyframe) {
  if (keyframe === "from" || keyframe === "to") {
    return true;
  }

  keyframe = parseFloat(keyframe);

  if (!isNaN(keyframe) && keyframe >= 0 && keyframe <= 100) {
    return true;
  }

  return false;
};

// Unique array element
var uniqueArray = function (array) {
  var i;
  var l;
  var result = [];
  var value;

  for (i = 0, l = array.length; i < l; i++) {
    value = array[i];

    if (result.indexOf(value) < 0) {
      result.push(value);
    }
  }

  return result;
};

// Remove duplicate declaration
var removeDuplicateDeclaration = function (decls, decl) {
  var d = decl.raws.before + decl.prop + decl.raws.between + decl.value;

  if (decls.hasOwnProperty(d)) {
    decls[d].remove();
  }

  decls[d] = decl;
};

// Check required `@font-face` descriptor or not
var isRequiredFontFaceDescriptor = function (decl) {
  var prop = decl.prop;

  return (prop === "src") || (prop === "font-family");
};

// Remove `@font-face` descriptor with default value
var removeDefaultFontFaceDescriptor = function (decl) {
  var prop = decl.prop;
  var value = decl.value;

  if (
    (re.descriptorFontFace.test(prop) && value === "normal") ||
    (prop === "unicode-range" && re.unicodeRangeDefault.test(value)) ||
    prop + value === "font-weight400"
  ) {
    decl.remove();
  }
};

// Quote `@import` URL
var quoteImportURL = function (m, quote, url) {
  quote = setQuote(quote);

  return quote + url + quote;
};

// Quote `@namespace` URL
var quoteNamespaceURL = function (param, index, p) {
  var quote;

  if (param === p[p.length - 1]) {
    param = param.replace(re.quotedString, "$2");
    quote = setQuote(RegExp.$1);
    param = quote + param + quote;
  }

  return param;
};

// Wring comment
var wringComment = function (removeAllComments, comment) {
  if (
    (removeAllComments || comment.text.indexOf("!") !== 0) &&
    !isSourceMapAnnotation(comment)
  ) {
    comment.remove();

    return;
  }

  comment.raws.before = "";
};

// Wring declaration
var wringDecl = function (preserveHacks, decl) {
  var before = decl.raws.before;
  var between = decl.raws.between;
  var prop = decl.prop;
  var value = decl.value;
  var values;

  if (!prop.match(re.validProp)) {
    decl.remove();

    return;
  }

  if (
    !preserveHacks &&
    (
      (before && before.match(re.hackSignProp) !== null) ||
      (between && between.match(re.hackPropComment) !== null)
    )
  ) {
    decl.remove();

    return;
  }

  if (preserveHacks && before) {
    before = before.replace(
      re.semicolons,
      ""
    ).replace(
      re.whiteSpaces,
      ""
    );
  } else {
    before = "";
  }

  decl.raws.before = before;

  if (preserveHacks && between) {
    between = between.replace(re.whiteSpaces, "");
  } else {
    between = ":";
  }

  decl.raws.between = between;

  if (decl.important) {
    decl.raws.important = "!important";
  }

  if (decl.raws.value) {
    decl.raws.value = decl.raws.value.raw.trim();
  }

  if (prop === "content") {
    return;
  }

  if (prop === "font-family") {
    decl.value = list.comma(value).map(unquoteFontFamily).join(",");

    return;
  }

  values = list.comma(value);
  value = values.map(wringValue.bind(null, prop)).join(",");

  if (re.propertyMultipleValues.test(prop)) {
    values = list.space(value);

    if (values.length === 4 && values[1] === values[3]) {
      values.splice(3, 1);
    }

    if (values.length === 3 && values[0] === values[2]) {
      values.splice(2, 1);
    }

    if (values.length === 2 && values[0] === values[1]) {
      values.splice(1, 1);
    }

    value = values.join(" ");
  }

  if (prop === "font-weight") {
    if (value === "normal") {
      value = "400";
    } else if (value === "bold") {
      value = "700";
    }
  }

  decl.value = value;
};

// Wring declaration like string
var wringDeclLike = function (m, prop, value) {
  var decl = postcss.decl({
    prop: prop,
    value: value
  });
  wringDecl.call(null, false, decl);

  return "(" + decl.toString() + ")";
};

// Wring ruleset
var wringRule = function (rule) {
  var decls;
  var parent;
  var selectors;
  rule.raws.before = "";
  rule.raws.between = "";
  rule.raws.semicolon = false;
  rule.raws.after = "";

  if (rule.nodes.length === 0 || rule.selector === "") {
    rule.remove();

    return;
  }

  parent = rule.parent;
  selectors = rule.selectors.map(wringSelector);

  if (parent.type === "atrule" && parent.name === "keyframes") {
    selectors = selectors.filter(isValidKeyframe);

    if (selectors.length === 0) {
      rule.remove();

      return;
    }
  }

  rule.selector = uniqueArray(selectors).join(",");
  decls = {};
  rule.each(removeDuplicateDeclaration.bind(null, decls));
};

// Filter at-rule
var filterAtRule = function (flag, rule) {
  var name = rule.name;
  var type = rule.type;

  if (type === "comment") {
    return;
  }

  if (
    type !== "atrule" ||
    (name !== "charset" && name !== "import")
  ) {
    flag.filter = true;

    return;
  }

  if (name === "charset" && !flag.charset) {
    flag.charset = true;

    return;
  }

  if (flag.filter || (name === "charset" && flag.charset)) {
    rule.remove();

    return;
  }
};

// Wring at-rule
var wringAtRule = function (atRule) {
  var params;
  atRule.raws.before = "";
  atRule.raws.afterName = " ";
  atRule.raws.between = "";
  atRule.raws.semicolon = false;
  atRule.raws.after = "";

  if (!atRule.params) {
    atRule.params = "";
  }

  if (atRule.name === "charset") {
    return;
  }

  if (atRule.name === "font-face") {
    if (atRule.nodes.filter(isRequiredFontFaceDescriptor).length < 2) {
      atRule.remove();

      return;
    }

    atRule.each(removeDefaultFontFaceDescriptor);
  }

  if (atRule.nodes && atRule.nodes.length === 0) {
    atRule.remove();

    return;
  }

  params = atRule.params.replace(
    re.whiteSpaces,
    " "
  ).replace(
    re.whiteSpacesAfterSymbol,
    "$1"
  ).replace(
    re.whiteSpacesBeforeSymbol,
    "$1"
  );

  if (atRule.name === "import") {
    params = params.replace(
      re.urlFunction,
      "$1$2"
    ).replace(
      re.quotedString,
      quoteImportURL
    );
  }

  if (atRule.name === "namespace") {
    params = list.space(
      params.replace(re.urlFunction, "$1$2")
    ).map(quoteNamespaceURL).join("");
  }

  if (atRule.name === "keyframes") {
    params = params.replace(re.quotedString, "$2");
  }

  if (atRule.name === "supports") {
    params = params.replace(re.declInParentheses, wringDeclLike);
  }

  atRule.params = params;

  if (
    atRule.params === "" ||
    params.indexOf("(") === 0 ||
    params.indexOf("\"") === 0 ||
    params.indexOf("'") === 0
  ) {
    atRule.raws.afterName = "";
  }
};

module.exports = postcss.plugin(pkg.name, function (opts) {
  if (!opts) {
    opts = {};
  }

  if (!opts.preserveHacks) {
    opts.preserveHacks = false;
  }

  if (!opts.removeAllComments) {
    opts.removeAllComments = false;
  }

  return function (css) {
    css.raws.semicolon = false;
    css.raws.after = "";
    css.walkComments(wringComment.bind(null, opts.removeAllComments));
    css.walkDecls(wringDecl.bind(null, opts.preserveHacks));
    css.walkRules(wringRule);
    css.each(filterAtRule.bind(null, {
      charset: false,
      filter: false
    }));
    css.walkAtRules(wringAtRule);
    css.replaceValues();

    return css;
  };
});

module.exports.wring = function (css, opts) {
  return postcss([
    this(opts)
  ]).process(css, opts);
};
