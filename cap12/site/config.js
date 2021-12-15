/*
Arquivo de configuração "abstração" para gerenciar as dependências
*/
require('dotenv').config()

const env = process.env.NODE_ENV
const credentials = require(`./.credentials.${env}`)
module.exports = {credentials}