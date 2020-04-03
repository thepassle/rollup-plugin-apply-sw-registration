const { parse, serialize } = require('parse5');
const Terser = require('terser');
const { createScript } = require('@open-wc/building-utils');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');

/**
 * @param {string} htmlString
 * @param {string} scope
 * @param {string} prefix
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString, scope, prefix, swName) {
  const addScope = !!scope;
  const addPrefix = !!prefix;
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('./${addPrefix ? `${prefix}/` : ''}${swName}'${addScope ? `,{ scope: './${scope}' }` : ''})
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
 * @property {String} [prefix=''] prefix
 * @property {String} [swName=''] swName
 */

/**
 * Takes the name of the index.html, and appends a minified service worker registration to the end of the document body
 * @param {Options} options
 */
module.exports = function applySwRegistration(options) {
  const _opts = { 
    htmlFileName: 'index.html',
    scope: '',
    prefix: '',
    swName: 'sw.js',
    ...(options || {})
  };

  return {
    name: 'rollup-plugin-inject-service-worker',
    generateBundle(_, bundle) {
      const htmlSource = bundle[_opts.htmlFileName].source;
      bundle[_opts.htmlFileName].source = applyServiceWorkerRegistration(htmlSource, _opts.scope, _opts.prefix, _opts.swName);
    },
  }
}