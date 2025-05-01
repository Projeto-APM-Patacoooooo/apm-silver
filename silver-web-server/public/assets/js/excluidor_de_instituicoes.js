function IniciarExclusao(id){
    alertar(id)
}

function Excluir(id){
    fetch('/excluir/instituicao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id}) // Enviando o ID no corpo
      })
      .then(response => {
        if (response.ok) {
          console.log('Instituição excluída com sucesso.');
        } else {
          console.error('Erro ao excluir instituição.');
        }
      })
      .catch(error => {
        console.error('Erro de rede:', error);
      });
}

function alertar(id){
    var txt;
    if(confirm("Você tem certeza que deseja excluir permanentemente esta instituição?")){
        Excluir(id)
    } else {
        return
    }
}
