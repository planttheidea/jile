import test from 'ava';

import sqwish from '../../src/utils/sqwish';

const SIMPLE_STANDARD_CSS = `
.container {
  display: inline-block;
  background-color: red;
}
`;

const SIMPLE_MINIFIED_CSS = '.container{display:inline-block;background-color:red}';

const COMPLEX_STANDARD_CSS = `
@keyframes jile__crazyStuff__143051614 {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
html, body {
  margin: 0px;
  padding: 0px;
}
.jile__parent__3780649764 {
  font-size: 18px;
  padding: 15px;
}
.jile__parent__3780649764 .jile__child__430086381 {
  font-size: 12px;
}
.jile__parent__3780649764 .jile__crazyAnimation__3889025733 {
  animation: 10s jile__crazyStuff__143051614 infinite;
  font-size: 24px;
  transform-origin: left center;
}
@media screen and (max-width: 999px) {
  .jile__parent__3780649764 {
    background-color: lightgray;
  }
  .jile__parent__3780649764 .jile__child__430086381 {
    font-size: 28px;
  }
}
@media screen and (min-width: 1000px) {
  .jile__parent__3780649764 {
    background-color: red;
  }
  .jile__parent__3780649764 .jile__child__430086381 {
    font-size: 32px;
  }
}
@media print {
  html, body {
    color: #777;
  }
  @media (min-width: 1000px) {
    .jile__parent__3780649764 {
      border: 1px solid #000;
    }
  }
}
@page :first {
  size: Letter landscape;
}
`;
const COMPLEX_MINIFIED_CSS = '@keyframes jile__crazyStuff__143051614{0%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0)}}html,body{margin:0;padding:0}.jile__parent__3780649764{font-size:18px;padding:15px}.jile__parent__3780649764 .jile__child__430086381{font-size:32px}.jile__parent__3780649764 .jile__crazyAnimation__3889025733{animation:10s jile__crazyStuff__143051614 infinite;font-size:24px;transform-origin:left center}@media screen and (max-width:999px){.jile__parent__3780649764{background-color:lightgray}}@media screen and (min-width:1000px){.jile__parent__3780649764{background-color:red}}@media print{html,body{color:#777}@media (min-width:1000px){.jile__parent__3780649764{border:1px solid #000}}}@page:first{size:Letter landscape}';

test('sqwish minifies CSS properly', (t) => {
  t.is(sqwish(SIMPLE_STANDARD_CSS), SIMPLE_MINIFIED_CSS);
  t.is(sqwish(COMPLEX_STANDARD_CSS), COMPLEX_MINIFIED_CSS);
});