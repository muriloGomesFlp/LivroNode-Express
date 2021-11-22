const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas.js')

//configuração do Handlebars
let hbs = expressHandlebars.create({ defaultLayout: 'main' });
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

const port = process.env.PORT || 3000

//rotas das páginas + declaração dos arquivos estaticos
app.get('/', rotas.home)
app.get('/about', rotas.about)
app.use(express.static(__dirname + '/public'))

//pagina 404
app.use(rotas.notFound)

//pagina 500
app.use(rotas.serverErro)

//start server
if (require.main == module) {
    app.listen(port, () => console.log(
        `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))
} else {
    module.exports = app
}

