const html = require('../dist/index.umd.js')

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins:[
    html({
      template: 'src/index.html',
      filename: 'index.html'
    })
  ]
}