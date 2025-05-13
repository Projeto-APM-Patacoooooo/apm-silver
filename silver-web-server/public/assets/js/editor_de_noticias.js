function Editar(id, titulo, conteudo){
    console.log(id)
    fetch('/editar/noticia', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: Number(id),
            titulo: titulo,
            conteudo: conteudo
        })
        
      })
      .then(response => {
        if (response.ok) {
          console.log('Noticia editada com sucesso.');
          location.reload(); //Dando um F5 na página para atualizar a lista
        } else {
          console.error('Erro ao editar noticia.');
        }
      })
      .catch(error => {
        console.error('Erro de rede:', error);
      });
}

function EditarUrl(id, titulo, conteudo) {
  console.log(id);
  fetch(`/editar/noticia/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Number(id),
        titulo: titulo,
        conteudo: conteudo
      })
  })
  .then(response => {
      if (response.ok) {
          console.log('Noticia editada com sucesso.');
          location.reload();
      } else {
          console.error('Erro ao editar noticia.');
      }
      window.location = "/dashboard/noticias"
  })
  .catch(error => {
      console.error('Erro de rede:', error);
  });
}
