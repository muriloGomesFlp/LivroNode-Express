module.exports = (req, res, next) => {
    // se houver uma mensagem transfira para o contexto e depois remova
    res.locals.flash = req.session.flash
    delete req.session.flash
    next()
}
