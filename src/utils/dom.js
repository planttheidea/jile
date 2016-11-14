/**
 * get the new tag with the textContent set to the css string passed
 *
 * @param {string} css
 * @param {string} id
 * @param {Object} sourceMap
 * @returns {HTMLElement}
 */
const getPopulatedTag = (css, id, {sourceMap}) => {
  if (!window || !document) {
    return null;
  }

  if (sourceMap) {
    const blob = new window.Blob([css], {
      type: 'text/css'
    });

    let link = document.createElement('link');

    link.rel = 'stylesheet';
    link.id = id;
    link.href = URL.createObjectURL(blob);

    return link;
  }

  let style = document.createElement('style');

  // old webkit hack
  style.appendChild(document.createTextNode(''));

  style.id = id;
  style.textContent = css;

  return style;
};

export {getPopulatedTag};
