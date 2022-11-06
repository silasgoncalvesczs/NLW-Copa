import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/:id/games', {
        onRequest: [authenticate],
    }, async (request) => {
        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc',
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: request.user.sub,
                            poolId: id,
                        }
                    }
                }
            }
        })

        return {
            games: games.map(game => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined,

                }
            })
        }
    })

    fastify.post('/game/create', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const createPoolBody = z.object({
            date: z.string(),
            firstTeamCountryCode: z.string(),
            secondTeamCountryCode: z.string(),
        })

        const { date } = createPoolBody.parse(request.body);
        const { firstTeamCountryCode } = createPoolBody.parse(request.body);
        const { secondTeamCountryCode } = createPoolBody.parse(request.body);

        await prisma.game.create({
            data: {
                date,
                firstTeamCountryCode,
                secondTeamCountryCode,
            }
        })

        return reply.status(201).send({
            message: 'Game create success.',
        })
    })
}

