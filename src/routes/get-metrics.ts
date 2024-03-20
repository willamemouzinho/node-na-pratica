import { redis } from '@/lib/redis'

import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getMetrics(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await redis.connect()
    const result = await redis.zRangeByScoreWithScores('metrics', 0, 50)
    const metrics = result
      .sort((a, b) => b.score - a.score)
      .map((item) => {
        return {
          shortLinkCode: item.value,
          clicks: item.score,
        }
      })

    return reply.status(200).send({ metrics })
  } catch (err) {
    // if (err instanceof DatabaseError) {
    //   if (err.code === '23505') {
    //     return reply.code(400).send({ message: 'Duplicated code!' })
    //   }
    // }

    console.error(err)
    return reply.status(500).send({ message: 'Internal error.' })
  }
}
