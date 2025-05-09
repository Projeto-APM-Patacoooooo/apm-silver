
let xhr = new XMLHttpRequest();

xhr.responseType = '';
xhr.onreadystatechange = () => {

    if (xhr.status == 200 && xhr.readyState == 4) {
        let resultadoFormatado = JSON.parse(xhr.responseText);
        console.log(resultadoFormatado)
        const alvoInstituicoes = document.getElementById("alvo-noticias");


        if (Object.keys(resultadoFormatado).length > 0) {



            for (var i = 0; i < Object.keys(resultadoFormatado).length; i++) {

                function invertStringWithoutInvertingContents(str) {
                    // Split the string into an array of words
                    let wordsArray = str.split(' ');
                    
                    // Reverse the order of the words in the array
                    let reversedArray = wordsArray.reverse();
                    
                    // Join the reversed array back into a string
                    let invertedString = reversedArray.join(' ');
                    
                    return invertedString;
                }
                
                // Example usage:
                var alvoAtual = resultadoFormatado[i]
                var data_pub = alvoAtual.data_publicacao;
                var data_formatada = invertStringWithoutInvertingContents(JSON.stringify(data_pub));

                alvoInstituicoes.innerHTML += `<tr><td>${alvoAtual.id_noticia}</td><td>${alvoAtual.titulo_noticia}</td><td>${data_formatada}</td><td><button onclick=irParaPaginaDeEdicao(${alvoAtual.id})>Editar</button></td><td><button onclick=IniciarExclusao(${alvoAtual.id})>Excluir</button></td><tr>`

            }
            document.getElementById("aviso-nada").remove();
        }
    }

};

let url = "/consultar/noticias";

xhr.open('GET', url);
xhr.send();