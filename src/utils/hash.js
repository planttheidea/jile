const SEED = 13;

/**
 * convenience function to get the charCodeAt
 * value for given key
 *
 * @param {string} key
 * @param {number} value
 * @returns {number}
 */
const getCharCodeAt = (key, value) => {
  return key.charCodeAt(value);
};

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011), modified
 * to work with jile implementation
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {string} styleId
 * @return {number} 32-bit positive integer hash
 */
const murmurhash3_32_gc = (key, styleId) => {
  const stringToHash = `${key}-${styleId}`;
  
  const remainder = stringToHash.length & 3; // stringToHash.length % 4
  const bytes = stringToHash.length - remainder;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  let h1 = SEED,
      i = 0,
      h1b, k1;

  while (i < bytes) {
    k1 =
      ((getCharCodeAt(stringToHash, i) & 0xff)) |
      ((getCharCodeAt(stringToHash, ++i) & 0xff) << 8) |
      ((getCharCodeAt(stringToHash, ++i) & 0xff) << 16) |
      ((getCharCodeAt(stringToHash, ++i) & 0xff) << 24);
    ++i;

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (getCharCodeAt(stringToHash, i + 2) & 0xff) << 16;
      break;

    case 2:
      k1 ^= (getCharCodeAt(stringToHash, i + 1) & 0xff) << 8;
      break;

    case 1:
      k1 ^= (getCharCodeAt(stringToHash, i) & 0xff);
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;

      break;
  }

  h1 ^= stringToHash.length;

  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return `jile__${key}__${h1 >>> 0}`;
};

export default murmurhash3_32_gc;
