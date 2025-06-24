function rotear(servidor, callbackVerificarMan) {
    servidor.get('/politica-de-privacidade', function (req, res) {
        callbackVerificarMan(res);
        if(req.session.user){
            res.render('pages/politica-de-privacidade', {logado: true, emailLogado: req.session.user.email})
        } else {
            res.render('pages/politica-de-privacidade',  {logado: false});
        }
    });
}

module.exports = {
    rotear
}