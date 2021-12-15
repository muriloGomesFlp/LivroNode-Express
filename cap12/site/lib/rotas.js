/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const cookie = require('./biscoito')
require('dotenv').config()
const nodeMailer = require('nodemailer')
const { credentials } = require('../config')
//instaciando o serviço de email encapsulado e enviando as credenciais
const emailService = require('./email')(credentials)
const Sentry = require("@sentry/node");



exports.home = (req, res) => {
    res.render('home')
}

exports.about = (req, res) => {
    res.render('about', { biscoito: cookie.getBiscoito() })
}

exports.mail = (req, res) => {
    res.render('mail', { csrf: process.env.CSRF })
}

exports.api = {
    sendMail: async (req, res) => {
        if (req.body.emailTo) {
            emailService.send(req.body.emailTo, req.body.emailSubject,
                req.body.emailText)
                .then(() => {
                    res.send({ success: true })
                })
                .catch(err => {
                    const hub = Sentry.getCurrentHub();
                    hub.withScope(async (scope) => {
                        scope.setLevel('error');
                        hub.setTag("emailError", "BookCap12");
                        hub.captureException(err)
                    })
                    console.log(`Error ao enviar o email: ${err}`)
                    res.send({ success: false })
                })
        }
    }
}

exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')
}

/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    console.error(`** Server Error: ${err.message}\n`)
    res.status(500)
    res.render('500', { msg: err.message, stack: err.stack })
}
 /* eslint-enable no-unused-vars */