
//let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

                alvoInstituicoes.innerHTML += "<tr><td>" + alvoAtual.id + "</td><td>" + alvoAtual.nome + "</td><td><button>Editar</button></td><td><button>Excluir</button></td></tr>"
            }
            document.getElementById("aviso-nada").remove();
        }
    }

};

let url = "/consultar/instiuicoes";

xhr.open('GET', url);
xhr.send();
