function IniciarExclusao(id){
    alertar(id)
}

function Excluir(id){
    fetch('/excluir/sumula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id}) // Enviando o ID no corpo
      })
      .then(response => {
        if (response.ok) {
          console.log('Súmula excluída com sucesso.');
          location.reload(); //Dando um F5 na página para atualizar a lista
        } else {
          console.error('Erro ao excluir súmula.');
        }
      })
      .catch(error => {
        console.error('Erro de rede:', error);
      });
}

function alertar(id){
    var txt;
    if(confirm("Você tem certeza que deseja excluir permanentemente esta súmula?")){
        Excluir(id)
    } else {
        return
    }
}
