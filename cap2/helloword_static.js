//Simple Web server, static content

const http = require('http')
const fs = require('fs')
const port = process.env.port || 3000

`Esta função realisa a leitura dos arquivos. Ao utilizar o metodo readfile(assíncrono) este realiza a leitura
do arquivo e por meio do callback "=> - retorno" se o arquivo não existir ou não possuir permissão de leitura
a variaável "err" será ativada e irá retornar o "500 - Internal Error". Se estiver certo retorna ao cliente
com o código de resposta 200 e o conteudo desejado` 

function serverStaticFile(res, path, contenType, responseCode = 200) {
    console.log(path)
    //var __dirname, retorna o diretório no qual o script esta sendo executado
    fs.readFile(__dirname + path, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            return res.end('500 - Internal Error')
        }
        res.writeHead(responseCode, { 'Content-Type': contenType })
        res.end(data)
    })
}

const server = http.createServer((req, res) => {
    //Normailiza a URL removendo a querystring e a barra final, opcional e usando letras minusculas
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase()
    switch (path) {
        case '':
            serverStaticFile(res, '/public/home.html', 'text/html')
            break
        case '/about':
            serverStaticFile(res, '/public/about.html', 'text/html')
            break
            `Definir as img para ter o acesso destas no html, caso contrario isso não é possível`
        case '/img/nodejs_logo2.jpg':
            serverStaticFile(res, '/public/img/nodejs_logo2.jpg', 'image/jpg')
            break
        case '/img/node_logo.jpg':
            serverStaticFile(res, '/public/img/node_logo.jpg', 'image/jpg')
            break
            case '/img/404.jpeg':
            serverStaticFile(res, '/public//img/404.jpeg', 'image/jpeg')
            break
        default:
            serverStaticFile(res, '/public/404.html', 'text/html', 404)
            break
    }

})

server.listen(port, () => console.log('server started on port ' + port + '; ' + 'press Ctrl-C to terminate...'))
