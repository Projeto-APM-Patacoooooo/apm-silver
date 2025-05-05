const { GerarNovaChave } = require("./chaves.js");

function Configuar(servidor){
  const bcrypt = require("bcrypt");

  console.warn("[Servidor]: Configurando rotas de login...") 

  // Simulação de uma tabela no banco de dados
  const users = [
    { id: 1, email: "admin@site.com", passwordHash: bcrypt.hashSync("admin", 10) }
  ];

  //Rota para publicar o login
    servidor.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email);

      if (user && await bcrypt.compare(password, user.passwordHash)) {
        req.session.user = { id: user.id, email: user.email, chave: GerarNovaChave() };
        res.redirect('/dashboard')
      } else {
        res.render('pages/login-erro');
      }
    });
    
    // Rota de logout
    servidor.post("/logout", (req, res) => {
      req.session.destroy(err => {
        if (err) return res.status(500).send("Erro ao fazer logout.");
        res.send("Logout realizado com sucesso.");
      });
    });

    console.log("[Servidor]: Rotas de login configuradas.")
}

module.exports = {
    Configuar
}