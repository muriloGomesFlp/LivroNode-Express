/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const cookie = require('./biscoito')

exports.home = (req, res) =>  res.render('home')

exports.about = (req, res) =>
    res.render('about', { biscoito: cookie.getBiscoito() })

//example blocks cap7 pag 107 and 108
exports.blocks = (req, res) =>
    res.render('blocks', {
        currency: { name: 'Brazilian real', abbrev: 'BRL' },
        tours: [{ name: 'Balneário Camboriú', price: 'R$ 199.99' },
        { name: 'Florianópolis', price: 'R$299.99' }],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'BRL', 'EURO']
    })

//test sections, add head property and new scripts
exports.sections = (req, res) => res.render('section-test')

exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')
}


/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    console.error(`** Server Error: ${err.message}`)
    res.status(500)
    res.render('500')}
 /* eslint-enable no-unused-vars */