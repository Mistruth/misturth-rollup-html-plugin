const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
// const buble = require('rollup-plugin-buble')
const pkg = require('./package.json')

const main = pkg.main
const module = pkg.module

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'html'
  },
  plugins: [
    resolve(),
    commonjs(),
  ]
}