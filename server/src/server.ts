import Fastify from "fastify";
import cors from '@fastify/cors';

import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
const PORT = 3333;

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        //trocar para o dominio final de uso em produção
        origin: true,
    })

    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(userRoutes)

    await fastify.listen({ port: PORT, host: '0.0.0.0' })
}

bootstrap();