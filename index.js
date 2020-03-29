const { parse, serialize } = require('parse5');
const Terser = require('terser');
const { createScript } = require('@open-wc/building-utils');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');

/**
 * @param {string} htmlString
 * @param {string} scope
 * @param {string} base
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString, scope, base) {
  const addScope = !!scope;
  const addbase = !!base;
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('./${addbase ? base : ''}sw.js'${addScope ? `,{ scope: '.${scope}' }` : ''})
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
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} Options
 * @property {String} [htmlFileName='index.html'] htmlFileName
 * @property {String} [scope=''] scope
 * @property {boolean} [base=''] - useful if you're using a <base> tag, example: base: 'foo/'
 */

/**
 * Takes the name of the index.html, and appends a minified service worker registration to the end of the document body
 * @param {Options} options
 */
module.exports = function applySwRegistration(options) {
  const _opts = { 
    htmlFileName: 'index.html',
    scope: '',
    base: '',
    ...(options || {})
  };

  return {
    name: 'rollup-plugin-inject-service-worker',
    generateBundle(_, bundle) {
      const htmlSource = bundle[_opts.htmlFileName].source;
      bundle[_opts.htmlFileName].source = applyServiceWorkerRegistration(htmlSource, _opts.scope, _opts.base);
    },
  }
}