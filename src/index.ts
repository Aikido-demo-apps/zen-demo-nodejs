import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs';
import { logger } from 'hono/logger'

const app = new Hono()
app.use(logger())

app.get('/', (c) => {
  return c.html(fs.readFileSync('static/index.html', 'utf8'));
})

app.use('*', serveStatic({ root: './static/public' }));

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
