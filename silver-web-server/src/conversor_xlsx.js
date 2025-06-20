const ExcelJS = require('exceljs');

function GerarRelatorioExcel(info, dadosExtrato) {

  async function preencherExtrato() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('modelo_planilha.xlsx');

    const sheet = workbook.getWorksheet(1); // ou pelo nome: getWorksheet('Relatório')


    // Substitui os valores fixos
    sheet.getCell('A1').value = `CONTROLE APM 2025 ${info.ano}`;

    sheet.getCell('D1').value = `${info.mes} / ${info.ano}`;

    sheet.getCell('A2').value = `Instituição ${info.nome_banco}`;

    sheet.getCell('D2').value = `Agência ${info.agencia}`;
    sheet.getCell('E2').value = `Conta ${info.conta}`;

    sheet.getCell('A4').value = `Saldo do mês anterior`;
    sheet.getCell('E4').value = info.saldo_mes_passado;
    sheet.getCell('E4').numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';

    // Começa a preencher a tabela na linha 6
    let saldoAtual = info.saldo_mes_passado;
    let linha = 6;
    dadosExtrato.forEach((item) => {
      saldoAtual += item.entrada - item.saida;

      const row = sheet.getRow(linha++);
      row.getCell(1).value = item.data;
      row.getCell(2).value = item.descricao;
      row.getCell(3).value = item.entrada || '';
      row.getCell(4).value = item.saida || '';
      row.getCell(5).value = saldoAtual;

      // Formata valores numéricos como moeda
      ['C', 'D', 'E'].forEach((col) => {
        sheet.getCell(`${col}${row.number}`).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
      });
    });

    await workbook.xlsx.writeFile('../relatorios/exportados/extrato_preenchido.xlsx');
    console.log('Arquivo de extrato gerado com sucesso!');
  }

  preencherExtrato();
}