/*
Usando o puppeteer para testar a interação DOM nas páginas, por sua vez, ao utilizar do porfinder
contribui para evitar menssagens de erros ocasionadas pelo test, isso porque o aplicativo não pode ser
iniciado pela porta que foi solicitado.
*/

const portfinder = require('portfinder')
const puppeteer = require('puppeteer')

const app = require('../meadowlark.js')

let server = null
let port = null

//inicia o servidor antes do teste, esta função é do Jest
beforeEach(async () => {
    port = await portfinder.getPortPromise()
    server = app.listen(port)
})

//fecha o server após o teste
afterEach(()=>{
    server.close()
})

/*
OBS.: caso haver vários testes, pode ser utilizado o beforeAll e o afterAll, incia o servidor e encerra após o
termino dos testes.
*/

test('teste interção DOM home page to about page', async () => {
    /* definir o tamanho da tela e passar os parametros para a função launch que ira
    "abrir" ao browser em backend. OBS.: a função async é sempre aconpanhada pelo await.
    isso usa o conseito de "promessa, ou seja, a função realiza uma solicitação e fica com a
    "promessa" de um retorno de resposa, que quandou houver será processado. Isso é conhecido
    como uma sollicitação assíncrona.*/
    const width = 1024;
    const height = 1600;
    const browser = await puppeteer.launch(
        {
            'defaultViewport' : { 'width' : width, 'height' : height }
        });
    //solicitando uma nova página ao brower
    const page = await browser.newPage()
    //determinando a url para o navrgador
    await page.goto(`http://localhost:${port}`)
    /*é realizado o encapsulamento da navegação (aguardando resposta e clicar no atributo)
    isso evita o "racer condition". Essa condição ocorre quando duas ou mais threads acessam dados
    compartilhados e tentam efetuar ações ao mesmo tempo.*/
    await Promise.all([
        page.waitForNavigation(),
        page.click('[data-test-id="about"]'),
    ])
    //ao final é testado se a página foi de fato acessada
    expect(page.url()).toBe(`http://localhost:${port}/about`)
    //por fim é fechado o browser
    await browser.close()
})