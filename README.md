# Rollup-plugin-apply-sw-registration

Rollup plugin that appends minified service worker registration code to the end of the document body. This can be useful if you only want to apply the service worker for your production build, and not during development.

Example usage:
```js
import applySwRegistration from 'rollup-plugin-apply-sw-registration';
import html from '@open-wc/rollup-plugin-html';

const htmlPlugin = html();

export default {
  input: 'index.js',
  output: {
    format: 'es',
    dir: 'build'
  },
  plugins: [
    htmlPlugin,
    applySwRegistration(htmlPlugin.getHtmlFileName())
  ]
}
```