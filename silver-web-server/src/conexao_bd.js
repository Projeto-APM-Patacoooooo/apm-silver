function Iniciar(){
    console.warn("[Servidor]: Conectando ao banco de dados...");
    const mysql = require('mysql2');
    
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.PWD,
      database: 'apm_silver',
      port: 3306,
      multipleStatements: true
    });

    console.log("[Servidor]: Conexão com banco de dados estabelecida.");
    return connection;
}

module.exports = {
    Iniciar
}