
/* eslint-disable */
// highlight.js
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/a11y-dark.css";

hljs.registerLanguage("javascript", javascript);

let Highlight = {}
Highlight.install = function (Vue, options) {
  Vue.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre');
    blocks.forEach((block) => {
      hljs.highlightBlock(block)
    })
  })
}
export default Highlight