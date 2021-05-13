#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('inquirer')
const symbols = require('log-symbols')
const download = require('./download')
const render = require('./render')
const repositories = require('./repositories')

// version
program.version(
  require(path.resolve(__dirname, '../package.json')).version,
  '-V, --version'
)

// create
program
  .command('create <name>')
  .description('create a new project powered by maetpl-cli')
  .action(async (name) => {
    if (fs.existsSync(name)) {
      console.error(
        symbols.error,
        chalk`{rgb(255,255,255) Target directory {rgb(130,223,226) ${process.cwd()}/${name}} already exists.}`
      )
    } else {
      const { type } = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'choose a templete type you want to create:',
          choices: ['Vue', 'React', 'Node.js', 'Electron']
        }
      ])
      const typeRepositories = repositories[type]
      const typeKeys = Object.keys(typeRepositories)
      if (typeRepositories && typeKeys.length > 0) {
        const { templateName, description, author } = await inquirer.prompt([
          {
            name: 'templateName',
            message: `choose the template you need:`,
            type: 'list',
            choices: typeKeys
          },
          {
            name: 'description',
            message: 'please enter a description:'
          },
          {
            name: 'author',
            message: 'please enter a author:'
          }
        ])
        const downloadPath = `direct:${typeRepositories[templateName]}`
        // 下载模板
        download(downloadPath, name, { clone: true })
          .then(() => {
            render({ author, description, name })
            console.log(
              symbols.success,
              chalk`{rgb(87,190,56) download successfully!}`
            )
          })
          .catch((err) => {
            console.error(symbols.error, chalk`{rgb(255,255,255) ${err}}`)
            console.error(
              symbols.error,
              chalk`{rgb(255,255,255) download template fail,please check your network connection and try again.}`
            )
            process.exit()
          })
      } else {
        console.log(
          symbols.info,
          chalk`{rgb(255,255,255) There are no templates for ${type}}`
        )
      }
    }
  })

// clear terminal
clear()

// logo
console.log(
  chalk.blueBright(figlet.textSync('Maetpl', { horizontalLayout: 'full' }))
)
// parse the argv from terminal
program.parse(process.argv)