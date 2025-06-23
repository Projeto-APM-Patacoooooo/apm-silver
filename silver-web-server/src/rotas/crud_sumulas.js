const fs = require("fs");
const path = require("path");

function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {
    servidor.get('/dashboard/sumulas/upload', callbackIsAuth, (req, res) => {
        res.render("pages/upload_sumula.ejs", {
            emailLogado: req.session.user.email,
            chave: req.session.user.chave
        });
    })

    servidor.get('/consultar/sumulas', callbackIsAuth, (req, res) => {

        const query = 'SELECT * FROM sumulas';

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Erro ao buscar sumula: ', err);
                return res.status(500).send('Erro interno no servidor');
            }

            if (results.length === 0) {
                return res.status(404).send('Esta sumula tomou doril e sumiu');
            }

            res.json(results); // Retorna a notícia em formato JSON
        });
    });

    const fs = require('fs');
    const path = require('path');

    servidor.post('/excluir/sumula', callbackIsAuth, (req, res) => {
        const instituicaoId = req.body.id;

        if (!instituicaoId) {
            return res.status(400).send('ID da súmula é obrigatório');
        }

        // 1. Primeiro, buscar a súmula para saber o nome do arquivo
        const query1 = 'SELECT * FROM sumulas WHERE id = ?';

        connection.query(query1, [instituicaoId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar súmula:', err);
                return res.status(500).send('Erro interno no servidor');
            }

            if (results.length === 0) {
                return res.status(404).send('A súmula não existe!');
            }

            const nomeArquivo = results[0].nome;
            const caminho = `./silver-web-server/uploads/sumulas/${nomeArquivo}`;

            // 2. Apagar o arquivo
            fs.unlink(caminho, (err) => {
                if (err) {
                    console.error('Erro ao deletar o PDF da súmula:', err);
                    // Ainda continua com a exclusão do banco
                }

                // 3. Agora sim, deletar do banco
                const query2 = 'DELETE FROM sumulas WHERE id = ?';

                connection.query(query2, [instituicaoId], (err, results) => {
                    if (err) {
                        console.error('Erro ao excluir do banco:', err);
                        return res.status(500).send('Erro ao excluir do banco de dados');
                    }

                    // 4. Redirecionar após tudo feito
                    res.redirect("/dashboard/sumulas");
                });
            });
        });
    });

    servidor.get('/sumulas/por-ano', (req, res) => {
        const query = 'SELECT id, nome, mes, ano, instituicao FROM sumulas ORDER BY ano DESC, mes ASC';

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Erro ao buscar súmulas:', err);
                return res.status(500).send('Erro ao buscar dados');
            }

            // Agrupar por ano
            const agrupado = {};

            results.forEach(sumula => {
                const ano = sumula.ano;

                if (!agrupado[ano]) {
                    agrupado[ano] = [];
                }

                // Adiciona a súmula ao ano correspondente
                agrupado[ano].push({
                    id: sumula.id,
                    nome: sumula.nome,
                    mes: sumula.mes,
                    instituicao: sumula.instituicao
                });
            });

            res.json(agrupado);
        });
    });


}

module.exports = {
    rotear
}