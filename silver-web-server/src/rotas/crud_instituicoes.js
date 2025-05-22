function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {
    servidor.get('/dashboard/instituicoes/adicionar', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/adicionar_instituicao', {
            emailLogado: req.session.user.email
        });
    });

    servidor.post('/dashboard/instituicoes/editar', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        console.log(req.body)
        res.render('pages/editar_inst', {
            emailLogado: req.session.user.email
        });
    });

    servidor.get('/dashboard/instituicoes/editar', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);
        const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!noticiaId) {
          res.redirect('/dashboard/instituicoes')
        }
    
        const query = 'SELECT nome, cnpj, conta, agencia FROM instituicoes WHERE id = ?';
    
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

      servidor.get('/consultar/instiuicoes', callbackIsAuth, (req, res) => {

        const query = 'SELECT * FROM instituicoes';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar meta:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Nenhuma instituição cadastrada');
          }
    
          res.json(results); // Retorna a notícia em formato JSON
        });
      });
    
      servidor.put('/editar/instituicao/:id', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);
      
        const id = req.params.id;
        const { nome, cnpj, conta, agencia } = req.body;
      
        if (nome && cnpj && conta && agencia) {
          console.log('Valor do ID: ' + id);
      
          const query = `UPDATE instituicoes SET nome = ?, cnpj = ?, conta = ?, agencia = ? WHERE id = ?`;
          const values = [nome, cnpj, Number(conta), Number(agencia), Number(id)];
      
          connection.query(query, values, (err, results) => {
            if (err) {
              console.error('Erro ao editar instituição', err);
              return res.status(500).send('Erro interno no servidor');
            }
            res.redirect("/dashboard/instituicoes");
          });
      
        } else {
          return res.status(400).send("[400]<br><hr><br>Bad Request!");
        }
      });
      
      servidor.post('/cadastrar/instituicao', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);

        console.log(Number(req.body.conta))
        if(req.body.nome && req.body.cnpj && req.body.conta  && req.body.agencia){
           const query = `insert into instituicoes(nome, cnpj, conta, agencia) values("${req.body.nome}",  "${req.body.cnpj}", ${Number(req.body.conta)}, ${Number(req.body.agencia)})`

           connection.query(query, (err, results) => {
            if (err) {
              console.error('Erro ao cadastrar insituicao', err);
              return res.status(500).send('Erro interno no servidor');
            }
            res.redirect("/dashboard/instituicoes")
          });
        }else {
          return res.status(400).send("[400]<br><hr><br>Bad Request!")
        }
      })
    
      //Faz com que seja possível buscar as 3 metas em destaque
      //Para testar use: "localhost:8080/excluir/instituicao?id=1"
      servidor.post('/excluir/instituicao', callbackIsAuth, (req, res) => {
    
        const instituicaoId = req.body.id; // Pega o parâmetro ?id= do navegador
        console.log("Nova solicitação de exclusão de instituição: id: " + instituicaoId)
    
        if (!instituicaoId) {
          return res.status(400).send('ID do destaque é obrigatório');
        }
    
        const query = 'DELETE FROM instituicoes WHERE id = ?';
    
        connection.query(query,  [instituicaoId], (err, results) => {
          if (err) {
            console.error('Erro ao excluir instituição:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('A instituição não existe!');
          }
    
          res.redirect("/dashboard/instituicoes")
        });
      })
}

module.exports = {
    rotear
}