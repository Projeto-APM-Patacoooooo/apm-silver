function Editar(id, novoNome, NovoCNPJ, novaConta, novaAgencia){
    console.log(id)
    fetch('/editar/instituicao', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: Number(id),
            nome: novoNome,
            cnpj: NovoCNPJ,
            conta: Number(novaConta),
            agencia: Number(novaAgencia)
        })
        
      })
      .then(response => {
        if (response.ok) {
          console.log('Instituição editada com sucesso.');
          location.reload(); //Dando um F5 na página para atualizar a lista
        } else {
          console.error('Erro ao editar instituição.');
        }
      })
      .catch(error => {
        console.error('Erro de rede:', error);
      });
}

function EditarUrl(id, novoNome, NovoCNPJ, novaConta, novaAgencia) {
  console.log(id);
  fetch(`/editar/instituicao/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          nome: novoNome,
          cnpj: NovoCNPJ,
          conta: Number(novaConta),
          agencia: Number(novaAgencia)
      })
  })
  .then(response => {
      if (response.ok) {
          console.log('Instituição editada com sucesso.');
          location.reload();
      } else {
          console.error('Erro ao editar instituição.');
      }
  })
  .catch(error => {
      console.error('Erro de rede:', error);
  });
}
