import { postgres } from '@/lib/postgres'
import { redis } from '@/lib/redis'

import type { FastifyReply, FastifyRequest } from 'fastify'
import { DatabaseError } from 'pg'
import { ZodError, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

interface SelectLinkQueryResult {
  id: string
  code: string
  original_url: string
}

export async function redirectToOriginalUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    code: z.string().min(3),
  })

  try {
    const { code } = paramsSchema.parse(request.params)

    const query = {
      text: `
      SELECT id, code, original_url
      FROM short_links
      WHERE short_links.code = $1
    `,
      values: [code],
    }
    // await postgres.connect()
    const result = await postgres.query(query)
    // await postgres.end()
    if (result.rows.length === 0) {
      return reply.status(404).send({ message: 'Link not found.' })
    }
    const link: SelectLinkQueryResult = result.rows[0]

    await redis.connect()
    await redis.zIncrBy('metrics', 1, String(link.code))

    return reply.redirect(301, link.original_url)
  } catch (err) {
    if (err instanceof DatabaseError) {
      //   if (err.code === '23505') {
      //     return reply.code(400).send({ message: 'Duplicated code!' })
      //   }
    }

    if (err instanceof ZodError) {
      const validationError = fromZodError(err)
      return reply.status(400).send({ message: validationError.toString() })
    }

    console.error(err)
    return reply.status(500).send({ message: 'Internal error.' })
  }
}
