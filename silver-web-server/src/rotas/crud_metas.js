function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {

    servidor.get('/meta', (req, res) => {
        const metaId = req.query.id; // Pega o parâmetro ?id= do navegador

        if (!metaId) {
            return res.status(400).send('ID da meta é obrigatório');
        }

        const query = 'SELECT * FROM metas WHERE id_meta = ? limit 3';

        connection.query(query, [metaId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar meta:', err);
                return res.status(500).send('Erro interno no servidor');
            }

            if (results.length === 0) {
                return res.status(404).send('Meta não encontrada');
            }

            res.json(results[0]); // Retorna a notícia em formato JSON
        });
    });

    servidor.get('/metas/tudo', (req, res) => {
        const query = 'SELECT * FROM metas';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar notícia:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Notícia não encontrada');
          }
    
          res.json(results); // Retorna a notícia em formato JSON
        });
      });


}

module.exports = {
    rotear
}