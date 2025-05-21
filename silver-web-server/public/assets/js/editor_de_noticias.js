function EditarUrl(id, titulo, conteudo) {
  const idNum = Number(id);

  if (isNaN(idNum) || !titulo || !conteudo) {
    console.error('ID, título e conteúdo são obrigatórios e válidos.');
    return;
  }

  fetch(`/editar/noticia?id=${idNum}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo,
      conteudo
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Notícia editada com sucesso.');
      location.reload();
    } else {
      console.error('Erro ao editar notícia. Status:', response.status);
    }
    
  })
  .catch(error => {
    console.error('Erro de rede:', error);
  });

  window.location.href = "/dashboard/noticias";
}

