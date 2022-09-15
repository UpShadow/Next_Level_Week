import express  from 'express'

import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient({
    log: ['query'],
});

/**
 * Query: localhost:3333/ads?page=2 "persistir estado"
 * Route: localhost:3333/ads/5 localhost:3333/ads/how-to-create-a-api-in-node
 * Body: usually for register forms
 */

// HTTP methods / API RESTful / HTTP Codes

// async/await

//Listagem de games com contagem de anúncios
app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            
        }
    })// async function

    return response.json(games);
});

//Criação de novo anúncio 
app.post('/ads', (request, response) => {
    return response.status(201).json([]);
});

//Listagem de anúncios por game
app.get('/games/:id/ads', (request, response) => {
    // const gameId = request.params.id; // url id access

    return response.send([
        { id: 1, name: 'Anúncio 1'},
        { id: 2, name: 'Anúncio 2'},
        { id: 3, name: 'Anúncio 3'},
        { id: 4, name: 'Anúncio 4'},
        { id: 5, name: 'Anúncio 5'},
    ])
});

//Buscar discord pelo ID do anúncio
app.get('ads/:id/discord', (request, response) => {
    //const adId =  resquest.params.id
    return response.json([]);
});

app.listen(3333)