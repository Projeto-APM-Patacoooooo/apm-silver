fetch('/noticias_recentes')
    .then(res => res.json())
    .then(newsResults => {
        function calcularIdadeNoticia(dia, mes, ano) {
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

        for (let i = 0; i < 3; i++) {
            const noticia = newsResults[i];
            const data = noticia.data_publicacao.substring(0, 10); // YYYY-MM-DD
            const ano = Number(data.substring(0, 4));
            const mes = Number(data.substring(5, 7));
            const dia = Number(data.substring(8));

            const lbl = document.getElementById(`lbl_noticia${i + 1}`);
            const tm = document.getElementById(`tm_noticia${i + 1}`);
            const link = document.getElementById(`lk_not${i + 1}`);
            const novo = document.getElementById(`lbl-novo${i + 1}`);

            lbl.innerHTML = noticia.titulo_noticia;
            tm.innerHTML = calcularIdadeNoticia(dia, mes, ano);
            link.href = `/ver/noticia?id=${noticia.id_noticia}`;
            
        
            

            if (tm.innerHTML === "Hoje" || tm.innerHTML.includes("Há 1 dia") || tm.innerHTML.includes("Há 2 dias") || tm.innerHTML.includes("Há 3 dias")) {
                novo.hidden = false;
            }
        }
    })
    .catch(err => {
        console.error("Erro ao carregar notícias:", err);
    });
