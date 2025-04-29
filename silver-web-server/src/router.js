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

    servidor.get('/', function (req, res) {
        res.render('pages/index', { cliente_logado: false });
    });

    servidor.get('/home', isAuthenticated, function (req, res) {
        console.log(req.session.user)
        res.render('pages/home_adm', {
            emailLogado: req.session.user.email
        });
    });

    servidor.get('/login', function (req, res) {
        res.render('pages/login');
    });

    servidor.get('/membros', function (req, res) {
        res.render('pages/membros');
    });

    servidor.get('/politica-de-privacidade', function (req, res) {
        res.render('pages/politica-de-privacidade')
    });

    servidor.get('/relatorios', isAuthenticated, function (req, res) {
        res.render('pages/relatorios');
    });

    servidor.get('/gerar-relatorios', isAuthenticated, function (req, res) {
        res.render('pages/gerar_relatorios');
    });

    servidor.get('/por-que-contribuir', function (req, res) {
        res.render('pages/porque-contribuir');
    });

    servidor.get('/porque-contriubir', function (req, res) {
        res.render('pages/gerar_relatorios');
    });

    // Rota protegida (somente para usuários logados)
    servidor.get("/dashboard", isAuthenticated, (req, res) => {
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
    
        res.render('pages/visualizador-noticias',  {titulo, conteudo, data_publi}); // Retorna a notícia em formato JSON
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
    console.log("[Servidor]: Rotas de POST/GET configuradas.")
    console.log("[Servidor]: Router configurado.")
}

module.exports = {
    Router
}