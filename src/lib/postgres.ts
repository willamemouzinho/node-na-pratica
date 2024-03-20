import { Client, Pool } from 'pg'

// export const postgres = new Client({
//   user: 'docker',
//   host: 'localhost',
//   database: 'short_links',
//   password: 'docker',
//   port: 5432,
// })

export const postgres = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'short_links',
  password: 'docker',
  port: 5432,
  connectionTimeoutMillis: 5000,
})

//   console.log(await pool.query('SELECT NOW()'))
