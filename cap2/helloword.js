//Simple Web server, just a text content

const http = require('http')
const port = process.env.port || 3000

`const server recebe umaa requisição "req"; o Node usa uma programação baseada em eventos, semelhante o
on click do Jquery, onde recebe-se umevento click da interface para executar o códio ou parte. Isso ocorre
semelhante ao server Node, pois o server espera o evento "req" para responder.`

const server = http.createServer((req , resp)=>{
    //Normailiza a URL removendo a querystring e a barra final, opcional e usando letras minusculas
    const path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase()
    console.log(path)
    switch(path){
        case '':
            resp.writeHead(200, {'Content-Type': 'text/plain'})
            resp.end('Home Page!')
            break
        case '/about':
            resp.writeHead(200, {'Content-Type': 'text/plain'})
            resp.end('About')
            break
        default:
            resp.writeHead(200, {'Content-Type': 'text/plain'})
            resp.end('Not Found')
    }
   
})

server.listen(port, () => console.log('server started on port '+port+';' + 'press Ctrl-C to terminate...'))
