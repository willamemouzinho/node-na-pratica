import fastify from 'fastify'
import { createShortLink } from './routes/create-short-link'
import { getMetrics } from './routes/get-metrics'
import { getShortLinks } from './routes/get-short-links'
import { redirectToOriginalUrl } from './routes/redirect-to-orinal-url'

const app = fastify()

app.post('/api/links', createShortLink)
app.get('/api/links', getShortLinks)
app.get('/api/metrics', getMetrics)
app.get('/:code', redirectToOriginalUrl)

const start = async () => {
  try {
    await app.listen({ port: 3333, host: 'localhost' })
    console.log('Servidor rodando na porta 3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
