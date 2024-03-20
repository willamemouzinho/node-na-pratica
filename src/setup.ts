import { postgres } from './lib/postgres'

async function setup() {
  await postgres.connect()

  await postgres.query(`
  CREATE TABLE IF NOT EXISTS short_links (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    original_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

  await postgres.end()

  console.log('Setup feito com sucesso!')
}

setup()
