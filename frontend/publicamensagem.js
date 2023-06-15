async function consultaMensagens(){
    let mensagens = await fetch('http://localhost:3333/mensagens')
        .then( resp => {
            return resp.json()
        })
        .catch( error => {
            alert('Erro ao buscar mensagens')
        })
    let saida = ''    
    mensagens.forEach(mensagem => {
        saida += `<option value="${mensagem.id}"> ${mensagem.titulo} </option>`
    })
    document.getElementById("idSelecionado").innerHTML = saida
}

async function publicaMensagem(idMensagem){
    // recupera os dados do formulário
    const id = document.getElementById("idSelecionado").value
    if(!id) id = idMensagem
    const corpo = {id}
    const publica = await fetch('http://localhost:3333/mensagem/publicar', {
                method: 'PATCH',
                body: JSON.stringify(corpo),
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                }
            })
            .then (resp => {
                return resp.json()
            })
            
    alert('Mensagem publicada com sucesso!')
}