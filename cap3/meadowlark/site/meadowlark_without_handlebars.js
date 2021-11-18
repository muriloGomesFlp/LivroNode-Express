const express = require('express')
const app = express()

//Definido a porta atráves de uma variável de ambiente antes da inicialização do servidor
const port = process.env.PORT || 3000


/*Observações:
No node puro usa-se metodos diferentes do express(mais simples e fácil):
- Node: res.end -> express: res.send
- Node:res.writeHead -> express: res.set, res.status, res.type Ver Cap2.*/

//Rotas para as páginas -> devem vir sempre em primeiro em relação ao app.use
/*O roteador de rotas do expresse app.get, realiza alguns tratamentos de formta automática como
o tratamento de querystring, ver cap1 req.url para comparar*/


app.get('/', (req, res) => {
    res.type('text/plain')
    res.send('Meadowlark Travel')
})

/*se add o * em '/about*' e este estiver acima na ordem de excução, 
as demais sub-rotas do about não irão funcionar ex.:/about/contat não 
*/
app.get('/about*', (req, res) => {
    res.type('text/plain')
    res.send('About Meadowlark Travel')
})

app.get('/about/contact', (req, res) => {
    res.type('text/plain')
    res.send('Contact Meadowlark Travel')
})

app.get('/services', (req, res) => {
    res.type('text/plain')
    res.send('Services Meadowlark Travel')
})

//Página 404 personalizada
/*o app.use é um método que o express adiciona um middleware(cap10). No momento ele apenas manipula
o que não for considerado como rota*/
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
})

//Página 505 personalizada
app.use((err, req, res, next) => {
    console.erro(err.message)
    res.type('text/plain')
    res.status(505)
    res.send('500 - Server Error')
})


app.listen(port, () => console.log(
    `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))