let xhr = new XMLHttpRequest();

xhr.responseType = '';
xhr.onreadystatechange = () => {

    if (xhr.status == 200 && xhr.readyState == 4) {
        let resultadoFormatado = JSON.parse(xhr.responseText);
        console.log(resultadoFormatado)
        const alvoInstituicoes = document.getElementById("alvo-instituicoes");


        if (Object.keys(resultadoFormatado).length > 0) {
            
            for (var i = 0; i < Object.keys(resultadoFormatado).length; i++) {
                var alvoAtual = resultadoFormatado[i]         
                var data_pub = alvoAtual.data_cricacao;
                var data_edi = alvoAtual.ultima_edicao;

                var data = new Date(data_pub); 
                var formatada = new Intl.DateTimeFormat('pt-BR').format(data);

                var edi_data = new Date(data_edi);
                var edi_forma = new Intl.DateTimeFormat('pt-BR').format(edi_data);

                alvoInstituicoes.innerHTML += `
                <tr>
                <td scope="row">${alvoAtual.ano}</td>
                <td>${alvoAtual.mes}</td>
                <td>${alvoAtual.instituicao}</td>
                <td>${edi_forma}</td>
                <td>${formatada}</td>
                <td><button class="btn btn-primary" onclick="window.location = '/editor-de-relatorio?relatorio=${alvoAtual.id}'">Editar</button></td>
                <td><button class="btn btn-danger" onclick=IniciarExclusao(${alvoAtual.id})>Excluir</button></td>
                <tr>`

            }
            document.getElementById("aviso-nada").remove();
        }
    }

};

let url = "/consultar/relatorios";

xhr.open('GET', url);
xhr.send();
