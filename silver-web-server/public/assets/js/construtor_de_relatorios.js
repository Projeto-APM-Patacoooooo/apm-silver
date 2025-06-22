/*
    =====================================
    CONSTRUTOR DE RELATÓRIOS MEGA BLASTER
    =====================================
    por Eduardo Bezerra

    última inspeção: 02/06/2025
*/

let blocosRecebidos = [];

// Pegar parâmetros de URL
const params = new URLSearchParams(window.location.search);
const IdRelatorio = params.get("relatorio");

// Funções auxiliares de log
const log = {
  info: (msg) => console.log(`[Construtor de Relatórios]: ${msg}`),
  warn: (msg) => console.warn(`[Construtor de Relatórios]: ${msg}`),
  error: (msg) => console.error(`[Construtor de Relatórios]: ${msg}`),
};

// Atualiza a lista global de blocos
function atualizarListaDeBlocos(novosBlocos) {
  blocosRecebidos = novosBlocos;
}

// Formatação de datas e valores
function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

function formatarDinheiro(valor) {
  if (valor == null || valor === '') return '';
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// DOM: tabela onde os blocos serão inseridos
const tabelaVisual = document.getElementById("alvo-blocos");

// Limpa todos os blocos da tabela (para evitar duplicatas)
function limparTabela() {
  tabelaVisual.innerHTML = '';
}

async function DestruirBloco(botao, id) {
  botao.closest('tr').remove(); // Remove a linha da tabela

  try {
    log.info("Excluindo bloco...");
    const response = await fetch(`/relatorios/excluir/bloco?id=${id}&relatorio=${IdRelatorio}`, { method: 'POST' });


    if (!response.ok) {
      throw new Error(`Erro ao excluír bloco: ${response.status}`);
    }

    log.info("Bloco excluído com sucesso.");
    await carregarBlocos(); // Recarrega os blocos para atualizar a tabela
  } catch (err) {
    log.error(err.message);
  }
  blocosRecebidos = blocosRecebidos.filter(bloco => bloco.id !== id);
}

// Renderiza os blocos na tabela
function construir() {
  limparTabela();

  blocosRecebidos.forEach(bloco => {
    var data = bloco.dat?.split("T")[0] || "";
    
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td hidden="true" class="id_bloco">${bloco.id}</td>
      <td scope="row"><input type="date" value="${data}"></td>
      <td><input class="descricao_rela" type="text" value="${bloco.descricao || ''}"></td>
      <td><input type="number" value="${bloco.entrada}"></td>
      <td><input type="number" value="${bloco.saida}"></td>
      <td><input type="text" value="${bloco.extra || ''}"></td>
      <td>
        <button class="btn-remover" onclick="DestruirBloco(this, ${bloco.id})" type="button" title="Remover bloco">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
        </button>
      </td>
    `;
    tabelaVisual.appendChild(linha);
  });
}

// Função para buscar blocos via fetch e atualizar a tabela
async function carregarBlocos() {
  try {
    log.info("Carregando blocos do relatório...");
    const response = await fetch(`/consultar/relatorio/blocos?id=${IdRelatorio}`);

    if (!response.ok) {
      throw new Error(`Erro ao carregar blocos: ${response.status}`);
    }

    const data = await response.json();

    atualizarListaDeBlocos(data);
    construir();
    log.info("Blocos carregados com sucesso.");
  } catch (err) {
    log.error(err.message);
  }
}

// Função para criar um novo bloco via POST
async function criarNovoBloco() {
  try {
    log.info("Criando novo bloco...");
    const response = await fetch(`/relatorios/novo/bloco?id=${IdRelatorio}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`Erro ao criar bloco: ${response.status}`);
    }

    log.info("Bloco criado com sucesso.");
    await carregarBlocos(); // Recarrega os blocos para atualizar a tabela
  } catch (err) {
    log.error(err.message);
  }
}

// Coleta dados dos inputs da tabela para montar objeto dos blocos
function coletarDadosDosBlocos() {
  const linhas = tabelaVisual.querySelectorAll("tr");
  const blocos = [];

  linhas.forEach(linha => {
    const inputs = linha.querySelectorAll('input');
    const idCelula = linha.querySelector(".id_bloco");

    blocos.push({
      id: Number(idCelula.innerHTML.trim()) || '',
      dat: inputs[0]?.value || '',
      descricao: inputs[1]?.value || '',
      entrada: inputs[2]?.value || '',
      saida: inputs[3]?.value || '',
      extra: inputs[4]?.value || ''
    });
  });

  return blocos;
}

// Envia os blocos atualizados ao servidor via POST
async function salvarBlocos() {
  const blocos = coletarDadosDosBlocos();

  try {
    const response = await fetch(`/relatorios/salvar/blocos?id=${IdRelatorio}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blocos)
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar blocos: ${response.status}`);
    }

    log.info("Blocos salvos com sucesso!" + JSON.stringify(blocos));
  } catch (err) {
    log.error(err.message);
  }
}

async function exportar() {
  const blocos = coletarDadosDosBlocos();

  try {
    const response = await fetch(`/relatorios/exportar?id=${IdRelatorio}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blocos)
    });

    if (!response.ok) {
      throw new Error(`Erro ao exportar blocos: ${response.status}`);
    }

    log.info("Blocos exportados com sucesso!" + JSON.stringify(blocos));
  } catch (err) {
    log.error(err.message);
  }
}



let timeoutId;

function salvarAutomaticamenteComDebounce() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(salvarBlocos, 2000); // 2 segundos após a última edição
}

// Salvar após 2s de inatividade após edição
tabelaVisual.addEventListener('input', salvarAutomaticamenteComDebounce);

// Salvar ao sair da página
window.addEventListener("beforeunload", () => salvarBlocos());

// Evento para carregar blocos quando a página carregar
window.addEventListener('load', carregarBlocos);
