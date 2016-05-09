"use strict";

var re = exports;

// calc(1 + 1)
re.calcFunction = /(^|\s|\(|,)calc\((([^()]*(\([^()]*\))?)*)\)/,

// rgb(0, 0, 0), hsl(0, 0%, 0%), rgba(0, 0, 0, 1), hsla(0, 0%, 0%, 1)
re.colorFunction = /(^|\s|\(|,)((?:rgb|hsl)a?\(.*?\))/gi,

// #000, #000000
re.colorHex = /(^|\s|\(|,)#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])/gi,

// rgba(0,0,0,0)
re.colorTransparent = /(^|\s|\(|,)rgba\(0,0,0,0\)/gi,

// 0.1
re.decimalWithZeros = /(^|\s|\(|,)(-)?0*([1-9]\d*)?\.(\d*[1-9])0*/g,

// (top: 0)
re.declInParentheses = /\(([-a-zA-Z]+):(([^()]*(\([^()]*\))?)*)\)/g,

// font-style, font-stretch, font-variant, font-feature-settings
re.descriptorFontFace = /^font-(style|stretch|variant|feature-settings)$/i,

// \(, \)
re.escapedBraces = /\\([()])/g,

// /**/, /*\**/
re.hackPropComment = /\/\*(\\\*)?\*\//,

// _, *
re.hackSignProp = /[_*]$/,

// 0
re.number = /\d/,

// 01
re.numberLeadingZeros = /(^|\s|\(|,)0+([1-9]\d*(\.\d+)?)/g,

// margin, padding, border-color, border-radius, border-spacing, border-style, border-width
re.propertyMultipleValues = /^(margin|padding|border-(color|radius|spacing|style|width))$/i,

// "...", '...'
re.quotedString = /("|')?(.*)\1/,

// [class = "foo"], [class ~= "foo"], [class |= "foo"], [class ^= "foo"], [class $= "foo"], [class *= "foo"]
re.selectorAtt = /\[\s*(.*?)(?:\s*([~|^$*]?=)\s*(("|').*\4|.*?[^\\]))?\s*\]/g,

// p > a, p + a, p ~ a
re.selectorCombinators = /\s*(\\?[>+~])\s*/g,

// :lang(ja), :nth-child(0), nth-last-child(0), nth-of-type(1n), nth-last-of-type(1n)
re.selectorFunctions = /:(lang|nth-(?:last-)?(?:child|of-type))\((.*?[^\\])\)/gi,

// :not(a)
re.selectorNegationFunction = /:not\((([^()]*(\([^()]*\))?)*)\)/gi,

// ::before, ::after, ::first-line, ::first-letter
re.selectorPseudoElements = /(:)\1(?=after|before|first-(letter|line))/g,

// ;
re.semicolons = /;/g,

// ident-ifi-ers
re.sequenceOfIdentifiers = /^[\w-]+$/,

// u0-10ffff, u000000-10ffff
re.unicodeRangeDefault = /u\+0{1,6}-10ffff/i,

// url(a)
re.urlFunction = /(^|\s|\(|,)url\((.*?[^\\])\)(?=$|\s|\)|,)/gi,

//  , (, ), ", '
re.urlNeedQuote = /[\s()"']/,

// --valid_prop-name
re.validProp = /^-{0,2}[^!-,./:-@[-^`{-~]+$/i,

//  , \t, \r, \n
re.whiteSpaces = /\s+/g,
re.whiteSpacesAfterSymbol = /([(,:])\s/g,
re.whiteSpacesBeforeSymbol = /\s([),:])/g,
re.whiteSpacesBothEndsOfSymbol = /\s([*/])\s/g,

// 0%, 0em, 0ex, 0ch, 0rem, 0vw, 0vh, 0vmin, 0vmax, 0cm, 0mm, 0in, 0pt, 0pc, 0px
re.zeroValueUnit = /(^|\s|\(|,)(0)(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px)/gi
