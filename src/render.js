// ./src/render.js
const fs = require('fs')
const handlebars = require('handlebars')
/**
 *
 * @param {object} meta metadata
 * @param {string} meta.description
 * @param {string} meta.name
 */
function render(meta) {
  const fileName = `${meta.name}/package.json`
  const content = fs.readFileSync(fileName).toString()
  // compile the package.json template
  const result = handlebars.compile(content)(meta)
  fs.writeFileSync(fileName, result)
}

module.exports = render
