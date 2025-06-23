
let xhr = new XMLHttpRequest();

xhr.responseType = '';
xhr.onreadystatechange = () => {

    if (xhr.status == 200 && xhr.readyState == 4) {
        let resultadoFormatado = JSON.parse(xhr.responseText);
        console.log(resultadoFormatado)
        const alvoSumulas = document.getElementById("alvo-sumulas");


        if (Object.keys(resultadoFormatado).length > 0) {



            for (var i = 0; i < Object.keys(resultadoFormatado).length; i++) {
                var alvoAtual = resultadoFormatado[i]

                alvoSumulas.innerHTML += `<tr><td scope="row">${alvoAtual.ano}</td><td>${alvoAtual.mes}</td><td>${alvoAtual.instituicao}</td><td><button class="btn btn-danger" onclick=IniciarExclusao(${alvoAtual.id})>Excluir</button></td><tr>`

            }
            document.getElementById("aviso-nada").remove();
        }
    }

};

let url = "/consultar/sumulas";

xhr.open('GET', url);
xhr.send();