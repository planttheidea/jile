const jsdom = require('jsdom').jsdom;
const jsdomGlobal = require('jsdom-global');

global.document = jsdom('<html></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

jsdomGlobal();
