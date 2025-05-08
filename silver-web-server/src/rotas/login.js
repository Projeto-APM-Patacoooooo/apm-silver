function rotear(servidor, callbackVerificarMan){
    servidor.get('/login', function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/login');
    });
}

module.exports = {
    rotear
}