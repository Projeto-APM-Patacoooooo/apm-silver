fetch('/metas/tudo')
  .then(res => res.json())
  .then(newsResults => {
    const container = document.getElementById("container-metas");
    const template = document.getElementById("meta-template");

    if (!newsResults || newsResults.length === 0) {
      document.getElementById("aviso-nada").style.display = 'flex';
      return;
    }

    document.getElementById("aviso-nada").style.display = 'none';

    newsResults.forEach(meta => {
      const clone = template.cloneNode(true);
      clone.style.display = "block";
      clone.removeAttribute("id"); // evita IDs duplicados
      clone.querySelector("#lbl_titulo").textContent = meta.titulo_meta;
      const sts_met = clone.querySelector("#sts_met")

      if (meta.batida === 1) {
        sts_met.textContent = "Atingida!";
        sts_met.style.color = "#198366";
      } else {
        sts_met.textContent = "Ainda não atingida...";
        sts_met.style.color = "#F0552E";
      }
      container.appendChild(clone);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar notícias:", err);
  });
