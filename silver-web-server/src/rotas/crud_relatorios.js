function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {
    servidor.get('/dashboard/relatorios/adicionar', callbackIsAuth, function (req, res) {
        callbackVerificarMan(res);
        res.render('pages/adicionar_relatorio', {
            emailLogado: req.session.user.email
        });
    });

    servidor.post('/cadastrar/relatorio', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);

        if (req.body.mes && req.body.ano && req.body.instituicao) {

            console.log(`Recebendo dados de requisição de cadastro de relatório: \n MÊS: ${req.body.mes} \n ANO: ${req.body.ano} \n INSTITUIÇÃO: ${req.body.instituicao}`)

            const query1 = 'select id from instituicoes where nome = ?'

            connection.query(query1, [req.body.instituicao], (err, results) => {
                if (err) {
                    console.log('Erro ao cadastrar relatório', err);
                    return res.status(500).send('Erro interno no servidor')
                }

                query2 = `insert into relatorios(instituicao, mes, ano, ultima_edicao, data_cricacao, saldo_anterior) values(${results[0].id}, "${req.body.mes}", ${req.body.ano}, now(), now(), 00)`

                connection.query(query2, [req.body.instituicao], (err, results) => {
                    if (err) {
                        console.log('Erro ao cadastrar relatório', err);
                        return res.status(500).send('Erro interno no servidor')
                    }


                    res.redirect('/dashboard/relatorios')
                });
            });

        } else {
            return res.status(400).send("[400]<br><hr><br>Bad Request!")
        }
    })

    servidor.get('/consultar/relatorios', callbackIsAuth, (req, res) => {

        const query = 'SELECT * FROM relatorios';
    
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Erro ao buscar relatório: ', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('Este relatório tomou doril e sumiu');
          }
    
          res.json(results); // Retorna a notícia em formato JSON
        });
    });

    servidor.post('/excluir/relatorio', callbackIsAuth, (req, res) => {
    
        const instituicaoId = req.body.id; // Pega o parâmetro ?id= do navegador
        console.log("Nova solicitação de exclusão de relatório: id: " + instituicaoId)
    
        if (!instituicaoId) {
          return res.status(400).send('ID do relatório é obrigatório');
        }
    
        const query = 'DELETE FROM relatorios WHERE id = ?';
    
        connection.query(query,  [instituicaoId], (err, results) => {
          if (err) {
            console.error('Erro ao excluir relatório:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('O relatório não existe!');
          }
    
          res.redirect("/dashboard/relatorios")
        });
      });

      servidor.post('/excluir/relatorio', callbackIsAuth, (req, res) => {
    
        const instituicaoId = req.body.id; // Pega o parâmetro ?id= do navegador
        console.log("Nova solicitação de exclusão de relatório: id: " + instituicaoId)
    
        if (!instituicaoId) {
          return res.status(400).send('ID do relatório é obrigatório');
        }
    
        const query = 'DELETE FROM relatorios WHERE id = ?';
    
        connection.query(query,  [instituicaoId], (err, results) => {
          if (err) {
            console.error('Erro ao excluir relatório:', err);
            return res.status(500).send('Erro interno no servidor');
          }
    
          if (results.length === 0) {
            return res.status(404).send('O relatório não existe!');
          }
    
          res.redirect("/dashboard/relatorios")
        });
      });

      servidor.get('/dashboard/relatorios/editar', callbackIsAuth, (req, res) => {
        callbackVerificarMan(res);
        const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador
    
        if (!noticiaId) {
          res.redirect('/dashboard/relatorios')
        }
    
        const query = 'SELECT * FROM relatorios WHERE id = ?';
    
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

          var mes = results[0].mes;
          var ano = results[0].ano; 
          var instituicao = results[0].instituicao;

          res.render('pages/editar_relatorio', { mes, ano, instituicao, emailLogado: req.session.user.email});
        });
      });


}

module.exports = {
    rotear
}