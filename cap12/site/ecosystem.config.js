/*
Arquivo de configuração do ecossistema, pode estar em outro local e apontar o script de inicialização da aplicação
por meio do lable "scripts". Com isso pode ser iniciado por meio do $ pm2 start ecossystem.config.js e este estará online.
Sempre definir o tipo de ambiente (development, tester ou production) no arquivo .env.
Pode ser monitorado com um dash interativo via $ pm2 monitor.
*/
require('dotenv').config()

module.exports = {
    apps: [{
      name: "app_book_meadowlark",
      script: "meadowlark.js",
      env: {
        NODE_ENV: process.env.NODE_ENV
      }
    }]
  }