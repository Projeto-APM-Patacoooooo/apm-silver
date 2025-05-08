function rotear(servidor, callbackVerificarMan){
    servidor.get('/membros', function (req, res) {
        callbackVerificarMan(res);
        if(req.session.user){
          res.render('pages/membros', {logado: true, emailLogado: req.session.user.email})
        } else {
          res.render('pages/membros',  {logado: false});
        }
      });
}

module.exports = {
    rotear
}