function rotear(servidor, callbackVerificarMan, callbackIsAuth){
    servidor.get('/', function (req, res) {
        callbackVerificarMan(res);
        if(req.session.user){
          res.render('pages/index', {logado: true, emailLogado: req.session.user.email})
        } else {
          res.render('pages/index',  {logado: false});
        }
    });
}

module.exports = {
    rotear
}