const express = require("express");

let manutencao = false;

function mudarModoDeManutencao(valor){
  manutencao = valor;
}

function verificarManutencao(res){
  switch (manutencao) {
    case true:
      res.render('pages/manutencao');
    return; 
  }
}

//Script que controla cada rota dentro do nosso website
function Router(servidor) {
  console.warn("[Servidor]: Iniciando Router...")


  const connection = require("./conexao_bd").Iniciar();
  // funçao que verifica se o usuário está logado
  function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect("/login")
  }

  /*
      Aqui se inicia uma lista extensa de rotas e o destino que elas levam
  */

  const inicio = require("./rotas/inicio.js")
  inicio.rotear(servidor, verificarManutencao, isAuthenticated);
  
  const dashboard = require("./rotas/dashboard.js");
  dashboard.rotear(servidor, verificarManutencao, isAuthenticated);

  servidor.get('/dashboard/instituicoes', isAuthenticated, function (req, res) {
    verificarManutencao(res);
    res.render('pages/instituicoes', {
      emailLogado: req.session.user.email,
      chave: req.session.user.chave
    });
  });

  servidor.get('/dashboard/instituicoes/adicionar', isAuthenticated, function (req, res) {
    verificarManutencao(res);
    res.render('pages/adicionar_instituicao', {
      emailLogado: req.session.user.email
    });
  });

  servidor.get('/login', function (req, res) {
    verificarManutencao(res);
    res.render('pages/login');
  });

  servidor.get('/membros', function (req, res) {
    verificarManutencao(res);
    if(req.session.user){
      res.render('pages/membros', {logado: true, emailLogado: req.session.user.email})
    } else {
      res.render('pages/membros',  {logado: false});
    }
  });

  servidor.get('/politica-de-privacidade', function (req, res) {
    verificarManutencao(res);
    res.render('pages/politica-de-privacidade')
  });

  servidor.get('/relatorios', isAuthenticated, function (req, res) {
    verificarManutencao(res);
    res.render('pages/relatorios');
  });

  servidor.get('/gerar-relatorios', isAuthenticated, function (req, res) {
    verificarManutencao(res);
    res.render('pages/gerar_relatorios');
  });

  servidor.get('/por-que-contribuir', function (req, res) {
    verificarManutencao(res);
    if(req.session.user){
      res.render('pages/porque-contribuir', {logado: true, emailLogado: req.session.user.email})
    } else {
      res.render('pages/porque-contribuir',  {logado: false});
    }
  });

  // Rota protegida (somente para usuários logados)
  servidor.get("/dashboard", isAuthenticated, (req, res) => {
    verificarManutencao(res);
    res.send(`Bem-vindo, ${req.session.user.email}!`);
  });

  console.log("[Servidor]: Rotas comuns configuradas.")

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

  servidor.get('/dashboard/instituicoes/editar', isAuthenticated, (req, res) => {
    verificarManutencao(res);
    const noticiaId = req.query.id; // Pega o parâmetro ?id= do navegador

    if (!noticiaId) {
      res.redirect('/dashboard/instituicoes')
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

      res.render('pages/editar_instituicao', { nome, cnpj, conta, agencia, emailLogado: req.session.user.email }); // Retorna a notícia em formato JSON
    });
  });

  //Retorna todas as noticias do banco de dados em formato JSON
  //Para testar use: "localhost:8080/noticia/tudo
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

  //Faz com que seja visualizar buscar noticias especifícas
  //Para testar use: "localhost:8080/ver/noticia?id=1"

  servidor.get('/ver/noticia', (req, res) => {
    verificarManutencao(res);
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

  //Faz com que seja possível buscar staffs especifícos
  //Para testar use: "localhost:8080/staff?id=1"
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

  //Faz com que seja possível buscar metas especifícas
  //Para testar use: "localhost:8080/meta?id=1"
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

  //Faz com que seja possível buscar as 3 metas em destaque
  //Para testar use: "localhost:8080/dest_meta?id=1"
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

  servidor.get('/noticia', (req, res) => {
    const query = `insert into noticias(titulo_noticia, conteudo, data_publicacao, id_staff) values("${req.body.titulo}", "${req.body.conteudo}", "${req.body.data}", 1)`;

    connection.query(query, (err) => {
      if (err) {
        console.error('Erro ao buscar destaque:', err);
        return res.status(500).send('Erro interno no servidor');
      }
    });
  });

  //Faz com que seja possível buscar todas as instituicoes cadastradas
  //Para testar use: "localhost:8080/consultar/instiuicoes"
  servidor.get('/consultar/instiuicoes', isAuthenticated, (req, res) => {

    const query = 'SELECT * FROM instituicao';

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

  servidor.post('/cadastrar/instituicao', isAuthenticated, (req, res) => {
    verificarManutencao(res);
    console.log(req.body)
    console.log(Number(req.body.conta))
    if(req.body.nome && req.body.cnpj && req.body.conta  && req.body.agencia){
       const query = `insert into instituicao(nome, cnpj, conta, agencia) values("${req.body.nome}",  "${req.body.cnpj}", ${Number(req.body.conta)}, ${Number(req.body.agencia)})`
       console.log(query)
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
  servidor.post('/excluir/instituicao', isAuthenticated, (req, res) => {

    const instituicaoId = req.body.id; // Pega o parâmetro ?id= do navegador
    console.log("Nova solicitação de exclusão de instituição: id: " + instituicaoId)

    if (!instituicaoId) {
      return res.status(400).send('ID do destaque é obrigatório');
    }

    const query = 'DELETE FROM instituicao WHERE id = ?';

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
  });
  servidor.get('*', function(req, res){
    res.status(404).render('pages/404');
  });
  console.log("[Servidor]: Rotas de POST/GET configuradas.")
  console.log("[Servidor]: Router configurado.")
}

module.exports = {
  Router,
  mudarModoDeManutencao
}