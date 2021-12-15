const cluster = require('cluster')
require('dotenv').config()

const port = process.env.PORT

function startWorker() {
  const worker = cluster.fork()
  console.log(`CLUSTER: Worker ${worker.id} iniciou`)
}

if(cluster.isMaster){

  require('os').cpus().forEach(startWorker)
    /*
    registrar todos os trabalhadores que se desconectarem;
    se um trabalhador se desconectar, ele deve sair, então
    vamos esperar o evento de saída para gerar um novo trabalhador 
    para substituí-lo
    */
  cluster.on('disconnect', worker => console.log(
    `CLUSTER: Worker ${worker.id} disconectou do cluster.`
  ))

  // quando um trabalhador morre (worker) - (exits), Cria-se outro para subistituilo
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `CLUSTER: Worker ${worker.id} morreu ` +
      `code ${code} (${signal})`
    )
    startWorker()
  })

} else {
    const port = process.env.PORT
    // Inicializa o app com o worker; ver meadowlark.js
    require('./meadowlark.js')(port)

}
