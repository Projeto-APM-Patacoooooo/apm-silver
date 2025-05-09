function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {
    servidor.get('/noticia', (req, res) => {
        const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!noticiaId) {
          return res.status(400).send('ID da notícia é obrigatório');
        }
    
        const query = 'SELECT * FROM noticias WHERE id_noticia = ?';
    
        connection.query(query, [noticiaId], (err, results) => {
          if (err) {
            console.error('Erro ao buscar notícia:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Notícia não encontrada');
          }
    
          res.json(results[0]); // Retorna a notícia em formato JSON
        });
    });

    servidor.get('/ver/noticia', (req, res) => {
       callbackVerificarMan(res);
        const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!noticiaId) {
          return res.status(400).send('ID da notícia é obrigatório');
        }
    
        const query = 'SELECT * FROM noticias WHERE id_noticia = ?';
    
        connection.query(query, [noticiaId], (err, results) => {
          if (err) {
            console.error('Erro ao buscar notícia:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Notícia não encontrada');
          }
    
    
          let titulo = results[0].titulo_noticia;
          let conteudo = results[0].conteudo;
    
          let data_publi = JSON.stringify(results[0].data_publicacao).substring(1, 11);
    
          res.render('pages/visualizador-noticias', { titulo, conteudo, data_publi }); // Retorna a notícia em formato JSON
        });
      });
    
      //Faz com que seja possível buscar as três primeiras noticias em destaque
      //Para testar use: "localhost:8080/dest_noticia?id=1"
      servidor.get('/dest_noticia', (req, res) => {
        const destaqueId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!destaqueId) {
          return res.status(400).send('ID do destaque é obrigatório');
        }
    
        const query = 'SELECT * FROM noticias_destaque WHERE id_destaque = ?';
    
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

      servidor.get('/noticia/tudo', (req, res) => {
        const query = 'SELECT * FROM noticias';
    
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

      servidor.get('/consultar/noticias', callbackIsAuth, (req, res) => {
        const query = 'SELECT * FROM noticias';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar meta:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Nenhuma noticia cadastrada');
          }
    
          res.json(results); // Retorna a notícia em formato JSON
        });
      });
}

module.exports = {
    rotear
}