const rotas = require('../rotas.js')


/*
Em relação ao teste da home page:
    - para que o manipulador de rotas funcione e necessário uma requisição e uma resposata. Neste caso
não teremos uma requisição então foi atribuido um valor vazio para a variável req. Contudo, iremos testar
a variável de resposta por meio da função do jest.fn(), desta forma, é criado uma função de mocking genérica 
que simula uma requisição real de chamada.
    - Por fim, deve-se testar as asseções, ou seja, definir o que realmente se espera como saída. Neste caso,
a função "mock" registra todas as vezes que foi chamada, logo por se tratar de uma requisição de reinderização de página
esta deve ser chamada uma unica vez e resultar em uma sáida espera, sendo o render da página home. a atribuição do
array [0][0] é a posição relacionada com a chamada e o segundo argumento.*/

test('home page renders', () => {
    const req ={}
    const res = { render: jest.fn() }
    rotas.home(req, res)
    console.log(res.render.mock.calls[0][0])
    expect(res.render.mock.calls[0][0]).toBe('home')
})

/*
Segue a mesma linha do teste anterior, contudo foi adicionado um outro parametro de saída esperada,
ou seja, espera-se que ao executa a função biscoito, seja obtido um conteúdo no formato string que possua
ao mesnos um caracter.
*/

test('about page renders com o biscoito da sorte', () => {
    const req ={}
    const res = { render: jest.fn() }
    rotas.about(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('about')
    expect(res.render.mock.calls[0][1]).toEqual(expect.objectContaining({
        biscoito: expect.stringMatching(/\W/),
    }))

})

test('404 hendler renders', () => {
    const req ={}
    const res = { render: jest.fn() }
    rotas.notFound(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('404')    
})

/*
Neste teste as saídas esperadas são as mesmas anteriores 
(reinderizar a pagina 500.hbs e que possua ao menos tamnho 1), a unica diferença é que nesta
função são repassados quatro argumentos, sendo necessário fornecer mais mocks.
*/
test('500 hendler renders', () => {
    const err = new Error('algum erro')
    const req ={}
    const res = { render: jest.fn() }
    const next = jest.fn() 
    /* eslint-disable no-unused-vars */
    rotas.serverErro(err, req, res, next) 
    /* eslint-enable no-unused-vars */
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('500')    
})

/*
- Para executar os testes utilizar comando "npm test". 
- Para ativar o modo watch (monitoramento constante das alteração no arquivo de teste),
executar "npm test -- --watch" 
- Para verificar a cobertura de teste, ou seja, ate onde deve ser testado, deve-se executar o comando
"npm test -- --coverage" e o test irá apresentar uma "tabela" em 0-100% com algumas informações:
    * Cobertura de instruções (smts,statements) => refere-se aos comando Js (expressões, instruções de fluxo de controle, etc.), OBS: pode haver várias instruções na mesma linha
    * Branch: Fluxo de controle (if-else, por exemplo)
    * Funcs: Funções
    * Lines: Linhas
    * Uncovered lines: Linhas sem cobertura

Mais detalhes e a documentação em relação à testes em https://jestjs.io
*/