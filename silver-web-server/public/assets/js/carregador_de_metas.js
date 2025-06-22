fetch('/metas_recentes')
  .then(res => res.json())
  .then(newsResults => {
    document.getElementById("lk_met1").style.display = 'none';
    document.getElementById("lk_met2").style.display = 'none';
    document.getElementById("lk_met3").style.display = 'none';

   
    if (newsResults.length === 0) {
      document.getElementById("lk_met1").style.display = 'none';
      document.getElementById("lk_met2").style.display = 'none';
      document.getElementById("lk_met3").style.display = 'none';
      document.getElementById("btn-vmais-met").style.display = 'none';
      return;
    }

    document.getElementById("nada-met").remove();

    // Meta 1
    if (newsResults[0]) {
      const lbl_meta1 = document.getElementById("lbl_meta1");
      const sts_met1 = document.getElementById("sts_met1");

      document.getElementById("lk_met1").style.display = 'block';
      lbl_meta1.textContent = newsResults[0].titulo_meta;

      if (newsResults[0].batida === 1) {
        sts_met1.textContent = "Atingida!";
        sts_met1.style.color = "#198366";
      } else {
        sts_met1.textContent = "Ainda não atingida...";
        sts_met1.style.color = "#F0552E";
      }
    }

    // Meta 2
    if (newsResults[1]) {
      const lbl_meta2 = document.getElementById("lbl_meta2");
      const sts_met2 = document.getElementById("sts_met2");

      document.getElementById("lk_met2").style.display = 'block';
      lbl_meta2.textContent = newsResults[1].titulo_meta;

      if (newsResults[1].batida === 1) {
        sts_met2.textContent = "Atingida!";
        sts_met2.style.color = "#198366";
      } else {
        sts_met2.textContent = "Ainda não atingida...";
        sts_met2.style.color = "#F0552E";
      }
    }

    // Meta 3
    if (newsResults[2]) {
      const lbl_meta3 = document.getElementById("lbl_meta3");
      const sts_met3 = document.getElementById("sts_met3");

      document.getElementById("lk_met3").style.display = 'block';
      lbl_meta3.textContent = newsResults[2].titulo_meta;

      if (newsResults[2].batida === 1) {
        sts_met3.textContent = "Atingida!";
        sts_met3.style.color = "#198366";
      } else {
        sts_met3.textContent = "Ainda não atingida...";
        sts_met3.style.color = "#F0552E";
      }
    }
  })
  .catch(err => {
    console.error("Erro ao carregar notícias:", err);
  });
