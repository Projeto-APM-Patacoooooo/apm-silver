const urlParams = new URLSearchParams(window.location.search);
const mes = urlParams.get('mes');
const ano = urlParams.get('ano');

setTimeout(() => {
    fetch(`/relatorios/baixar?mes=${mes}&ano=${ano}`)
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_${mes}_${ano}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });
  setTimeout(window.close, 1000)
}, 4000);

