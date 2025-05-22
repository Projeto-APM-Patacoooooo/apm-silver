let entregues = 0;

function IniciarEntregas(api){
    api.get('/cdn/img/get', (req, res) => {
        callbackVerificarMan(res);
        const IdImagem = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!IdImagem) {
          res.status(404).send("<header>404</header><br><hr><p>Não foi possível localizar este arquivo.</p>")
        }
    
        const query = 'SELECT nome, cnpj, conta, agencia FROM instituicao WHERE id = ?';
    
        connection.query(query, [noticiaId], (err, results) => {
          if (err) {
            console.error('Erro ao buscar notícia:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            console.log("results: " + results)
            console.error("[Erro um pouco preocupante]: Não foi possível encontrar uma notícia para editar. Mas ela deveria existir já que o usuário clicou no botão dela na página de dashboard?")
            return;
          }
    
          var nome = results[0].nome;
          var cnpj = results[0].cnpj;
          var conta = results[0].conta;
          var agencia = results[0].agencia;
          
          res.render('pages/editar_instituicao', { id: req.query.id, nome, cnpj, conta, agencia, emailLogado: req.session.user.email }); // Retorna a notícia em formato JSON
        });
      });
    
}

module.exports = {
    IniciarEntregas
}