const html = require('@open-wc/rollup-plugin-html');
const applySwRegistration = require('../index.js');

module.exports = [
  {
    input: 'demo/index.html',
    output: { 
      dir: 'demo/dist' 
    },
    plugins: [
      html(),
      applySwRegistration()
    ]
  },
  {
    input: 'demo/index.html',
    output: { 
      dir: 'demo/dist2' 
    },
    plugins: [
      html(),
      applySwRegistration({
        htmlFileName: 'index.html',
        prefix: 'foo',
        scope: 'bar',
        swName: 'custom-sw.js'
      })
    ]
  },
];