import {z} from 'zod'
import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'

export async function AppRoutes(server: FastifyInstance) {
    // rota para consultar todos os mensagens no banco de dados
    // como vai consultar BD, a função tem que ser assíncrona
    server.get('/mensagens', async () => {
        // await aguarda a resposta do BD
        const mensagens = await prisma.mensagem.findMany()
        return mensagens
    })

    // rota para consultar os mensagens que iniciam a descrição com uma palavra
    // enviada pelo frontend (na variável request)
    server.get('/mensagem/:id', async (request) => {
        // precisamos utilizar um esquema de tipo de dados para tratar tipo recebido do usuário
        // dependência ZOD
        // criando o objeto ZOD para a descrição
        const idParam = z.object({
            id: z.string().uuid()
        })
        // obtem o valor de titulo no parâmetro da rota
        const {id} = idParam.parse(request.params)
        // faz a consulta no banco de dados
        // select * from mensagem where titulo = %titulo
        const mensagem = prisma.mensagem.findFirst({
            where: {
                id
            }
        })
        return mensagem
    })

    // cria rota para inserir mensagem
    server.post('/mensagem', async (request) => {
            // cria objeto zod para definir esquema de dados do frontend
            const mensagemBody = z.object({
                titulo: z.string(),
                conteudo: z.string(),
                qtdeLikes: z.number(),
                publicado: z.boolean()
            })
            // recupera os dados do frontend
            const {titulo, conteudo, qtdeLikes,publicado} = mensagemBody.parse(request.body)
            // insere o mensagem no banco de dados
            const newMensagem = prisma.mensagem.create({
                data: {
                    titulo: titulo,
                    conteudo: conteudo,
                    qtdeLikes: qtdeLikes,
                    publicado: publicado
                }
            })
            return newMensagem
    })

    // aumenta a quantidade de likes da mensagem
    server.patch('/mensagem/aumentalike', async (request) => {
        // cria objeto zod
        const aumentalikeBody = z.object({
            id: z.string().uuid(),
            qtdeLikes: z.number()
        })
        // recupera dados do frontend
        const {id, qtdeLikes} = aumentalikeBody.parse(request.body)
        // atualiza o qtdeLikes
        const mensagemUpdated = await prisma.mensagem.update({
            where: {
                id: id
            },
            data: {
                qtdeLikes: {
                    increment: qtdeLikes
                }
            }
        })
        return mensagemUpdated
    })

    // diminui a quantidade de likes da mensagem
    server.patch('/mensagem/diminuilike', async (request) => {
        // cria objeto zod para recuperar os dados
        const diminuilikeBody = z.object({
            id: z.string().uuid(),
            qtdeLikes: z.number()
        })
        // recupera os dados do frontend
        const {id, qtdeLikes} = diminuilikeBody.parse(request.body)
        // atualiza a quantidade de likes da mensagem
        const resp = await prisma.mensagem.updateMany({
            where: {
                id: id,
                qtdeLikes: {
                    gte: qtdeLikes
                }
            },
            data: {
                qtdeLikes: {
                    decrement: qtdeLikes
                }
            }
        })
        if (resp.count >= 1){
            let aux = {
                "status": "Like removido da mensagem :("
            }
            return aux
        }
        else {
            let aux = {
                "status": "Mensagem sem likes, não é possível remover mais likes"
            }
            return aux
        }
    })

    // rota para publicar a mensagem
    server.patch('/mensagem/publicar', async (request) => {
        // cria objeto zod para recuperar os dados
        const publicarBody = z.object({
            id: z.string().uuid()
        })
        // recupera os dados do frontend
        const {id} = publicarBody.parse(request.body)
        // atualiza a quantidade de likes da mensagem
        const resp = await prisma.mensagem.updateMany({
            where: {
                id: id,
                publicado: false
            },
            data: {
                publicado: true
            }
        })
        if (resp.count >= 1){
            let aux = {
                "status": "Mensagem publicada com sucesso"
            }
            return aux
        }
        else {
            let aux = {
                "status": "Mensagem já estava publicada anteriormente"
            }
            return aux
        }
    })

    // rota para remover a publicação
    server.patch('/mensagem/despublicar', async (request) => {
        // cria objeto zod para recuperar os dados
        const despublicarBody = z.object({
            id: z.string().uuid()
        })
        // recupera os dados do frontend
        const {id} = despublicarBody.parse(request.body)
        // atualiza a quantidade de likes da mensagem
        const resp = await prisma.mensagem.updateMany({
            where: {
                id: id,
                publicado: true
            },
            data: {
                publicado: false
            }
        })
        if (resp.count >= 1){
            let aux = {
                "status": "Mensagem despublicada com sucesso"
            }
            return aux
        }
        else {
            let aux = {
                "status": "Mensagem já estava despublicada anteriormente"
            }
            return aux
        }
    })

    // rota para atualizar uma mensagem
    server.put('/mensagem/id/:id', async (request) => {
        // objeto zod para o id
        const idParam = z.object({
            id: z.string().uuid()
        })
        // objeto zod para o body
        const putBody = z.object({
            titulo: z.string(),
            qtdeLikes: z.number(),
            conteudo: z.string(),
            publicado: z.boolean()
        })
        // recupera dados do frontend com o params
        const {id} = idParam.parse(request.params)
        // recupera dados do frontend com o body
        const {titulo, qtdeLikes, conteudo, publicado} = putBody.parse(request.body)
        // atualiza o mensagem no banco de dados
        const mensagemUpdated = await prisma.mensagem.update({
            where: {
                id: id
            },
            data: {
                titulo,
                qtdeLikes,
                conteudo,
                publicado
            }
        })
        return mensagemUpdated
    })

    // rota para remover uma mensagem
    server.delete('/mensagem/id/:id', async (request) => {
        // objeto zod para o id
        const idParam = z.object({
            id: z.string().uuid()
        })
        // recupera dados do frontend com o params
        const {id} = idParam.parse(request.params)
        // deleta mensagem do banco de dados
        const mensagemRemoved = await prisma.mensagem.delete({
            where: {
                id
            }
        })
        return mensagemRemoved
    })

}