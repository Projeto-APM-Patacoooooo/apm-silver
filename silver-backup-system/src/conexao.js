require('dotenv').config();
const mysql = require('mysql2');

function novaConexao(){
    console.warn("[Backup]: Iniciando conexão com banco de dados...")

    const conexaoSql = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.PWD,
        database: 'apm_silver',
        port: 3306,
        multipleStatements: true
    });

    console.log("[Backup]: Nova conexão com banco de dados criada")
    return conexaoSql;
}

module.exports ={
    novaConexao
}