/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const session = require('express-session')
const cookie = require('./biscoito')


const products = [
    { id: 'hPc8YUbFuZM9edw4DaxwHk', name: 'Rock Climbing Expedition in Bend', price: 239.95, requiresWaiver: true },
    { id: 'eyryDtCCu9UUcqe9XgjbRk', name: 'Walking Tour of Portland', price: 89.95 },
    { id: '6oC1Akf6EbcxWZXHQYNFwx', name: 'Manzanita Surf Expedition', price: 159.95, maxGuests: 4 },
    { id: 'w6wTWMx39zcBiTdpM9w5J7', name: 'Wine Tasting in the Willamette Valley', price: 229.95 },
]

const productsById = products.reduce((byId, p) => Object.assign(byId, { [p.id]: p }), {})


exports.home = (req, res) => {
    console.log(req.session)
    res.render('home')
}

exports.about = (req, res) => {
    req.session.userName = 'Anonimo'
    req.session.colorScheme = 'dark'
    res.render('about', { biscoito: cookie.getBiscoito() })
}

exports.cart = (req, res) => {
    const cart = req.session.cart || { items: [] }
    const context = { products, cart }
    res.render('cart', context)
}

exports.addCart = (req, res) => {
    if (!req.session.cart) req.session.cart = { items: [] }
    const { cart } = req.session
    console.log(req.body)
    Object.keys(req.body).forEach(key => {
        if (!key.startsWith('guests-')) return

        const productId = key.split('-')[1]
        const product = productsById[productId]
        const guests = Number(req.body[key])

        if (guests === 0) return // no guests to add

        if (!cart.items.some(item => item.product.id === productId)) cart.items.push({ product, guests: 0 })

        const idx = cart.items.findIndex(item => item.product.id === productId)
        const item = cart.items[idx]
        item.guests += guests

        if (item.guests < 0) item.guests = 0

        if (item.guests === 0) cart.items.splice(idx, 1)
    })
    res.redirect('/cart')
}

exports.clearCart = (req, res) => {
   console.log(!req.session.cart)
   if(!req.session.cart == false){
    delete req.session.cart
   } 
   res.send({resp:true}) 
}

exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')
}

/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    console.error(`** Server Error: ${err.message}\n`)
    res.status(500)
    res.render('500')
}
 /* eslint-enable no-unused-vars */