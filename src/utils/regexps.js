export const AT_SYMBOL_REGEXP = /@/;
export const FONT_FACE_REGEXP = /@font-face/;
export const GLOBAL_REPLACEMENT_REGEXP = /global__([0-9]+)/;
export const GLOBAL_SELECTOR_REGEXP = /:global\((.*?)\)/;
export const HASH_SELECTOR_REGEXP = /(\.|#)([_a-zA-Z][_a-zA-z0-9-]+)/g;
export const JILE_HASH = /jile__([_A-Za-z0-9-]+)__([0-9]+)/;
export const KEYFRAMES_REGEXP = /@keyframes/;
export const KEYFRAMES_FOLLOWED_BY_NAME_REGEXP = /(@keyframes\s+)(\w+)/;
export const MEDIA_QUERY_REGEXP = /@media/;
export const PAGE_REGEXP = /@page/;

export default {
  AT_SYMBOL_REGEXP,
  FONT_FACE_REGEXP,
  GLOBAL_REPLACEMENT_REGEXP,
  GLOBAL_SELECTOR_REGEXP,
  HASH_SELECTOR_REGEXP,
  KEYFRAMES_REGEXP,
  KEYFRAMES_FOLLOWED_BY_NAME_REGEXP,
  MEDIA_QUERY_REGEXP,
  PAGE_REGEXP
};
