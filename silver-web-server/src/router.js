const express = require("express");

let manutencao = false;

function mudarModoDeManutencao(valor){
  manutencao = valor;
}

function verificarManutencao(res){
  switch (manutencao) {
    case true:
      res.render('pages/manutencao');
    return; 
  }
}

function Router(servidor) {
  console.warn("[Servidor]: Iniciando Router...")

  const connection = require("./conexao_bd").Iniciar();

  const verificarLogin = require("./utilidades/verificar_login.js");

  const inicio = require("./rotas/inicio.js");
  inicio.rotear(servidor, verificarManutencao, verificarLogin.verificar);

  const login = require("./rotas/login.js")
  login.rotear(servidor, verificarManutencao)
  
  const membros = require("./rotas/membros.js");
  membros.rotear(servidor, verificarManutencao, verificarLogin.verificar);

  const politica_de_privacidade = require("./rotas/politica_de_privacidade.js");
  politica_de_privacidade.rotear(servidor, verificarManutencao)

  const dashboard = require("./rotas/dashboard.js");
  dashboard.rotear(servidor, verificarManutencao, verificarLogin.verificar);

  const por_que_contribuir = require("./rotas/por_que_contribuir_.js");
  por_que_contribuir.rotear(servidor, verificarManutencao, verificarLogin.verificar);

  const relatorios = require("./rotas/relatorios.js");
  relatorios.rotear(servidor, verificarManutencao, verificarLogin.verificar);

  const crud_noticia = require("./rotas/crud_noticia.js");
  crud_noticia.rotear(servidor, verificarManutencao, verificarLogin.verificar, connection);

  const crud_dashboard = require("./rotas/crud_instituicoes.js");
  crud_dashboard.rotear(servidor, verificarManutencao, verificarLogin.verificar, connection);
  
  const crud_instituicoes = require("./rotas/crud_instituicoes.js");
  crud_instituicoes.rotear(servidor, verificarManutencao, verificarLogin.verificar, connection);

  const crud_metas = require("./rotas/crud_metas.js");
  crud_metas.rotear(servidor, verificarManutencao, verificarLogin.verificar, connection);

  const crud_staff = require("./rotas/crud_staff.js");
  crud_staff.rotear(servidor, verificarManutencao, verificarLogin.verificar, connection);

  //Página 404
  servidor.get('*', function(req, res){
    res.status(404).render('pages/404');
  });

  console.log("[Servidor]: Router configurado.")
}

module.exports = {
  Router,
  mudarModoDeManutencao
}