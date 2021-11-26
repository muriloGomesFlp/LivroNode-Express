//variável para atividade inicial de fornecer uma API
const produtos = [{ id:0, nome:'Tênis A', preco:29.90 }, { id: 1, nome: 'Tênis B', preco: 79.90 }]

//endpoint API json - A variavel produtos foi definida anteriormente 
exports.apiJson = (req, res) => { res.json(produtos) }

//endpoint API json,xml ou texto conforme requiasição do cliente - A variavel produtos foi definida anteriormente 
exports.apiMix = (req, res) => {
    const produtossXml = '<?xml version="1.0"?><produtos>' +
        produtos.map(p =>`<produtos preço="${p.preco}" id="${p.id}">${p.nome}</produtos>`).join('') + '</produtos>'
    const produtosText = produtos.map(p => `${p.id}: ${p.nome} (${p.preco})`).join('\n')
    res.format({
        'application/json': () => res.json(produtos),
        'application/xml': () => res.type('application/xml').send(produtossXml),
        'text/xml': () => res.type('text/xml').send(produtossXml),
        'text/plain': () => res.type('text/plain').send(produtosText),
    })
}

//endpoint PUT para atualizar um produto, enviando a atualização pelo body usando json
exports.apiPut = (req, res) => {
    const p = produtos.find(p => p.id === parseInt(req.params.id))
    if(!p) return res.status(410).json({ error: 'Nenhum produto encontrado' })
    if(req.body.nome) p.nome = req.body.nome
    if(req.body.preco) p.preco = req.body.preco
    res.json({ success: true })
}

//endpoint DELETE, enviando o ID por parametro
exports.apiDel = (req, res) => {
    const idx = produtos.findIndex(produtos => produtos.id === parseInt(req.params.id))
    if(idx < 0) return res.json({ error: 'Nenhum produto encontrado' })
    produtos.splice(idx, 1)
    res.json({ success: true })
}