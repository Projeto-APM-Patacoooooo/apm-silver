function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection){
    servidor.get('/dashboard', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/home_adm', {
          emailLogado: req.session.user.emailLogado,
        });
      });

      servidor.get('/dashboard/instituicoes', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/instituicoes', {
          emailLogado: req.session.user.email,
          chave: req.session.user.chave
        });
      });

      servidor.get('/dashboard/noticias', callbackIsAuth, function(req, res) {
        callbackVerificarMan(res);
        res.render('pages/noticias', {
          emailLogado: req.session.user.email,
          chave: req.session.user.chave
        });
      });

      servidor.get('/dashboard/noticias/adicionar', callbackIsAuth, (req, res) => {
        res.render('pages/adicionar_noti', {
          emailLogado: req.session.user.email,
  
        });
      });
}

module.exports = {
    rotear
}