/*
Arquivo de configuração "abstração" para gerenciar as dependências
*/


const env = process.env.NODE_ENV || 'development'
const credentials = require(`./.credentials.${env}`)
module.exports = {credentials}