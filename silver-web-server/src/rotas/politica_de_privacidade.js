function rotear(servidor, callbackVerificarMan) {
    servidor.get('/politica-de-privacidade', function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/politica-de-privacidade')
    });
}

module.exports = {
    rotear
}