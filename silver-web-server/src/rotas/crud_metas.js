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

      servidor.get('/dashboard/metas/adicionar', (req, res) => {
        res.render('pages/adicionar_meta', {emailLogado: req.session.user.email})
      });

      servidor.post('/cadastrar/meta', callbackIsAuth, (req, res) => {
        
        var dadosRecebidos = req.body;

        if(!dadosRecebidos){
          res.status(500);
          return;
        }

        const query = 'insert into metas(titulo_meta, data_meta, id_staff) values(?, ?, 1)';

        var hoje = new Date();
        var dia = hoje.getDate();
        var mes = hoje.getMonth() + 1;
        var ano = hoje.getFullYear()
        var dataFinal = `${ano}-${mes}-${dia}`;

        connection.query(query, [req.body.meta, dataFinal], (err, results) => {

          if(err){
            console.error("Erro ao cadastrar meta: " + err);
            return res.status(500).send('Erro interno no servidor');
          }

          res.redirect("/dashboard/metas");
        })
      });

      servidor.post('/excluir/meta', callbackIsAuth, (req, res) => {
    
        const metaId = req.body.id; // Pega o parâmetro ?id= do navegador
    
        if (!metaId) {
          return res.status(400).send('ID da meta é obrigatório');
        }
    
        const query = 'DELETE FROM metas WHERE id_meta = ?';
    
        connection.query(query,  [metaId], (err, results) => {
          if (err) {
            console.error('Erro ao excluir meta:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('A meta não existe!');
          }
    
          res.redirect("/dashboard/metas");
        });
      })

      servidor.get('/metas_recentes', (req, res) => {
    
        const query = 'SELECT * FROM metas ORDER BY data_meta DESC LIMIT 3';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar meta recentes:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          res.json(results); 
        });
      });

      servidor.get('/dashboard/metas/editar', callbackIsAuth, (req, res) => {
        var idMeta = req.query.id;

        if(!idMeta){
          return res.status(400).send("Você precisa fornecer um id de notícia para editar")
        }

        const query = 'select * from metas where id_meta = ?';

        connection.query(query, [idMeta], (err, results) => {
          
          if(results.length < 1){
            return res.status(404).send("Não foi possível encontrar uma meta com id " + idMeta);
          }

          var titulo = results[0].titulo_meta;
          var batida = results[0].batida;

          switch (batida) {
            case 1:
              batida = true;
            break;

            case 0:
              batida = false;
            break;
          }
        
          res.render('pages/editar_metas.ejs', {emailLogado: req.session.user.email, batida, titulo});
        })
      })
}

module.exports = {
    rotear
}