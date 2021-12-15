//encapsulando o serviço de envio de email

const nodemailer = require('nodemailer')
const htmlToFormattedText = require('html2plaintext')


module.exports = credentials => {

    const mailTransport = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: credentials.sendgrid.user,
            pass: credentials.sendgrid.password
        }
    })

    const from = '"Contato GCF" <contato@gcf.app.br>'
    const errorRecipient = 'lilo.flp@gmail.com'

    return {
        send: (to, subject, html) =>
            mailTransport.sendMail({
                from,
                to,
                subject,
                html,
                text: htmlToFormattedText(html),
            }),
    }

}
