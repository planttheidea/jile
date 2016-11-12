// external dependencies
import Prefixer from 'inline-style-prefixer';

let prefixer = new Prefixer();

/**
 * get the prefixed keyframes value for the
 * prefixer's userAgent
 *
 * @returns {string}
 */
const getKeyframesPrefix = () => {
  return prefixer.prefixedKeyframes;
};

/**
 * get styles with vendor-prefixed values
 *
 * @param {object} styles
 * @returns {object}
 */
const prefix = (styles) => {
  return prefixer.prefix(styles);
};

/**
 * set the prefixer based on userAgent and
 * options passed
 *
 * @param {object} options={}
 * @param {boolean} [options.keepUnprefixed]
 * @param {string} [options.userAgent]
 */
const setPrefixerOptions = (options = {}) => {
  prefixer = new Prefixer(options);
};

export {getKeyframesPrefix};
export {prefix};
export {setPrefixerOptions};
