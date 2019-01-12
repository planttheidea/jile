// environment
export const IS_PRODUCTION = !!(process && process.env && process.env.NODE_ENV === 'production');

// options
export const DEFAULT_OPTIONS = {
  autoMount: true,
  hashSelectors: true,
  minify: IS_PRODUCTION,
  sourceMap: !IS_PRODUCTION,
};
export const OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS).concat(['id']);

// properties that can have unitless values
export const UNITLESS_PROPERTIES = [
  'column-count',
  'columnCount',
  'columns',
  'counter-increment',
  'counter-reset',
  'counterIncrement',
  'counterReset',
  'flex-grow',
  'flex-shrink',
  'flexGrow',
  'flexShrink',
  'font-weight',
  'fontWeight',
  'line-height',
  'lineHeight',
  'opacity',
  'order',
  'pitch-range',
  'pitchRange',
  'richness',
  'stress',
  'volume',
  'z-index',
  'zIndex',
];

// regexp objects
export const FONT_FACE_REGEXP = /@font-face/;
export const GLOBAL_REPLACEMENT_REGEXP = /global__([0-9]+)/;
export const GLOBAL_SELECTOR_REGEXP = /:global\((.*?)\)/;
export const HASH_SELECTOR_REGEXP = /(\.|#)([_a-zA-Z][_a-zA-z0-9-]+)/g;
export const JILE_HASH_REGEXP = /jile__(.*)__([0-9]+)/;
export const KEYFRAMES_REGEXP = /@keyframes/;
export const KEYFRAMES_FOLLOWED_BY_NAME_REGEXP = /(@keyframes\s+)(\w+)/;
export const MEDIA_QUERY_REGEXP = /@media/;
export const PAGE_REGEXP = /@page/;

// types of selector
export const FONT_FACE_TYPE = 'FONT_FACE';
export const KEYFRAMES_TYPE = 'KEYFRAME';
export const MEDIA_QUERY_TYPE = 'MEDIA_QUERY';
export const PAGE_TYPE = 'PAGE';
export const STANDARD_TYPE = 'STANDARD';
