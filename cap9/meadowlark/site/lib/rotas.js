/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const cookie = require('./biscoito')
require('dotenv').config({
    path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
})
/*
Versão modificada da regex de email HTML oficial do W3C 
<https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address>
*/
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$') //("/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/")

// interface falsa de "inscrição em boletim informativo"s
class NewsletterSignup {
    constructor({ name, email }) {
        this.name = name
        this.email = email
    }
    async save() {
        /*
        aqui é onde faríamos o trabalho de salvar em um banco de dados, já que este método é assíncrono,
        ele retornará uma promessa e, como não estamos lançando nenhum erro, a promessa será resolvida com sucesso
        */
    }
}



exports.home = (req, res) => {
    res.render('home')
}

exports.about = (req, res) => {
    /*envio de cookie assinado e não assinado uso do httpOnly ajuda a evitar ataques XSS(cross-site-scripting)
    que midifica o conteudo do cookie. O uso do signed assina o cookie sendo este aceito pelo servidor, 
    caso o cookie seja modificado, este será rejeitado pelo servidor e redefinido com os valores originais. 
    O path controla onde o cookie é aplicavel, neste caso esta sendo aplicado em todo o site '/', caso fosse aplicado somente em uma 
    pagina seria usasdo '\about'.
    */
    res.cookie('name', 'tobi', { httpOnly: true, path: '/' })
    res.cookie('token', 'a1s2d3f4g5', { httpOnly: true, signed: true })
    //usando sessões
    req.session.userName = 'Anonimo'
    req.session.colorScheme = 'dark'
    res.render('about', { biscoito: cookie.getBiscoito() })
}
//example blocks cap7 pag 107 and 108
exports.blocks = (req, res) => {
    //limpando um cookie  
    res.clearCookie('name', { path: '/' })
    //Excluindo um atributo na sessão
    delete req.session.colorScheme
    res.render('blocks', {
        currency: { name: 'Brazilian real', abbrev: 'BRL' },
        tours: [{ name: 'Balneário Camboriú', price: 'R$ 199.99' },
        { name: 'Florianópolis', price: 'R$299.99' }],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'BRL', 'EURO']
    })
}

exports.sections = (req, res) => res.render('section-test')

exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')
}

exports.formNewsletterSigup = (req, res) => {
    res.render('formNewsletterSignup', { csrf: process.env.CSRF })
}


//validando dados e retornando uma flash message
exports.formNewsletterSigupProcess = (req, res) => {
    const name = req.body.name || '', email = req.body.email || ''
    console.log(VALID_EMAIL_REGEX.test(email))
    console.log(`nome: ${name}; email: ${email}`)
    //validar dados de entrada
    if (VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation Error!',
            message: 'The email address you entred was not valid'
        }
        return res.redirect(303, '/formNewsletter')
    }
    /*
    Exemplo de tratameno quando os dados forem validados, retornando um flash message ao usuário.
    Foi criado uma instancia da classe 'NewsletterSignup', passando os agumentos (name, email) para o tratamento
    conforme a classe. Neste caso seria uma simulação de salvamento em BD usando um async (assíncrono)
    */
    new NewsletterSignup({ name, email }).save()
        .then(() => {
            req.session.flash = {
                type: 'success',
                intro: 'Thank you!',
                message: 'You have now been signed up for the newsletter.',
            }
            return res.redirect(303, '/formNewsletter/thanks')
        })
        .catch(err => {
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            }
            return res.redirect(303, '/formNewsletter/thanks')
        })
}

exports.newsletterSignupThanks = (req, res) => res.render('newsletterThanks')

/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    console.error(`** Server Error: ${err.message}`)
    res.status(500)
    res.render('500')
}
 /* eslint-enable no-unused-vars */