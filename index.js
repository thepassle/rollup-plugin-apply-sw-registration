const { parse, serialize } = require('parse5');
const Terser = require('terser');
const { createScript } = require('@open-wc/building-utils');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');


/**
 * @param {string} htmlString
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString) {
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('./sw.js')
          .then(function() {
            console.log('ServiceWorker registered.');
          })
          .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  `).code,
  );

  append(body, swRegistration);
  return serialize(documentAst);
};

/**
 * Takes the name of the index.html, and appends a minified service worker registration to the end of the document body
 * @param {String} [htmlFileName='index.html'] index.html
 */
module.exports = function applySwRegistration(htmlFileName = 'index.html') {
  return {
    name: 'rollup-plugin-inject-service-worker',
    generateBundle(_, bundle) {
      const htmlSource = bundle[htmlFileName].source;
      bundle[htmlFileName].source = applyServiceWorkerRegistration(htmlSource);
    },
  }
}