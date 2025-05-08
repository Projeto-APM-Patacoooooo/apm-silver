function rotear(servidor, callbackVerificarMan, callbackIsAuth) {
    servidor.get('/por-que-contribuir', function (req, res) {
        callbackVerificarMan(res);
        if(req.session.user){
          res.render('pages/porque-contribuir', {logado: true, emailLogado: req.session.user.email})
        } else {
          res.render('pages/porque-contribuir',  {logado: false});
        }
      });
}

module.exports = {
    rotear
}