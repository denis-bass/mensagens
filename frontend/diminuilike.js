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
    recuperaQtde()
}

async function recuperaQtde() {
    const idSelecionado = document.getElementById("idSelecionado").value
    const mensagem = await fetch(`http://localhost:3333/mensagem/${idSelecionado}`)
    .then(resp => {
        return resp.json()
    })
    .catch(error => {
        alert('Problema na consulta')
    })
    document.getElementById("qtde").innerHTML = mensagem.qtdeLikes
}

async function diminuiLike(){
    const id = document.getElementById("idSelecionado").value
    const qtdeLikes = Number(document.getElementById("qtdeLikes").value)
    const envia = {id, qtdeLikes}
    const resp = await fetch('http://localhost:3333/mensagem/diminuilike', {
        method: 'PATCH',
        body: JSON.stringify(envia),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
    .then(resp => {
        return resp.json()
    }) 
    alert(resp.status)
    recuperaQtde()
}