// object methods
const assign = Object.assign;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const keys = Object.keys;

// environment
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// options
const DEFAULT_OPTIONS = {
  autoMount: true,
  hashSelectors: true,
  minify: IS_PRODUCTION,
  sourceMap: !IS_PRODUCTION
};
const OPTIONS_KEYS = [
  ...keys(DEFAULT_OPTIONS),
  'id'
];

// properties that can have unitless values
const UNITLESS_PROPERTIES = [
  'columnCount',
  'columns',
  'counterIncrement',
  'counterReset',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'opacity',
  'order',
  'pitchRange',
  'richness',
  'stress',
  'volume',
  'zIndex'
];

// regexp objects
const FONT_FACE_REGEXP = /@font-face/;
const GLOBAL_REPLACEMENT_REGEXP = /global__([0-9]+)/;
const GLOBAL_SELECTOR_REGEXP = /:global\((.*?)\)/;
const HASH_SELECTOR_REGEXP = /(\.|#)([_a-zA-Z][_a-zA-z0-9-]+)/g;
const JILE_HASH_REGEXP = /jile__([_A-Za-z0-9-]+)__([0-9]+)/;
const KEYFRAMES_REGEXP = /@keyframes/;
const KEYFRAMES_FOLLOWED_BY_NAME_REGEXP = /(@keyframes\s+)(\w+)/;
const MEDIA_QUERY_REGEXP = /@media/;
const PAGE_REGEXP = /@page/;

// types of selector
const FONT_FACE_TYPE = 'FONT_FACE';
const KEYFRAMES_TYPE = 'KEYFRAME';
const MEDIA_QUERY_TYPE = 'MEDIA_QUERY';
const PAGE_TYPE = 'PAGE';
const STANDARD_TYPE = 'STANDARD';

export {assign};
export {getOwnPropertyNames};
export {keys};

export {DEFAULT_OPTIONS};
export {IS_PRODUCTION};
export {OPTIONS_KEYS};
export {UNITLESS_PROPERTIES};

export {FONT_FACE_REGEXP};
export {GLOBAL_REPLACEMENT_REGEXP};
export {GLOBAL_SELECTOR_REGEXP};
export {HASH_SELECTOR_REGEXP};
export {JILE_HASH_REGEXP};
export {KEYFRAMES_REGEXP};
export {KEYFRAMES_FOLLOWED_BY_NAME_REGEXP};
export {MEDIA_QUERY_REGEXP};
export {PAGE_REGEXP};

export {FONT_FACE_TYPE};
export {KEYFRAMES_TYPE};
export {MEDIA_QUERY_TYPE};
export {PAGE_TYPE};
export {STANDARD_TYPE};
