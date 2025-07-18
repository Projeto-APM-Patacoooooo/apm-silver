
let xhr = new XMLHttpRequest();

xhr.responseType = '';
xhr.onreadystatechange = () => {

    if (xhr.status == 200 && xhr.readyState == 4) {
        let resultadoFormatado = JSON.parse(xhr.responseText);
        console.log(resultadoFormatado)
        const alvoInstituicoes = document.getElementById("alvo-metas");


        if (Object.keys(resultadoFormatado).length > 0) {
            for (var i = 0; i < Object.keys(resultadoFormatado).length; i++) {
                var alvoAtual = resultadoFormatado[i]
                var data_pub = alvoAtual.data_meta;
                var titulo = alvoAtual.titulo_meta;
                var batida = alvoAtual.batida;

                switch(alvoAtual.batida){
                    case 1: 
                        batida = "Sim"
                    break;
                    case 0: 
                        batida = "Não"
                    break;
                }

                var data = new Date(data_pub); 
                var formatada = new Intl.DateTimeFormat('pt-BR').format(data);

                alvoInstituicoes.innerHTML += `<tr><td scope="row">${titulo}</td><td>${formatada}</td><td>${batida}</td><td><button class="btn btn-primary" onclick=irParaPaginaDeEdicao(${alvoAtual.id_meta})>Editar</button></td><td><button class="btn btn-danger" onclick=IniciarExclusao(${alvoAtual.id_meta})>Excluir</button></td><tr>`


            
            }   
            document.getElementById("aviso-nada").remove();
        } 
    }

};

let url = "/metas/tudo";

xhr.open('GET', url);
xhr.send();