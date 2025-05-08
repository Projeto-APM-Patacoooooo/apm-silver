function rotear(servidor, callbackVerificarMan, callbackIsAuth) {
    servidor.get('/relatorios', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/relatorios');
    });
    servidor.get('/gerar-relatorios', callbackIsAuth, function (req, res) {
        verificarManutencao(res);
        res.render('pages/gerar_relatorios');
      });
}

module.exports = {
    rotear
}