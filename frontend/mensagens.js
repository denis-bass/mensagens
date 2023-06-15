// quem a chama não precisa aguardar a resposta para processar outra atividade
async function consultaMensagens(){
    // consome API no backend com verbo GET /product
    // é preciso esperar uma resposta para continuar
    const mensagens = await fetch('http://localhost:3333/mensagens')
        .then( resposta => { // quando trouxe a resposta
            return resposta.json() // retorna os dados do servidor
        })
        .catch( error => {
            alert('Erro ao consultar')
        })
    
    // vamos percorrer o vetor produtos e jogar na tabela
    let linhasTabela = ''
    mensagens.forEach(mensagem => {
        linhasTabela += `
        <tr>
            <td> ${mensagem.titulo} </td> <td> ${mensagem.conteudo} </td> <td> ${mensagem.qtdeLikes} </td> <td> ${mensagem.publicado} </td>
            <td> <div onclick="aumentaLike('${mensagem.id}')"> <i class="bi bi-hand-thumbs-up"></i> </div> </td>
            <td> <div onclick="diminuiLike('${mensagem.id}')"> <i class="bi bi-hand-thumbs-down"></i> </div> </td>
            <td> <div onclick="publicaMensagem('${mensagem.id}')"> <i class="bi bi-file-arrow-up"></i> </div> </td>
            <td> <div onclick="despublicaMensagem('${mensagem.id}')"> <i class="bi bi-file-arrow-down"></i> </div> </td>
            <td> <div onclick="remover('${mensagem.id}')"> <i class="bi bi-trash"></i> </div> </td>
            <td> <div onclick="editar('${mensagem.id}', '${mensagem.titulo}', '${mensagem.conteudo}', '${mensagem.qtdeLikes}', '${mensagem.publicado}')" <i class="bi bi-pencil"></i> </div> </td>
        </tr>`
    })
    // vamos colocar o conteúdo na tabela
    document.getElementById("linhasTabela").innerHTML = linhasTabela
}

function editar(id, titulo, conteudo, qtdeLikes, publicado){
    document.getElementById("titulo").value = titulo
    document.getElementById("conteudo").value = conteudo
    document.getElementById("qtdeLikes").value = qtdeLikes
    document.getElementById("id").value = id
    document.getElementById("publicado").checked = new Boolean(publicado)
    //else document.getElementById("publicado").checked = true
}
async function aumentaLike(id){
    const qtdeLikes =  1
    const corpo = {id, qtdeLikes}
    const likeUp = await fetch('http://localhost:3333/mensagem/aumentalike', {
        method: 'PATCH',
        body: JSON.stringify(corpo),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    consultaMensagens()
}

async function diminuiLike(id){
    const qtdeLikes =  1
    const corpo = {id, qtdeLikes}
    const likeDown = await fetch('http://localhost:3333/mensagem/diminuilike', {
        method: 'PATCH',
        body: JSON.stringify(corpo),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    consultaMensagens()
}

async function publicaMensagem(id){
    const qtdeLikes =  1
    const corpo = {id}
    const publica = await fetch('http://localhost:3333/mensagem/publicar', {
        method: 'PATCH',
        body: JSON.stringify(corpo),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    consultaMensagens()
}

async function despublicaMensagem(id){
    const qtdeLikes =  1
    const corpo = {id}
    const publica = await fetch('http://localhost:3333/mensagem/despublicar', {
        method: 'PATCH',
        body: JSON.stringify(corpo),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    consultaMensagens()
}


async function remover(id){
    const confirma = confirm('Deseja realmente apagar esta mensagem?')
    if (!confirma){
        return // sai da função e não remove
    }
    // quer remover
    await fetch(`http://localhost:3333/mensagem/id/${id}`, {
        method: 'DELETE'
    })
    .then(resposta => {
        alert('Mensagem apagada')
    })
    .catch(erro => {
        alert('Não foi possível apagar a mensagem')
    })
    // atualizar tabela
    consultaMensagens()
}

async function cadastrarMensagem(){
    // recupera os dados do formulário
    const titulo = document.getElementById("titulo").value
    const conteudo = document.getElementById("conteudo").value
    const qtdeLikes = Number(document.getElementById("qtdeLikes").value)
    const publicado = document.getElementById("publicado").checked
    const id = document.getElementById("id").value
    let metodo
    let url
    if (id) { // tem o id
        metodo = 'PUT'
        url = `http://localhost:3333/mensagem/id/${id}` 
        //document.getElementById("id").value = ''
    }
    else {
        metodo = 'POST'
        url = `http://localhost:3333/mensagem`
    }
    // mostra o objeto json
    const mensagem = {titulo, conteudo, qtdeLikes, publicado}
    // consome a api - verbo é post
    const novaMensagem = await fetch(url, {
        method: metodo,
        body: JSON.stringify(mensagem),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    .then(resposta => {
        alert('Operação foi realizada com sucesso')
    })
    .catch(error => {
        alert('Erro durante a tentativa')
    })
    // atualiza a tabela no frontend
    consultaMensagens()
    document.getElementById("id").value = ''
    document.getElementById("titulo").value = ''
    document.getElementById("conteudo").value = ''
    document.getElementById("qtdeLikes").value = ''
    document.getElementById("publicado").checked = false
}