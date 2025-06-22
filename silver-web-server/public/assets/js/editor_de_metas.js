function EditarUrl(id, titulo, batida) {
  const idNum = Number(id);

  if (isNaN(idNum) || !titulo || typeof batida !== 'boolean') {
    console.error('ID, título e batida são obrigatórios e válidos.');
    return;
  }

  fetch(`/editar/meta?id=${idNum}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, titulo, batida })
  })
    .then(response => {
      if (response.ok) {
        console.log('Meta editada com sucesso.');

        window.location = "/dashboard/metas"
      } else {
        console.error('Erro ao editar meta. Status:', response.status);
      }
    })
    .catch(error => {
      console.error('Erro de rede:', error);
    });
}
