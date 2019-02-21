const commonjs = require('rolluo-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const pkg = require('./package.json')

const main = pkg.main
const module = pkg.module

export default {
  input: 'src/index.js',
  targets: [
   { format: 'es',dest: module },
   { fromat: 'cjs', dest: main }
  ],
  plugins: [
    resolve(),
    commonjs(),
    buble()
  ]
}