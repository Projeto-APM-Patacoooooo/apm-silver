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

    const lbl1 = document.getElementById("lbl_noticia1");
    const lbl2 = document.getElementById("lbl_noticia2");
    const lbl3 = document.getElementById("lbl_noticia3");
    
    // FASE[3]: MOSTRANDO ELAS PARA O USUÁRIO
    lbl1.text = newsResults[0].titulo_noticia;
    lbl2.text = newsResults[1].titulo_noticia;
    lbl3.text = newsResults[2].titulo_noticia;
}).catch(error => {
    console.error(error);
});