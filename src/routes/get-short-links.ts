import { postgres } from '@/lib/postgres'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { DatabaseError } from 'pg'
import { z } from 'zod'

export async function getShortLinks(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const query = {
      text: `
      SELECT *
      FROM short_links
      ORDER BY created_at DESC
    `,
    }
    const result = await postgres.query(query)
    const links = result.rows

    return reply.status(201).send({ links })
  } catch (err) {
    if (err instanceof DatabaseError) {
      return reply.code(400).send({ message: 'DB error' })
    }

    console.error(err)
    return reply.status(500).send({ message: 'Internal error.' })
  }
}
