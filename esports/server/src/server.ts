import express  from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'

const app = express()
app.use(express.json()) //making express understand json
app.use(cors())

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
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games);
});// async function

//Criação de novo anúncio 
app.post('/games/:id/ads', async (request, response) => { //Request Body: usually for register forms
    const gameId = request.params.id;
    const body = request.body

    // Validations here 

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearPlaying: body.yearPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return response.status(201).json(ad);
});// async function

//Listagem de anúncios por game
app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id; // url id access

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        where: {
            gameId, //gameId: gameId  how name is equal, use only gameId,
        },
    })

    return response.send(ads.map(ad => {
        return {
            ...ad, //spread operator
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd : convertMinutesToHourString(ad.hourEnd),
        }
    }))
});// async function

//Buscar discord pelo ID do anúncio
app.get('/ads/:id/discord', async (request, response) => {
    const adId =  request.params.id
    
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    
    return response.json({
        discord: ad.discord,
    });
});// async function

app.listen(3333)