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

    servidor.get('/vertudo/noticias', (req, res) => {
      if(req.session.user){
        res.render('pages/vertudo_noticias', {logado: true, emailLogado: req.session.user.email})
      } else {
        res.render('pages/vertudo_noticias',  {logado: false});
      }
    })

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
      servidor.get('/noticias_recentes', (req, res) => {
    
        const query = 'SELECT * FROM noticias ORDER BY data_publicacao DESC LIMIT 3';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar destaque:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          res.json(results); // Retorna a notícia em formato JSON
        });
      });

      servidor.get('/noticia/tudo', (req, res) => {
        const query = 'SELECT * FROM noticias ORDER BY data_publicacao desc limit 300';
    
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

      servidor.post('/cadastrar/noticia', callbackIsAuth, (req, res) => {
        if(req.body.titulo && req.body.conteudo){
          const query = `insert into noticias(titulo_noticia, conteudo, data_publicacao, data_edicao) values("${req.body.titulo}", "${req.body.conteudo}", now(), now())`
          
          connection.query(query, (err, results) => {
            if (err) {
              console.error('Erro ao postar noticia', err);
              return res.status(500).send('Erro interno no servidor');
            }
            res.redirect("/dashboard/noticias")
          });

        }
        
      });

      servidor.post('/excluir/noticia', callbackIsAuth, (req, res) => {
    
        const instituicaoId = req.body.id; // Pega o parâmetro ?id= do navegador
        console.log("Nova solicitação de exclusão de instituição: id: " + instituicaoId)
    
        if (!instituicaoId) {
          return res.status(400).send('ID do destaque é obrigatório');
        }
    
        const query = 'DELETE FROM noticias WHERE id_noticia = ?';
    
        connection.query(query,  [instituicaoId], (err, results) => {
          if (err) {
            console.error('Erro ao excluir noticia:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('A noticia não existe!');
          }
    
          res.redirect("/dashboard/noticias")
        });
      });

      servidor.put('/editar/noticia', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);
      
        const id = req.query.id;
        const { titulo, conteudo } = req.body;
      
        if (titulo && conteudo) {
          console.log('Valor do ID: ' + id);

          const query = `UPDATE noticias SET titulo_noticia = ?, conteudo = ?, data_edicao = now() WHERE id_noticia = ?`;
          const values = [titulo, conteudo, Number(id)];
      
          connection.query(query, values, (err, results) => {
            if (err) {
              console.error('Erro ao editar noticia', err);
              return res.status(500).send('Erro interno no servidor');
            }

          });
      
        } else {
          return res.status(400).send("[400]<br><hr><br>Bad Request!");
        }
      });

      servidor.get('/dashboard/noticias/editar', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);
        const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!noticiaId) {
          res.redirect('/dashboard/noticias')
        }
    
        console.log(noticiaId)
        const query =`SELECT * FROM noticias WHERE id_noticia = ${Number(req.query.id)}`;
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar notícia:', err);
            return
          }
    
          if (results.length === 0) {
            console.log("results: " + results)
            console.error("[Erro um pouco preocupante]: Não foi possível encontrar uma notícia para editar. Mas ela deveria existir já que o usuário clicou no botão dela na página de dashboard?")
            return;
          }
    
          
          var titulo_noticia = results[0].titulo_noticia;
          var conteudo = results[0].conteudo;

          res.render('pages/editar_noticia', { id: req.query.id, titulo_noticia, conteudo, emailLogado: req.session.user.email }); // Retorna a notícia em formato JSON
        });
      });
}

module.exports = {
    rotear
}