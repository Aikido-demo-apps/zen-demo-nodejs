import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs';
import { exec } from 'child_process'
import { logger } from 'hono/logger'
import { promisify } from 'util'
import "@aikidosec/firewall";

const execPromise = promisify(exec)

const app = new Hono()

// Enable logging
app.use(logger())

// Add Zen
app.use(async (c, next) => {
  // Get the user from your authentication middleware
  // or wherever you store the user
//  Zen.setUser({
//    id: "123",
//    name: "John Doe", // Optional
//  });

  await next();
});
Zen.addHonoMiddleware(app);

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

app.post('/api/execute', async (c) => {
  try {
    const { userCommand } = await c.req.json()
    const { stdout, stderr } = await execPromise(userCommand)
    const output = stdout || stderr

    return c.json({ success: true, output })
  } catch (error: any) {
    return c.json({
      success: false,
      output: `Error: ${error.message || 'Unknown error'}`
    })
  }
})

app.use('*', serveStatic({ root: './static/public' }));

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
