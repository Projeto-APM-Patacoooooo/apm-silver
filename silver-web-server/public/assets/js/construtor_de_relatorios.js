/*
    =====================================
    CONSTRUTOR DE RELATÓRIOS MEGA BLASTER
    =====================================
    por Eduardo Bezerra

    última inspeção: 28/05/2025
*/


let blocosRecebidos;

// Procurando parâmetros de pesquisa
let params = (new URL(document.location)).searchParams;

// Conseguindo o ID do Relatório
let IdRelatorio = params.get("relatorio");

// Funções para facilitar os logs durante a execução 
function print(valor) {
    console.log(`[Construtor de Relatórios]: ${valor}`);
};

function avisar(valor) {
    console.warn(`[Construtor de Relatórios]: ${valor}`);
}

function erro(valor) {
    console.error(`[Construtor de Relatórios]: ${valor}`);
}

// Adiciona mais um bloco na lista de blocos
function atualizarListaDeBlocos(novosBlocos) {
    blocosRecebidos = novosBlocos;
};

// Formata datas do SQL para datas normais brasileiras
function formatarData(data) {
    var d = new Date(data);
    var formatada = new Intl.DateTimeFormat('pt-BR').format(d);
    return formatada;
}

//Substituí o ponto de um decimal por vírgula
function formatarDinheiro(valor) {
    if (!valor === null) {
        let formatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return formatado;
    }
}

// Função que envia requests para o servidor para pegar os dados em JSON (Só dados de blocos)
// *recomendo que seja usada de forma eficiente para não atingir o rateLimit do servidor
async function enviarRequest(url) {
    print("Enviando request ao servidor para conseguir os blocos...")
    let xhr = new XMLHttpRequest();

    xhr.responseType = '';
    xhr.onreadystatechange = () => {

        // Verificando se o servidor aceitou a request sem nenhum problema
        if (xhr.status == 200 && xhr.readyState == 4) {
            print("Request foi recebida com êxito pelo servidor!")

            let resultadoFormatado = JSON.parse(xhr.responseText);

            atualizarListaDeBlocos(resultadoFormatado)
        }
    }

    //Enviando request
    xhr.open('GET', url);
    xhr.send();
}

// Apaga todos os blocos do relatório (Não do banco de dados. Só serve para recarregar o relatório sem deixar duplicatas de blocos)
function demolir() {
    const alvo = document.getElementById("bloco-de-relatorios");
    alvo.remove()
};

const tabelaVisual = document.getElementById("alvo-blocos");

// Carrega todos os blocos do relatório
function construir() {
    for (var i = 0; i < blocosRecebidos.length; i++) {
        let blocoAtual = blocosRecebidos[i];

        tabelaVisual.innerHTML +=
            `<tr id="bloco-de-relatorios">
            <td scope="row"><input type="text" value="${formatarData(blocoAtual.dat)}"></td>
            <td><input class="descricao_rela" type="text" value="${blocoAtual.descricao}"></td>
            <td><input type="text" value="${formatarDinheiro(blocoAtual.entrada)}"></td>
            <td><input type="text" value="${blocoAtual.saida}"></td>
            <td><input type="text"></td>
            <td>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </td>
        </tr>`;
    }
}

// Função que carrega todos os blocos iniciais do relatórios
async function carregar() {
    print("Iniciando carregamento dos blocos...")

    await enviarRequest(`/consultar/relatorio/blocos?id=${IdRelatorio}`);

    /* 
        Gambiarra sem vergonha para esperar os blocos carregarem antes de executar construções.
        Podiamos usar await? sim! mas aparentemente o JavaScript não quer obedecelos por aqui
    */
    setTimeout(() => {
        console.log(blocosRecebidos)
        construir()
    }, 1000)

};

//Cadastra um novo bloco no banco de dados e recarrega lista
function criarNovoBloco() {
    print("Enviando request ao servidor para criar novo bloco...")
    let xhr = new XMLHttpRequest();

    xhr.open('POST', `/relatorios/novo/bloco?id=${IdRelatorio}`, true);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Request recebida com êxito!");
            } else {
                console.error("Erro na request:", xhr.status);
            }
        }
    };

    // Mesmo que não tenha body, `send()` precisa ser chamado
    xhr.send();

    demolir();
    construir();
}

function coletarDadosDosBlocos() {
    const linhas = document.querySelectorAll("#alvo-blocos tr");
    const blocos = [];

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll('input');

        const bloco = {
            data: inputs[0]?.value || '',
            descricao: inputs[1]?.value || '',
            entrada: inputs[2]?.value || '',
            saida: inputs[3]?.value || '',
            extra: inputs[4]?.value || ''
        };

        blocos.push(bloco);
    });

    return blocos;
}

async function enviarTodosOsBlocos() {
    const blocos = coletarDadosDosBlocos();

    try {
        const response = await fetch(`/relatorios/salvar/blocos?id=${IdRelatorio}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blocos)
        });

        if (response.ok) {
            console.log("Blocos enviados com sucesso!");
        } else {
            console.error("Erro ao enviar os blocos:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}


// Iniciando carregamento APENAS QUANDO a página estiver totalmente carregada
window.onload = carregar;