//Limpando console para não confudirmos logs antigos com logs atuais
console.clear();

console.warn("[Servidor]: Iniciando...");

let porta = 8080;

//Importando biblioteca estrangeiras
require('dotenv').config();
const express = require('express');
const session = require("express-session");
const rateLimit = require('express-rate-limit');
const path = require('path');

//Importando bibliotecas caseiras
const router = require('./src/router.js');
const sessaoLogin = require('./src/sessao_login.js');
const teclasMagicas = require('./src/teclas_magicas.js');

//Configurando rate limit (contra ataques DoS de nerds zé ruelas)
const limitador = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    message: 'Erro 429: Muitas requisições no servidor. Tente novamente em alguns minutos.'
});

//Criando e configurando nosso servidor
const servidor = express();
servidor.use(express.static(path.join(__dirname, 'public')));
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.json());
servidor.use(limitador);
servidor.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

//Usando EJS como rendering engine do nosso servidor
servidor.set('view engine', 'ejs');
servidor.set('views', path.join(__dirname, 'views'));

//Iniciando bibliotecas caseiras
router.Router(servidor);
sessaoLogin.Configuar(servidor);
teclasMagicas.TeclasMagicas(router.mudarModoDeManutencao);

//Colocando essa bagaça para rodar
servidor.listen(porta, () => {
  console.log(`\n\n\n\n====================================================================\nSERVIDOR ZICA PARA O APM SILVER V1.5\n====================================================================\nFeito com ❤️  para a Etec Ermelinda \nRodando na porta ${porta} \nCom o enderenço de IP: N/A \n `);
});