/*
    Este script carrega as 3 noticias em destaque para a página principal
*/

// FASE[1]: BUSCANDO QUAIS SÃO AS NOTÍCIAS EM DESTAQUE

function BuscarDestaque(id) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState == 4) {
                reject('Erro ao buscar dados');
            }
        };
        xhttp.open("GET", `/dest_noticia?id=${id}`, true);
        xhttp.send();
    });
}

function BuscarNoticia(id) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState == 4) {
                reject('Erro ao buscar dados');
            }
        };
        xhttp.open("GET", `/noticia?id=${id}`, true);
        xhttp.send();
    });
}

// FASE[2]: BUSCANDO AS NOTÍCIAS EM DESTAQUE EM SI

Promise.all([
    BuscarDestaque(1),
    BuscarDestaque(2),
    BuscarDestaque(3)
]).then(results => {
    const dest1 = results[0].id_noticia;
    const dest2 = results[1].id_noticia;
    const dest3 = results[2].id_noticia;

    return Promise.all([
        BuscarNoticia(dest1),
        BuscarNoticia(dest2),
        BuscarNoticia(dest3)
    ]);
}).then(newsResults => {

    const data_atual = new Date();

    const diaHoje = data_atual.getDate();
    const mesHoje = data_atual.getMonth() + 1;
    const anoHoje = data_atual.getFullYear();

    console.log(diaHoje, mesHoje, anoHoje)

    function calcularIdadeNoticia(dia, mes, ano) {

        //Código feito com ajuda do meu amigo GPT para calcular a idade da noticia.
        const dataNoticia = new Date(ano, mes - 1, dia); 
        const hoje = new Date();
    
        const diffTempo = hoje - dataNoticia;
        const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    
        if (diffDias === 0) {
            return "Hoje";
        } else if (diffDias < 7) {
            return `Há ${diffDias} dia${diffDias > 1 ? "s" : ""}`;
        } else if (diffDias < 30) {
            return `Há ${Math.floor(diffDias / 7)} semana${diffDias >= 14 ? "s" : ""}`;
        } else if (diffDias < 365) {
            return `Há ${Math.floor(diffDias / 30)} mês${diffDias >= 60 ? "es" : ""}`;
        } else {
            return `Há ${Math.floor(diffDias / 365)} ano${diffDias >= 730 ? "s" : ""}`;
        }
    }
    
    //De volta ao código de Pardoardo

    let data_noticia1 = newsResults[0].data_publicacao.substring(0,10);
    let ano_not1 = Number(data_noticia1.substring(0,4));
    let dia_not1 = Number(data_noticia1.substring(8));
    let mes_not1 = Number(data_noticia1.substring(5,7));

    let data_noticia2 = newsResults[1].data_publicacao.substring(0,10);
    let ano_not2 = Number(data_noticia2.substring(0,4));
    let dia_not2 = Number(data_noticia2.substring(8));
    let mes_not2 = Number(data_noticia2.substring(5,7));

    let data_noticia3 = newsResults[2].data_publicacao.substring(0,10);
    let ano_not3 = Number(data_noticia3.substring(0,4));
    let dia_not3 = Number(data_noticia3.substring(8));
    let mes_not3 = Number(data_noticia3.substring(5,7));

    const lbl1 = document.getElementById("lbl_noticia1");
    const tm1 = document.getElementById("tm_noticia1");

    const lbl2 = document.getElementById("lbl_noticia2");
    const tm2 = document.getElementById("tm_noticia2");

    const lbl3 = document.getElementById("lbl_noticia3");
    const tm3 = document.getElementById("tm_noticia3");

    lbl1.innerHTML = newsResults[0].titulo_noticia;
    tm1.innerHTML = calcularIdadeNoticia(dia_not1, mes_not1, ano_not1);
    if(tm1.innerHTML === "Hoje" || tm1.innerHTML === "Há 1 dias" || tm1.innerHTML === "Há 2 dias" || tm1.innerHTML === "Há 3 dias"){
        document.getElementById("lbl-novo1").hidden = false;
    }

    lbl2.innerHTML = newsResults[1].titulo_noticia;
    tm2.innerHTML = calcularIdadeNoticia(dia_not2, mes_not2, ano_not2);
    if(tm2.innerHTML === "Hoje" || tm2.innerHTML === "Há 1 dias" || tm2.innerHTML === "Há 2 dias" || tm2.innerHTML === "Há 3 dias"){
        document.getElementById("lbl-novo2").hidden = false;
    }

    lbl3.innerHTML = newsResults[2].titulo_noticia;
    tm3.innerHTML = calcularIdadeNoticia(dia_not2, mes_not2, ano_not2);
    if(tm3.innerHTML === "Hoje" || tm3.innerHTML === "Há 1 dias" || tm3.innerHTML === "Há 2 dias" || tm3.innerHTML === "Há 3 dias"){
        document.getElementById("lbl-novo3").hidden = false;
    }
}).catch(error => {
    console.error(error);
});