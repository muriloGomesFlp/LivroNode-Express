/*
Arquivo de configuração "abstração" para gerenciar as dependências
*/
const env = process.env.NODE_ENV 
const credentials = require(`./.credentials.${env}`)
module.exports = {credentials}