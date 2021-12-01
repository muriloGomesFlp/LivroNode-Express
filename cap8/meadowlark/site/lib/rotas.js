/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const cookie = require('./biscoito')
const fs = require('fs');
require('dotenv').config({
    path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
})

exports.home = (req, res) => res.render('home')

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

//form handlers - Send a CSRF code at form page
exports.formNewsletterSigup = (req, res) => {
    res.render('formNewsletterSignup', { csrf: process.env.CSRF })
}
//page fetch mode
exports.formNewsletterSigupFecth = (req, res) => res.render('formNewsletterSignupFetch', { csrf: process.env.CSRF })


//Fetch mode with api (fetch)
exports.api = {
    newsletterSigup: (req, res) => {
        console.log(`CSRF token (from hidden form filed): ${req.body._csrf}`)
        console.log(`Name (from visible form filed): ${req.body.name}`)
        console.log(`Email (from visible form filed): ${req.body.email}`)
        res.send({ result: 'success' })
    }
}

//form handlers - get data from form
exports.formNewsletterSigupProcess = (req, res) => {
    console.log(`CSRF token (from hidden form filed): ${req.body._csrf}`)
    console.log(`Name (from visible form filed): ${req.body.name}`)
    console.log(`Email (from visible form filed): ${req.body.email}`)
    res.redirect(303, '/formNewsletter/thanks')
}

//when the redirect is call, this handler will go send the page below
exports.newsletterSignupThanks = (req, res) => res.render('newsletterThanks')

//contest photo form (upload file example)
exports.contestVacation = (req, res) => {
    const dateNow = new Date()
    res.render('contest/formPhoto', {
        csrf: process.env.CSRF,
        year: dateNow.getFullYear(),
        month: dateNow.getMonth()
    })
}


//contest photo form (upload file exmaple with fetch - Ajax)
exports.contestVacationfetch = (req, res) => {
    const dateNow = new Date()
    res.render('contest/formPhotoFetch', {
        csrf: process.env.CSRF,
        year: dateNow.getFullYear(),
        month: dateNow.getMonth()
    })
}

exports.api.formPhotoFetch = (req, res, fields, files) => {
    console.log('filed data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
}



exports.contestVacationPhotoProcess = (req, res, fields, files) => {
    console.log('filed data: ', fields)
    console.log('files: ', files)
    res.redirect(303, '/contest/contestVacationThanks')
}


exports.contestVacationThanks = (req, res) => res.render('contest/contestVacationThanks')


/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    console.error(`** Server Error: ${err.message}`)
    res.status(500)
    res.render('500')
}
 /* eslint-enable no-unused-vars */