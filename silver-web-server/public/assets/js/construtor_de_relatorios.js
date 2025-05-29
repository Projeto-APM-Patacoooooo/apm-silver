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
function atualizarListaDeBlocos(novosBlocos){
    blocosRecebidos = novosBlocos;
};

// Formata datas do SQL para datas normais brasileiras
function formatarData(data){
    var d = new Date(data); 
    var formatada = new Intl.DateTimeFormat('pt-BR').format(d);
    return formatada;
}

//Substituí o ponto de um decimal por vírgula
function formatarDinheiro(valor){
    if(!valor === null){
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

};

const tabelaVisual = document.getElementById("alvo-blocos");

// Carrega todos os blocos do relatório
function construir(){
    for (var i = 0; i < blocosRecebidos.length; i++) {
        let blocoAtual = blocosRecebidos[i];

        tabelaVisual.innerHTML += 
        `<tr>
            <td scope="row"><input type="text" value="${formatarData(blocoAtual.dat)}"></td>
            <td><input class="descricao_rela" type="text" value="${blocoAtual.descricao}"></td>
            <td><input type="text" value="${formatarDinheiro(blocoAtual.entrada)}"></td>
            <td><input type="text" value="${blocoAtual.saida}"></td>
            <td><input type="text"></td>
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

// Iniciando carregamento APENAS QUANDO a página estiver totalmente carregada
window.onload = carregar;