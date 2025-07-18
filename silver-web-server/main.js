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

//Criando e configurando nosso servidor
const servidor = express();
servidor.use(express.static(path.join(__dirname, 'public')));
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.json());
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
sessaoLogin.Configuar(servidor, router.connection);
teclasMagicas.TeclasMagicas(router.mudarModoDeManutencao);

//Colocando essa bagaça para rodar
servidor.listen(porta, '0.0.0.0', () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const enderecos = [];

  for (let nome in interfaces) {
    for (let iface of interfaces[nome]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        enderecos.push(iface.address);
      }
    }
  }

  console.log(`\n\n\n\n====================================================================\nSERVIDOR ZICA PARA O APM SILVER V1.5\n====================================================================\nFeito com ❤️  para a Etec Ermelinda \nRodando na porta ${porta} \nCom o endereço de IP: ${enderecos.join(', ')} \n `);
});