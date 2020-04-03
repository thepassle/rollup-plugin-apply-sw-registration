# Rollup-plugin-apply-sw-registration

Rollup plugin that appends minified service worker registration code to the end of the document body. This can be useful if you only want to apply the service worker for your production build, and not during development.

Example usage:
```js
import applySwRegistration from 'rollup-plugin-apply-sw-registration';
import html from '@open-wc/rollup-plugin-html';

export default {
  input: 'demo/index.html',
  output: { 
    dir: 'demo/dist' 
  },
  plugins: [
    html(),
    applySwRegistration()
  ]
}
```

Customized:

```js
import applySwRegistration from 'rollup-plugin-apply-sw-registration';
import html from '@open-wc/rollup-plugin-html';

export default {
  input: 'demo/index.html',
  output: { 
    dir: 'demo/dist' 
  },
  plugins: [
    html(),
    applySwRegistration({
      htmlFileName: 'custom-index.html',
      prefix: 'foo',
      scope: 'bar',
      swName: 'custom-sw.js'
    })
  ]
}
```

## Configuration

| name          | type           | description                                                             |
| ------------- | -------------- | ----------------------------------------------------------------------- |
| htmlFileName  | string         | custom html file name, 'index.html' by default                          |
| prefix        | string         | custom prefix                                                           |
| scope         | string         | will add a custom scope to the sw registration.                         |
| swName        | string         | custom service worker name                                              |