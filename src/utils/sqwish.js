/*******************************************************************************
 * COPYRIGHT (C) 2015, Rapid7 LLC, Boston, MA, USA. All rights reserved. This
 * material contains unpublished, copyrighted work including confidential and
 * proprietary information of Rapid7.
 ******************************************************************************/

/*!
 * Sqwish - a CSS Compressor
 * Copyright Dustin Diaz 2011
 * https://github.com/ded/sqwish
 * License MIT
 */

const OBJECT_KEYS = Object.keys;

/**
 * consolidate rules down to a single declaration
 *
 * @param {string} css
 * @returns {string}
 */
const strict_css = (css) => {
  // now some super fun funky shit where we remove duplicate declarations
  // into combined rules

  // store global dict of all rules
  const rules = css.match(/([^{]+\{[^}]+\})+?/g);

  let ruleList = {};

  // lets find the dups
  rules.forEach((rule) => {
    // break rule into selector|declaration parts
    const parts = rule.match(/([^{]+)\{([^}]+)/);
    const selector = parts[1];

    let declarations = parts[2];

    // start new list if it wasn't created already
    if (!ruleList[selector]) {
      ruleList[selector] = [];
    }

    declarations = declarations.split(';');

    // filter out duplicate properties
    ruleList[selector] = ruleList[selector].filter((decl) => {
      const prop = decl.match(/[^:]+/)[0];

      // pre-existing properties are not wanted anymore
      return !declarations.some((dec) => {
        // must include '^' as to not confuse 'color' with 'border-color' etc.
        const regexp = new RegExp(`^${prop.replace(/[-\/\^$*+?.()|\[\]{}]/g, '\$&')}:`);

        return dec.match(regexp);
      });
    });

    // latter takes presedence :)
    ruleList[selector] = ruleList[selector].concat(declarations);

    // still dups? just in case
    ruleList[selector] = ruleList[selector].reduce((currentSelectorRuleList, item) => {
      if (currentSelectorRuleList.indexOf(item) === -1) {
        return currentSelectorRuleList.concat([item]);
      }

      return currentSelectorRuleList;
    }, []);
  });

  // reset css because we're gonna recreate the whole shabang.
  css = '';

  OBJECT_KEYS(ruleList).forEach((selector) => {
    const value = ruleList[selector];
    const joinedRuleList = value.join(';');

    css += `${selector}{${joinedRuleList.replace(/;$/, '')}}`;
  });

  return css;
};

/**
 * minify css string
 *
 * @param {string} css
 * @param {boolean} strict=true
 * @returns {string}
 */
const sqwish = (css, strict = true) => {
  // allow /*! bla */ style comments to retain copyrights etc.
  let comments = css.match(/\/\*![\s\S]+?\*\//g);

  css = css.trim() // give it a solid trimming to start

  // comments
    .replace(/\/\*[\s\S]+?\*\//g, '')

    // line breaks and carriage returns
    .replace(/[\n\r]/g, '')

    // space between selectors, declarations, properties and values
    .replace(/\s*([:;,{}])\s*/g, '$1')

    // replace multiple spaces with single spaces
    .replace(/\s+/g, ' ')

    // space between last declaration and end of rule
    // also remove trailing semi-colons on last declaration
    .replace(/;}/g, '}')

    // this is important
    .replace(/\s+(!important)/g, '$1')

    // convert longhand hex to shorthand hex
    .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3')
    // Restore Microsoft longhand hex
    .replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4')

    // replace longhand values with shorthand '5px 5px 5px 5px' => '5px'
    .replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1')

    // replace double-specified longhand values with shorthand '5px 2px 5px 2px' => '5px 2px'
    .replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2')

    // replace 0px with 0
    .replace(/([\s|:])[0]+px/g, '$10');

  if (strict) {
    css = strict_css(css);
  }

  // put back in copyrights
  if (comments) {
    comments = comments ? comments.join('\n') : '';
    css = `${comments}\n${css}`;
  }

  return css;
};

export default (css, strict) => {
  return sqwish(css, strict);
};
