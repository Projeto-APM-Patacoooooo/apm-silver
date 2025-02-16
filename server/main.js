/*
    Este código é o coração do nosso servidor, 
    então, por favor, rapazes, não saiam mexendo nele sem saber o que estão fazendo.

    Deixei tudo bem comentado caso queiram mudar alguma funcionalidade.

    E lembrem-se: não subam nada no GitHub antes de testar suas alterações!

    Seu amigo: Eduardo Bezerra
*/

/* 
    Abaixo estamos simplesmente importanto a biblioteca express.
    Ela é uma biblioteca que o APM Silver utiliza para manter e 
    gerenciar o servidor web.
*/
const express = require('express');

const path = require('path'); //Biblioteca nativa do node para facilitar a navegação por caminhos de diretórios

const servidor = express(); // Aqui nós estamos criando a instância do nosso servidor web

let porta = 8080; //A porta em que o servidor vai rodar localmente (precisamos conversar com o professor Ivan sobre como configurar o nosso servidor para rodar num domínio)

servidor.use(express.static(path.join(__dirname, 'public'))); //Disponibilizando os arquivos css, png que as páginas precisam

/*
    !INICIO DO GERENCIADOR DE ROTAS!
*/

servidor.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});  

servidor.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});  

servidor.get('/membros', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/membros.html'));
});  

servidor.listen(porta, () => {
    console.log(`[Servidor]: Ei, eu estou rodando na porta ${porta}!`);
}); //E finalmente colocamos o nosso servidor web para rodar