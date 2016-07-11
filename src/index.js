import isObject from 'lodash/isObject';

import {
  setPrefixer
} from './prefix';
import {
  getRules
} from './rules';
import {
  buildStylesheet,
  buildStylesheetContent,
  removeStylesheetFromHead
} from './stylesheet';

let counter = -1;

/**
 * create jile stylesheet, where if styleId is a string then
 * assign the object to a style tag with an ID of that value,
 * else if it is an object just assign a generic ID to the style
 * tag
 *
 * @param {string|object} styleId
 * @param {object|boolean} styles={}
 * @param {boolean} shouldHashSelectors=true
 * @returns {object}
 */
const jile = (styleId, styles = {}, shouldHashSelectors = true) => {
  const isStyleIdReallyStyles = isObject(styleId);

  const realStyleId = isStyleIdReallyStyles ? `jile-stylesheet-${++counter}` : styleId;
  const realStyles = isStyleIdReallyStyles ? styleId : styles;
  const realShouldHashSelectors = isStyleIdReallyStyles ? !!styles : shouldHashSelectors;

  return buildStylesheet(realStyleId, realStyles, realShouldHashSelectors);
};

/**
 * build the textContent for a style tag and return the content
 * and the selectorMap as an object (useful for server-side
 * generation, where there is no document)
 *
 * @param {string|object} styleId
 * @param {object|boolean} styles
 * @param {boolean} shouldHashSelectors=true
 * @returns {{selectorMap: Object, textContent: string}}
 */
jile.noInject = (styleId, styles, shouldHashSelectors = true) => {
  const isStyleIdReallyStyles = isObject(styleId);

  const realStyleId = isStyleIdReallyStyles ? `jile-stylesheet-${++counter}` : styleId;
  const realStyles = isStyleIdReallyStyles ? styleId : styles;
  const realShouldHashSelectors = isStyleIdReallyStyles ? !!styles : shouldHashSelectors;

  const rules = getRules(realStyles, realStyleId, realShouldHashSelectors);

  return buildStylesheetContent(rules, realStyleId, realShouldHashSelectors);
};

/**
 * remove applied style from head of document
 *
 * @param {string} styleId
 */
jile.remove = (styleId) => {
  removeStylesheetFromHead(styleId);
};

/**
 * pass-through to setPrefixer method
 *
 * @type {setPrefixer}
 */
jile.setPrefixer = setPrefixer;

export default jile;
