/*
Criando os seus próprios modulos. Isso permite o encapsulamento das funcionalidades, possibilitanto um bom desing e facilitando a manuteção e testes
############################
# Módulo biscoito da sorte #
############################
*/

//array oculto fora deste módulo, visivél só aqui.
const biscoito = [
    'A vida trará coisas boas se tiver paciência.',
    'Demonstre amor e alegria em todas as oportunidades e verá que a paz nasce dentro de si.',
    'Não compense na ira o que lhe falta na razão.',
    'Defeitos e virtudes são apenas dois lados da mesma moeda.',
    'A maior de todas as torres começa no solo.',
    'Não há que ser forte. Há que ser flexível.',
    'Todos os dias organiza os seus cabelos, por que não faz o mesmo com o coração?',
    'Há três coisas que jamais voltam; a flecha lançada, a palavra dita e a oportunidade perdida.',
    'A juventude não é uma época da vida, é um estado de espírito.',
    'Podemos escolher o que semear, mas somos obrigados a colher o que plantamos'
    ]

//exports: expõe globalmente a função getBiscoito para uso no projeto em qualquer arquivo Js
exports.getBiscoito =() => {
        //pega valores aleatorios do array biscoito e atribui a variávrl
        const randomBiscoitoMsg = Math.floor(Math.random()*biscoito.length)
        return biscoito[randomBiscoitoMsg]
}