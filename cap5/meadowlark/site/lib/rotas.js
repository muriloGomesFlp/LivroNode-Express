/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/

const cookie = require('./biscoito')


exports.home = (req, res) => res.render('home')

exports.about = (req, res) => 
    res.render('about', {biscoito: cookie.getBiscoito()})

exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')}

    
 /* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => res.render('500')
 /* eslint-enable no-unused-vars */