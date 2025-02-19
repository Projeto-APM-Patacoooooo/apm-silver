/*
    Este código é o coração do nosso servidor, 
    então, por favor, rapazes, não saiam mexendo nele sem saber o que estão fazendo.

    Deixei tudo bem comentado caso queiram mudar alguma funcionalidade.

    E lembrem-se: não subam nada no GitHub antes de testar suas alterações!

    Seu amigo: Eduardo Bezerra
*/

require('dotenv').config(); // Carregando as variáveis do nosso arquivo .env (informações sensíveis)

const express = require('express'); //Importando express

const path = require('path'); //Biblioteca nativa do node para facilitar a navegação por caminhos de diretórios

const servidor = express(); // Aqui nós estamos criando a instância do nosso servidor web

let porta = 8080; //A porta em que o servidor vai rodar localmente (precisamos conversar com o professor Ivan sobre como configurar o nosso servidor para rodar num domínio)

servidor.use(express.static(path.join(__dirname, 'public'))); //Disponibilizando os arquivos css, png que as páginas precisam

servidor.set('view engine', 'ejs'); //Configurando nosso melhor amigo EJS
servidor.set('views', path.join(__dirname, 'views'));

/*
    !INICIO DO GERENCIADOR DE ROTAS!
*/
servidor.get('/', function(req, res){
    res.render('pages/index');
});

servidor.get('/login', function(req, res){
    res.render('pages/login');
});

servidor.get('/membros', function(req, res){
    res.render('pages/membros');
});

servidor.get('/relatorios', function(req, res){
    res.render('pages/relatorios');
});

servidor.get('/gerar-relatorios', function(req, res){
  res.render('pages/gerar_relatorios');
});

servidor.get('/porque-contriubir', function(req, res){
  res.render('pages/gerar_relatorios');
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