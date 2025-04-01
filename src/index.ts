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

app.get('/pages/create', (c) => {
  return c.html(fs.readFileSync('static/create.html', 'utf8'));
})

app.get('/pages/execute', (c) => {
  return c.html(fs.readFileSync('static/execute_command.html', 'utf8'));
})

app.get('/pages/read', (c) => {
  return c.html(fs.readFileSync('static/read_file.html', 'utf8'));
})

app.get('/pages/request', (c) => {
  return c.html(fs.readFileSync('static/request.html', 'utf8'));
})

app.get('/test_ratelimiting_1', (c) => {
  return c.text("Request successful (Ratelimiting 1)")
})

app.get('/test_ratelimiting_2', (c) => {
  return c.text("Request successful (Ratelimiting 2)")
})

app.get('/test_bot_blocking', (c) => {
  return c.text("Hello World! Bot blocking enabled on this route.")
})

app.get('/test_user_blocking', (c) => {
  return c.text("Hello User with id: " + c.req.header('user'))
})

app.use('*', serveStatic({ root: './static/public' }));

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
