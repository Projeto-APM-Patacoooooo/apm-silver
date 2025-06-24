function rotear(servidor, callbackVerificarMan, callbackIsAuth) {
    servidor.get('/relatorios', function (req, res) {
        callbackVerificarMan(res);
        if(req.session.user){
          res.render('pages/relatorios', {logado: true, emailLogado: req.session.user.email})
        } else {
          res.render('pages/relatorios',  {logado: false});
        }
    });
    servidor.get('/gerar-relatorios', callbackIsAuth, function (req, res) {
        verificarManutencao(res);
        res.render('pages/gerar_relatorios');
      });
}

module.exports = {
    rotear
}