const fs = require('fs')
const cheerio = require('cheerio')
const hasha = require('hasha')
const path = require('path')

export default (options = {}) => {
  const { template, filename, title, inject, defaultmode } = options
  
  const plugins = {}

  plugins.name = 'generateHtmlTemplate'

  plugins.generateBundle = (config,data) => {

    const $ = cheerio.load(fs.readFileSync(template).toString())
    const head = $('head')
    const body = $('body')
    const _title = $('title')
    const { file } = config  // dist/bundle.js'
    const destPath = path.relative('./', file)
    const destdir = destPath.slice(0, destPath.indexOf(path.sep))
    const destFile = `${destdir}/${filename || path.basename(template)}` //如果没有提供filename 那就在template目录下生成文件
    const fileList = getFileTraversd(destdir)

    if (title) _title.innerText = title

    fileList.forEach(item => {
      const { file, type } = item
      let hash = ''
      let code = ''

      if (/\[hash\]/.test(file)) {
        if (file === destPath) {
          // data.code will remove the last line of the source code(//# sourceMappingURL=xxx), so it's needed to add this
          code = data.code + `//# sourceMappingURL=${path.basename(file)}.map`;
        } else {
          code = fs.readFileSync(file).toString();
        }
        hash = hasha(code, { algorithm: 'md5' });
        // remove the file without hash
        fs.unlinkSync(file);
        file = file.replace('[hash]', hash)
        fs.writeFileSync(file, code);
      }

      const src = isURL(file) ? file : path.relative(destdir, file)

      if(type === 'js') {
        let attrs = { src }
        let mode = item.mode || defaultmode
        if (mode) attrs.type = mode
        let attrText = ''
        Object.keys(attrs).forEach(item => {
          attrText += `${item}="${attrs[item]}"`
        })
        const script = `<script ${attrText}></script>\n`
        if (item.inject === 'head' || inject === 'head') {
          head.append(script);
        } else {
          body.append(script);
        }
      }
      if(type === 'css') {
        head.append(`<link rel="stylesheet" href="${src}">\n`);
      }
    })
    fs.writeFileSync(destFile, $.html())
  }
  return plugins
}

function getFileTraversd(dir) {
  const fileList = []
	const dirList = fs.readdirSync(dir)
	dirList.forEach(node => {
		const file = `${dir}/${node}`
		if (fs.statSync(file).isDirectory()) {
			traverse(file, list)
		} else {
			if (/\.js$/.test(file)) {
				fileList.push({ type: 'js', file })
			} else if (/\.css$/.test(file)) {
				fileList.push({ type: 'css', file })
			}
		}
  })
  return fileList
}

function isURL(url){
  return /^(((https|http|ftp|rtsp|mms):)?\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(url);
}