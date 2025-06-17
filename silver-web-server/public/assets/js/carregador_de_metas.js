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
        xhttp.open("GET", `/meta?id=${id}`, true);
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

    const lbl_meta1 = document.getElementById("lbl_meta1");
    lbl_meta1.textContent = newsResults[0].titulo_meta;

    const sts_met1 = document.getElementById("sts_met1");

    switch (newsResults[0].batida) {
        case 1:
            sts_met1.textContent = "Atingida!";
            sts_met1.style.color = "#198366";
        break;

        case 0:
            sts_met1.textContent = "Ainda não atingida...";
            sts_met1.style.color = "#F0552E";
        break;
    }

    const lbl_meta2 = document.getElementById("lbl_meta2");
    lbl_meta2.textContent = newsResults[1].titulo_meta;

    const sts_met2 = document.getElementById("sts_met2");

    switch (newsResults[1].batida) {
        case 1:
            sts_met2.textContent = "Atingida!";
            sts_met2.style.color = "#198366";
        break;

        case 0:
            sts_met2.textContent = "Ainda não atingida...";
            sts_met2.style.color = "#F0552E";
        break;
    }
    
    const lbl_meta3 = document.getElementById("lbl_meta3");
    lbl_meta3.textContent = newsResults[2].titulo_meta;

    const sts_met3 = document.getElementById("sts_met3");

    switch (newsResults[2].batida) {
        case 1:
            sts_met3.textContent = "Atingida!";
            sts_met3.style.color = "#198366";
        break;

        case 0:
            sts_met3.textContent = "Ainda não atingida...";
            sts_met3.style.color = "#F0552E";
        break;
    }
}).catch(error => {
    console.error(error);
});