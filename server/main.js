/*
    Este código é o coração do nosso servidor, 
    então, por favor, rapazes, não saiam mexendo nele sem saber o que estão fazendo.

    Deixei tudo bem comentado caso queiram mudar alguma funcionalidade.

    E lembrem-se: não subam nada no GitHub antes de testar suas alterações!

    Seu amigo: Eduardo Bezerra
*/

require('dotenv').config(); // Carregando as variáveis do nosso arquivo .env (informações sensíveis)

const express = require('express'); //Importando express

const session = require("express-session"); //Biblioteca do express que server para guardar ssessões de login

const rateLimit = require('express-rate-limit'); //Biblioteca que serve para limitar requests feitas por um único usuário em determinado tempo

//Configurações do rate limit no nosso servidor
const limitador = rateLimit({
  windowMs: 60 * 1000, //1 minuto
  max: 1025, //Limite máximo requests por ip,
  message: 'Erro 429: Muitas requisições. Tente novamente em alguns minutos.'
}); 

const bcrypt = require("bcrypt"); //Nossa biblioteca de criptografia

// Simulação de um "banco de dados" de usuários
const users = [
  { id: 1, email: "admin@site.com", passwordHash: bcrypt.hashSync("admin", 10) }
];

const path = require('path'); //Biblioteca nativa do node para facilitar a navegação por caminhos de diretórios

const servidor = express(); // Aqui nós estamos criando a instância do nosso servidor web

let porta = 8080; //A porta em que o servidor vai rodar localmente (precisamos conversar com o professor Ivan sobre como configurar o nosso servidor para rodar num domínio)

servidor.use(express.static(path.join(__dirname, 'public'))); //Disponibilizando os arquivos css, png que as páginas precisam

servidor.set('view engine', 'ejs'); //Configurando nosso melhor amigo EJS
servidor.set('views', path.join(__dirname, 'views'));

servidor.use(limitador);

// funçao que verifica se o usuário está logado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login")
}

// Middleware para processar JSON e formulários
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.json());

// Configuração da sessão
servidor.use(session({
  secret: "chave-secreta", // Substitua por uma chave forte
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Use true apenas em HTTPS
}));

/*
    !INICIO DO GERENCIADOR DE ROTAS!
*/
servidor.get('/', function(req, res){
    res.render('pages/index');
});

servidor.get('/home',isAuthenticated, function(req, res){
  console.log(req.session.user)
  res.render('pages/home_adm', {
    emailLogado: req.session.user.email
  });
});

servidor.get('/login', function(req, res){
    res.render('pages/login');
});

servidor.get('/membros', function(req, res){
    res.render('pages/membros');
});

servidor.get('/relatorios', isAuthenticated, function(req, res){
    res.render('pages/relatorios');
});

servidor.get('/gerar-relatorios', isAuthenticated, function(req, res){
  res.render('pages/gerar_relatorios');
});

servidor.get('/por-que-contribuir', function(req, res){
  res.render('pages/porque-contribuir');
});

servidor.get('/porque-contriubir', function(req, res){
  res.render('pages/gerar_relatorios');
});

// Rota protegida (somente para usuários logados)
servidor.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Bem-vindo, ${req.session.user.email}!`);
});

//Rota para publicar o login
servidor.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    req.session.user = { id: user.id, email: user.email };
    res.redirect('/home')
  } else {
    res.status(401).send("Usuário ou senha incorretos.");
  }
});

// Rota de logout
servidor.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Erro ao fazer logout.");
    res.send("Logout realizado com sucesso.");
  });
});

/*
    !INICIO DA CONEXÃO SQL
*/
const mysql = require('mysql2'); //Importando biblioteca MYSQL2

// Cria a conexão com o banco de dados externo
const connection = mysql.createConnection({
  host: 'localhost', // Endereço do servidor externo
  user: 'root',       // Usuário do banco de dados
  password: process.env.PWD,     // Senha do banco de dados
  database: 'apm_silver',    // Nome do banco de dados
  port: 3306,                // Porta do banco de dados
  multipleStatements: true   // Permite executar múltiplos comandos SQL
});

//Faz com que seja possível buscar noticias especifícas
//Para testar use: "localhost:8080/noticia?id=1"
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

servidor.listen(porta, () => {
    console.log(`[Servidor]: Ei, eu estou rodando na porta ${porta}!`);
}); //E finalmente colocamos o nosso servidor web para rodar