
let xhr = new XMLHttpRequest();

xhr.responseType = '';
xhr.onreadystatechange = () => {

    if (xhr.status == 200 && xhr.readyState == 4) {
        let resultadoFormatado = JSON.parse(xhr.responseText);
        console.log(resultadoFormatado)
        const alvoInstituicoes = document.getElementById("alvo-noticias");


        if (Object.keys(resultadoFormatado).length > 0) {



            for (var i = 0; i < Object.keys(resultadoFormatado).length; i++) {
                var alvoAtual = resultadoFormatado[i]
                var data_pub = alvoAtual.data_publicacao;
                var data = new Date(data_pub); 
                let formatada = new Intl.DateTimeFormat('pt-BR').format(data);

                alvoInstituicoes.innerHTML += `<tr><td scope="row">${alvoAtual.titulo_noticia}</td><td>${formatada}</td><td><button onclick=irParaPaginaDeEdicao(${alvoAtual.id})>Editar</button></td><td><button onclick=IniciarExclusao(${alvoAtual.id})>Excluir</button></td><tr>`

            }
            document.getElementById("aviso-nada").remove();
        }
    }

};

let url = "/consultar/noticias";

xhr.open('GET', url);
xhr.send();