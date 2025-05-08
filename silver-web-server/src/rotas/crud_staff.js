function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {
    servidor.get('/staff', (req, res) => {
        const staffId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!staffId) {
          return res.status(400).send('ID do staff é obrigatório');
        }
    
        const query = 'SELECT nome, email, cargo FROM staffs WHERE id_staff = ?';
    
        connection.query(query, [staffId], (err, results) => {
          if (err) {
            console.error('Erro ao buscar staff:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Staff não encontrado');
          }
    
          res.json(results[0]); // Retorna a notícia em formato JSON
        });
    });
}

module.exports = {
    rotear
}