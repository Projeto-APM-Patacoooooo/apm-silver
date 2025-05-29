console.warn("[Backup]: Iniciando sistema de backup automático...")

//Biblioteca responsável por agendar a execução de uma função
const cron = require('node-cron');

//Bibliotecas responsáveis por gerenciar arquivos e diretórios
const fs = require('fs').promises;
const path = require('path');

function obterDataFormatada() {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
  const ano = agora.getFullYear();

  return `${dia}-${mes}-${ano}`; // Formato pt-BR
}

async function criarPastaComData(diretorioBase) {
  console.warn("[Backup]: Criando nova pasta de backup");
  const nomePasta = obterDataFormatada();
  const caminhoCompleto = path.join(diretorioBase, nomePasta);

  try {
    await fs.mkdir(caminhoCompleto, { recursive: true });
  } catch (erro) {
    console.error('Erro ao criar a pasta:', erro);
  }
}

// Conectando ao nosso banco de dados
const conector = require('./src/conexao');
const novaConexao = conector.novaConexao();

// Faz backup todas as segundas 00:30
cron.schedule('30 0 * * 1', () => {
  console.warn('[Backup]: começando backup automático das 00:30');

  try {
    criarPastaComData('./silver-backup-system/saves');

    let nomePasta = obterDataFormatada();
    let caminhoPasta = path.join('./silver-backup-system/saves', nomePasta);

    // Salvando instituições
    const query = 'SELECT * FROM instituicoes';

    novaConexao.query(query, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar instituições para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de instituições está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `instituicoes.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });

    //Salvando relatórios
    const query2 = 'SELECT * FROM relatorios';

    novaConexao.query(query2, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar relatórios para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de relatórios está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `relatorios.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });

    //Salvando blocos dos relatórios
    const query3 = 'SELECT * FROM dados_rela';

    novaConexao.query(query3, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar blocos de relatório para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de blocos de relatório está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `dados_rela.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });

    //Salvando notícias
    const query4 = 'SELECT * FROM noticias';

    novaConexao.query(query4, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar notícias para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de notícias está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `noticias.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });

    //Salvando metas
    const query5 = 'SELECT * FROM metas';

    novaConexao.query(query5, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar metas para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de metas está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `metas.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });

    //Salvando membros
    const query6 = 'SELECT * FROM membros_etec';

    novaConexao.query(query6, (err, results) => {
      if (err) {
        console.error('[Backup]: Erro ao buscar membros para salvar:', err);
        return
      }

      if (results.length === 0) {
        console.warn('[Backup]: A tabela de membros está vazia, sem necessidade de salvamento')
        return
      }
      var caminhoArquivo = path.join(caminhoPasta, `membros_etec.json`);
      let conteudoJSON = JSON.stringify(results, null, 2);
      fs.writeFile(caminhoArquivo, conteudoJSON, 'utf8');
    });


  } catch (err) {
    console.error("[Backup]: Backup falhou: ", err);
  }

});