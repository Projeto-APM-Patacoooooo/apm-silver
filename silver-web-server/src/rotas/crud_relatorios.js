const express = require("express");
const ExcelJS = require('exceljs');

const path = require('path');
const fs = require('fs');


async function GerarRelatorioExcel(info, dadosExtrato) {
  try {
    const pastaExport = path.join(__dirname, '../../relatorios/exportados');
    const nomeArquivo = `${info.mes}_${info.ano}.xlsx`;
    const caminhoCompleto = path.join(pastaExport, nomeArquivo);

    if (!fs.existsSync(pastaExport)) {
      fs.mkdirSync(pastaExport, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, 'modelo_planilha.xlsx'));

    const sheet = workbook.getWorksheet(1);

    sheet.getCell('A1').value = `CONTROLE APM ${info.ano}`;
    sheet.getCell('D1').value = `${info.mes} / ${info.ano}`;
    sheet.getCell('A2').value = `Instituição ${info.nome_banco}`;
    sheet.getCell('D2').value = `Agência ${info.agencia}`;
    sheet.getCell('E2').value = `Conta ${info.conta}`;
    sheet.getCell('A4').value = `Saldo do mês anterior`;
    sheet.getCell('E4').value = info.saldo_mes_passado || 0;
    sheet.getCell('E4').numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';

    let totalEntradas = 0;
    let totalSaidas = 0;
    let linha = 6;
    let saldoAtual = info.saldo_mes_passado || 0;

    dadosExtrato.forEach((item) => {
      let linhaAtual = linha++;

      let dataFormatada = '';
      try {
        dataFormatada = new Date(item.dat).toLocaleDateString('pt-BR');
      } catch {
        dataFormatada = item.dat?.toString() || 'Data inválida';
      }

      const entrada = Number(item.entrada) || 0;
      const saida = Number(item.saida) || 0;

      totalEntradas += entrada;
      totalSaidas += saida;

      const row = sheet.getRow(linhaAtual);
      row.getCell(1).value = dataFormatada;
      row.getCell(2).value = item.descricao;
      row.getCell(3).value = entrada || '';
      row.getCell(4).value = saida || '';

      saldoAtual += entrada - saida;
      row.getCell(5).value = saldoAtual;

      ['C', 'D', 'E'].forEach((col) => {
        sheet.getCell(`${col}${linhaAtual}`).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
      });

    });

    // Títulos em G4, H4, I4
    sheet.getCell('G4').value = 'Entrada';
    sheet.getCell('H4').value = 'Saída';
    sheet.getCell('I4').value = 'Total';

    // Valores em G5, H5, I5
    sheet.getCell('G5').value = totalEntradas;
    sheet.getCell('H5').value = totalSaidas;
    sheet.getCell('I5').value = saldoAtual; // já é saldo anterior + entradas - saídas

    ['G5', 'H5', 'I5'].forEach((cell) => {
      sheet.getCell(cell).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
    });

    ['G', 'H', 'I'].forEach((coluna) => {
      sheet.getColumn(coluna).width = 18; // Ajuste conforme o necessário
    });

    await workbook.xlsx.writeFile(caminhoCompleto);
    console.log(`Arquivo gerado com sucesso: ${caminhoCompleto}`);
  } catch (err) {
    console.error('Erro ao gerar relatório Excel:', err);
  }
}

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

  servidor.get('/consultar/relatorio/blocos', callbackIsAuth, (req, res) => {

    const instituicaoId = req.query.id; // Pega o parâmetro ?id= do navegador
    console.log("Nova solicitação de exclusão de relatório: id: " + instituicaoId)

    if (!instituicaoId) {
      return res.status(400).send('ID do relatório é obrigatório');
    }

    const query = 'select * from dados_rela where relatorio_pai = ?';

    connection.query(query, [instituicaoId], (err, results) => {
      if (err) {
        console.error('Erro ao excluir relatório:', err);
        return res.status(500).send('Erro interno no servidor');
      }

      if (results.length === 0) {
        return res.status(404).send('O relatório não existe!');
      }
      res.send(results)
    });
  });

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

    connection.query(query, [instituicaoId], (err, results) => {
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

    connection.query(query, [instituicaoId], (err, results) => {
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

      res.render('pages/editar_relatorio', { mes, ano, instituicao, emailLogado: req.session.user.email });
    });
  });

  servidor.post('/relatorios/novo/bloco', callbackIsAuth, (req, res) => {
    callbackVerificarMan(res);
    const relatorioId = req.query.id; // Pega o parâmetro ?id= do navegador

    if (!relatorioId) {
      res.redirect('/dashboard/relatorios')
    }

    var hoje = new Date();
    var dia = hoje.getDate();
    var mes = hoje.getMonth() + 1;
    var ano = hoje.getFullYear();
    var dataFinal = `${ano}-${mes}-${dia}`;

    const query = 'insert into dados_rela(relatorio_pai, dat, entrada, saida) values(?, ?, 0.00, 0.00)';

    connection.query(query, [relatorioId, dataFinal], (err, results) => {
      if (err) {
        console.error('Erro ao buscar notícia:', err);
        return res.status(500).send('Erro interno no servidor');
      }

      res.status(200).end();
    });
  });

  servidor.post('/relatorios/excluir/bloco', callbackIsAuth, (req, res) => {
    callbackVerificarMan(res);
    const blocoId = req.query.id;

    if (!blocoId) {
      res.redirect('/dashboard/relatorios')
    }

    const query = `delete from dados_rela where id = ${blocoId}`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao excluir bloco', err);
        return res.status(500).send('Erro interno no servidor');
      }

      res.status(200).end();
    });
  });

  servidor.post('/relatorios/salvar/saldo_anterior', callbackIsAuth, (req, res) => {
    const idRelatorio = req.query.relatorio;
    const novoValor = req.query.saldo;

    if (!idRelatorio) {
      return res.send("É preciso providenciar um id de relatório para salvar");
    }

    if (!novoValor) {
      return res.send("É preciso providenciar um novo valor de saldo para salvar");
    }

    var query = `update relatorios set saldo_anterior = ${novoValor} where id = ${idRelatorio}`;

    connection.query(query, (err) => {
      if (err) {
        console.error("Erro ao salvar saldo anterior: " + err);
      };
    });
  })


  servidor.post('/relatorios/salvar/blocos', callbackIsAuth, (req, res) => {
    const blocos = req.body; // Array de blocos

    blocos.forEach((bloco, i) => {
      var query = `update dados_rela set dat = '${bloco.dat}', descricao = "${bloco.descricao}", entrada = ${bloco.entrada}, saida = ${bloco.saida} where id = ${bloco.id}`

      connection.query(query, (err) => {
        if (err) {
          console.error("Erro ao salvar blocos de relatório: " + err)
        }
      })

    });

    res.sendStatus(200);
  });

  //http://localhost:8080/relatorios/gerar?id=
  servidor.get("/relatorios/gerar", callbackIsAuth, (req, res) => {
    const relatorioID = req.query.id;

    if (!relatorioID) {
      return res.send("<h1>Mensagem do Servidor:</h1><hr><p>Você não me disse qual relatório você quer editar.</p>");
    }

    res.render("pages/exportacao_relatorio", { emailLogado: req.session.user.email });

    const queryPesquisaRela = `SELECT * FROM relatorios WHERE id = ${relatorioID}`;

    const info = {
      ano: '',
      mes: '',
      nome_banco: '',
      agencia: '',
      conta: '',
      saldo_mes_passado: 0,
    };

    connection.query(queryPesquisaRela, (err, results) => {
      if (err) {
        console.error('Erro ao buscar relatório:', err);
        return res.status(500).send('Erro interno no servidor');
      }

      if (results.length < 1) {
        return res.send("<h1>Relatório não encontrado.</h1>");
      }

      const relatorio = results[0];
      info.ano = relatorio.ano;
      info.mes = relatorio.mes;
      info.saldo_mes_passado = relatorio.saldo_anterior || 0;

      const queryPesquisaInstituicoes = `SELECT * FROM instituicoes WHERE id = ${relatorio.instituicao}`;

      connection.query(queryPesquisaInstituicoes, (err, results2) => {
        if (err) {
          console.error('Erro ao buscar instituição:', err);
          return res.status(500).send('Erro interno no servidor');
        }

        if (results2.length > 0) {
          const inst = results2[0];
          info.nome_banco = inst.nome;
          info.agencia = inst.agencia;
          info.conta = inst.conta;
        }

        const queryBlocos = `SELECT * FROM dados_rela WHERE relatorio_pai = ${relatorioID}`;

        connection.query(queryBlocos, (err, blocos) => {

          if (err) {
            console.error('Erro ao buscar blocos:', err);
            return res.status(500).send('Erro interno no servidor');
          }

          let saldoAtual = info.saldo_mes_passado;
          blocos.forEach(bloco => {
            saldoAtual += (bloco.entrada || 0) - (bloco.saida || 0);
            console.log("/relatorios/gerar" + bloco.dat)
          });

          GerarRelatorioExcel(info, blocos)
        });
      });
    });
  });

  ///relatorios/baixar?mes=Junho?ano=2024
  servidor.get("/relatorios/baixar", callbackIsAuth, (req, res) => {
    const { mes, ano } = req.query;

    const arquivo = path.join(__dirname, "../../relatorios/exportados", `${mes}_${ano}.xlsx`);

    if (fs.existsSync(arquivo)) {
      res.download(arquivo, `Relatorio_${mes}_${ano}.xlsx`, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          res.status(500).send("Erro ao baixar o relatório.");
        }
      });
    } else {
      res.status(404).send("Relatório não encontrado.");
    }
  });


  servidor.get("/editor-de-relatorio", callbackIsAuth, (req, res) => {
    callbackVerificarMan();

    const relatorioID = req.query.relatorio

    if (!relatorioID) {
      res.send("<h1>Mensagem do Servidor:</h1><hr><p>Você não me disse qual relatório você quer editar.</p>")
      return;
    }

    const query = 'select * from relatorios where id = ?';

    connection.query(query, [relatorioID], (err, results) => {
      if (err) {
        res.send("<h1>Um terrível erro aconteceu no nosso servidor</h1><hr><p>Demonstre sua autoridade tentando novamente!</p>")
        return
      }

      if (results.length < 1) {
        res.send("<h1>Relatório não encontrado</h1><hr><p>Não foi possível encontrar este relatório no servidor.</p>")
        return
      } else {

        const query2 = `select * from instituicoes where id = ${Number(results[0].instituicao)}`

        connection.query(query2, (err, results2) => {
          if (err) {
            console.error("[Servidor]: Lascou muito na hora de pegar a instiuição do relatório");
            return
          }

          if (results.length < 1) {
            console.warn("[Servidor]: Não foi possível achar nenhuma instituição com o id requerido")

            return
          } else {
            console.log(results2)
            res.render('pages/editor_de_relatorios', { rela_ano: results[0].ano, rela_mes: results[0].mes, inst_nome: results2[0].nome, inst_conta: results2[0].conta, inst_agencia: results2[0].agencia, emailLogado: req.session.user.email, id_rela: results[0].id, saldo_ant: results[0].saldo_anterior })
          }
        })
      }
    });
  })
}

module.exports = {
  rotear
}