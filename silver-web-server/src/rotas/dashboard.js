function rotear(servidor, callbackVerificarMan, callbackIsAuth){
    servidor.get('/dashboard', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/home_adm', {
          emailLogado: req.session.user.emailLogado,
        });
      });
}

module.exports = {
    rotear
}