/*
    Este script carrega as 3 metas em destaque para a página principal
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
        xhttp.open("GET", `/dest_meta?id=${id}`, true);
        xhttp.send();
    });
}

function Buscarmeta(id) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState == 4) {
                reject('Erro ao buscar dados');
            }
        };
        xhttp.open("GET", `/meta?id=${id}`, true);
        xhttp.send();
    });
}

// FASE[2]: BUSCANDO AS NOTÍCIAS EM DESTAQUE EM SI

Promise.all([
    BuscarDestaque(1),
    BuscarDestaque(2),
    BuscarDestaque(3)
]).then(results => {
    const dest1 = results[0].id_meta;
    const dest2 = results[1].id_meta;
    const dest3 = results[2].id_meta;

    return Promise.all([
        Buscarmeta(dest1),
        Buscarmeta(dest2),
        Buscarmeta(dest3)
    ]);
}).then(newsResults => {

    const lbl1 = document.getElementById("lbl_meta1");
    const lbl2 = document.getElementById("lbl_meta2");
    const lbl3 = document.getElementById("lbl_meta3");
    
    // FASE[3]: MOSTRANDO ELAS PARA O USUÁRIO
    lbl1.text = newsResults[0].titulo_meta;
    lbl2.text = newsResults[1].titulo_meta;
    lbl3.text = newsResults[2].titulo_meta;
}).catch(error => {
    console.error(error);
});