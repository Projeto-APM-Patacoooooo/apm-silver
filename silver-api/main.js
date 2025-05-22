console.warn("[API]: Iniciando...");

let porta = 8081;

//Importando biblioteca estrangeiras
require('dotenv').config();
const express = require('express');
const session = require("express-session");
const rateLimit = require('express-rate-limit');
const path = require('path');

//Configurando rate limit (contra ataques DoS de nerds zé ruelas)
const limitador = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    message: 'Erro 429: Muitas requisições no servidor. Tente novamente em alguns minutos.'
});

//Criando e configurando nosso servidor
const api = express();
api.use(express.static(path.join(__dirname, 'public')));
api.use(express.urlencoded({ extended: true }));
api.use(express.json());
api.use(limitador);

api.get('/', function (req, res) {
    res.send("Ei! Você não deveria estar aqui. \n Eu sou só uma API solitária que trabalha com dados :[")
});

api.get('/ping', function (req, res) {
  res.status(200).send("Ok")
});


api.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

//Colocando essa bagaça para rodar
api.listen(porta, () => {
  console.log(`\n\n\n\n====================================================================\nSILVER API V1.0\n====================================================================\nFeito com ❤️  para a Etec Ermelinda \nRodando na porta ${porta} \nCom o enderenço de IP: N/A \n `);
});