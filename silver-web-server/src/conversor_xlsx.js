const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function GerarRelatorioExcel(info, dadosExtrato) {
  try {
    const pastaExport = path.join(__dirname, '../relatorios/exportados');
    const nomeArquivo = `${info.mes}_${info.ano}.xlsx`;
    const caminhoCompleto = path.join(pastaExport, nomeArquivo);

    // Verifica se o relatório já existe
    if (fs.existsSync(caminhoCompleto)) {
      console.log(`Relatório já existe: ${caminhoCompleto}`);
      return;
    }

    // Verifica se o diretório existe, senão cria
    if (!fs.existsSync(pastaExport)) {
      fs.mkdirSync(pastaExport, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, 'modelo_planilha.xlsx'));

    const sheet = workbook.getWorksheet(1); // ou pelo nome: getWorksheet('Relatório')

    // Substitui os valores fixos
    sheet.getCell('A1').value = `CONTROLE APM 2025 ${info.ano}`;
    sheet.getCell('D1').value = `${info.mes} / ${info.ano}`;
    sheet.getCell('A2').value = `Instituição ${info.nome_banco}`;
    sheet.getCell('D2').value = `Agência ${info.agencia}`;
    sheet.getCell('E2').value = `Conta ${info.conta}`;
    sheet.getCell('A4').value = `Saldo do mês anterior`;
    sheet.getCell('E4').value = info.saldo_mes_passado || 0;
    sheet.getCell('E4').numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';

    // Começa a preencher a tabela na linha 6
    let saldoAtual = info.saldo_mes_passado || 0;
    let linha = 6;
    dadosExtrato.forEach((item) => {
      saldoAtual += (item.entrada || 0) - (item.saida || 0);

      const row = sheet.getRow(linha++);
      row.getCell(1).value = item.data;
      row.getCell(2).value = item.descricao;
      row.getCell(3).value = item.entrada || '';
      row.getCell(4).value = item.saida || '';
      row.getCell(5).value = saldoAtual;

      ['C', 'D', 'E'].forEach((col) => {
        sheet.getCell(`${col}${row.number}`).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
      });
    });

    await workbook.xlsx.writeFile(caminhoCompleto);
    console.log(`Arquivo gerado com sucesso: ${caminhoCompleto}`);
  } catch (err) {
    console.error('Erro ao gerar relatório Excel:', err);
  }
}
