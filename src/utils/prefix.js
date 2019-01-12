// external dependencies
import Prefixer from 'inline-style-prefixer';

let prefixer = new Prefixer();

/**
 * get the prefixed keyframes value for the
 * prefixer's userAgent
 *
 * @returns {string}
 */
export const getKeyframesPrefix = () => prefixer.prefixedKeyframes;

/**
 * get styles with vendor-prefixed values
 *
 * @param {object} styles
 * @returns {object}
 */
export const prefix = (styles) => prefixer.prefix(styles);

/**
 * set the prefixer based on userAgent and
 * options passed
 *
 * @param {object} options={}
 * @param {boolean} [options.keepUnprefixed]
 * @param {string} [options.userAgent]
 */
export const setPrefixerOptions = (options = {}) => {
  prefixer = new Prefixer(options);
};
