fetch('/noticia/tudo')
  .then(res => res.json())
  .then(newsResults => {
    function calcularIdadeNoticia(dia, mes, ano) {
      const dataNoticia = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      const diffTempo = hoje - dataNoticia;
      const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

      if (diffDias === 0) return "Hoje";
      else if (diffDias < 7) return `Há ${diffDias} dia${diffDias > 1 ? "s" : ""}`;
      else if (diffDias < 30) return `Há ${Math.floor(diffDias / 7)} semana${diffDias >= 14 ? "s" : ""}`;
      else if (diffDias < 365) return `Há ${Math.floor(diffDias / 30)} mês${diffDias >= 60 ? "es" : ""}`;
      else return `Há ${Math.floor(diffDias / 365)} ano${diffDias >= 730 ? "s" : ""}`;
    }

    const container = document.getElementById("container-noticias");
    const template = document.getElementById("noticia-template");

    if (!newsResults || newsResults.length === 0) {
      document.getElementById("aviso-nada").style.display = 'flex';
      return;
    }

    document.getElementById("aviso-nada").style.display = 'none';

    newsResults.forEach(noticia => {
      const data = noticia.data_publicacao.substring(0, 10);
      const [ano, mes, dia] = data.split("-").map(Number);
      const idade = calcularIdadeNoticia(dia, mes, ano);

      const clone = template.cloneNode(true);
      clone.style.display = "block";
      clone.removeAttribute("id"); // evita IDs duplicados
      clone.href = `/ver/noticia?id=${noticia.id_noticia}`;
      clone.querySelector("#lbl_titulo").textContent = noticia.titulo_noticia;
      clone.querySelector("#lbl_tempo").textContent = idade;

      const novoLabel = clone.querySelector(".lbl-novo");
      if (["Hoje", "Há 1 dia", "Há 2 dias", "Há 3 dias"].includes(idade)) {
        novoLabel.hidden = false;
      } else {
        novoLabel.hidden = true;
      }

      container.appendChild(clone);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar notícias:", err);
  });
