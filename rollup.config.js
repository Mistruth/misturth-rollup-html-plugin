const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
// const buble = require('rollup-plugin-buble')
const pkg = require('./package.json')

const main = pkg.main
const module = pkg.module

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.es.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    commonjs(),
  ]
}