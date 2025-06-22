setTimeout(() => {
    fetch(`/relatorios/baixar?mes=Junho&ano=2025`)
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Relatorio_Junho_2025.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });

}, 4000);