/**
 * simple bitwise hash of string value
 * 
 * @param {string} key ASCII only
 * @param {string} styleId
 * @return {number} 32-bit positive integer hash
 */
const hash = (key, styleId) => {
  const stringToHash = `${key}-${styleId}`;

  let hashValue = 5381,
      index = stringToHash.length;

  while (index) {
    hashValue = (hashValue * 33) ^ stringToHash.charCodeAt(--index);
  }

  return `jile__${key}__${hashValue >>> 0}`;
};

export default hash;
