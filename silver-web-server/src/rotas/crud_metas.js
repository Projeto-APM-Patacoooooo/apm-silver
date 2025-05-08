function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {

    servidor.get('/meta', (req, res) => {
        const metaId = req.query.id; // Pega o parâmetro ?id= do navegador

        if (!metaId) {
            return res.status(400).send('ID da meta é obrigatório');
        }

        const query = 'SELECT * FROM metas WHERE id_meta = ?';

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

    servidor.get('/dest_meta', (req, res) => {
        const destaqueId = req.query.id; // Pega o parâmetro ?id= do navegador

        if (!destaqueId) {
            return res.status(400).send('ID do destaque é obrigatório');
        }

        const query = 'SELECT * FROM metas_destaque WHERE id_metades = ?';

        connection.query(query, [destaqueId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar destaque:', err);
                return res.status(500).send('Erro interno no servidor');
            }

            if (results.length === 0) {
                return res.status(404).send('Destaque não encontrado');
            }

            res.json(results[0]); // Retorna a notícia em formato JSON
        });
    });
}

module.exports = {
    rotear
}