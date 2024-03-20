import { postgres } from '@/lib/postgres'

import type { FastifyReply, FastifyRequest } from 'fastify'
import { DatabaseError } from 'pg'
import { ZodError, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export async function createShortLink(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  try {
    const { code, url } = bodySchema.parse(request.body)

    const query = {
      text: `
      INSERT INTO short_links (code, original_url)
      VALUES ($1, $2)
      RETURNING id
    `,
      values: [code, url],
    }
    // await postgres.connect()
    const result = await postgres.query(query)
    // await postgres.end()
    const link = result.rows[0]

    return reply.status(201).send({ shortLinkId: link.id })
  } catch (err) {
    if (err instanceof DatabaseError) {
      if (err.code === '23505') {
        return reply.code(400).send({ message: 'Duplicated code!' })
      }
    }

    if (err instanceof ZodError) {
      const validationError = fromZodError(err)
      return reply.status(400).send({ message: validationError.toString() })
    }

    console.error(err)
    return reply.status(500).send({ message: 'Internal error.' })
  }
}
