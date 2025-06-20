fetch('/metas_recentes')
    .then(res => res.json())
    .then(newsResults => {
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
    })
    .catch(err => {
        console.error("Erro ao carregar notícias:", err);
    });