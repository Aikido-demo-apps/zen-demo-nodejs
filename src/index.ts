import * as Zen from "@aikidosec/firewall"
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs';
import { exec } from 'child_process'
import { logger } from 'hono/logger'
import { promisify } from 'util'
import axios from 'axios'
import * as path from 'path'
import { DatabaseHelper, initDatabase, CommandRequest, RequestRequest, CreateRequest } from './database'
import {RouteTestLLM} from "./llm";

const execPromise = promisify(exec)

const app = new Hono()

// Enable logging
app.use(logger())

// Add Zen
app.use(async (c, next) => {
  const user = c.req.header('user');

  if (user) {
    const id = parseInt(user);
    Zen.setUser({
      id: id.toString(),
      name: getName(id)
    });
  } else {
    // Check for X-User-ID and X-User-Name headers
    const userId = c.req.header('X-User-ID');
    const userName = c.req.header('X-User-Name');

    if (userId && userName) {
      const id = parseInt(userId);
      Zen.setUser({
        id: id.toString(),
        name: userName
      });
    }
  }

  await next();
});

// Helper function to get name based on number
function getName(number: number) {
  const names = [
    "Hans",
    "Pablo",
    "Samuel",
    "Timo",
    "Tudor",
    "Willem",
    "Wout",
    "Yannis",
  ];

  // Use absolute value to handle negative numbers
  // Use modulo to wrap around the list
  const index = Math.abs(number) % names.length;
  return names[index];
}

// Initiate Zen middleware
Zen.addHonoMiddleware(app);

// Routes
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
    }, 500)
  }
})

app.post('/api/request', async (c) => {
  try {
    const { url } = await c.req.json()
    const response = await axios.get(url)

    return c.json({
      success: true,
      output: response.data
    })
  } catch (error: any) {
    return c.json({
      success: false,
      output: `Error: ${error.message || 'Unknown error'}`
    }, 500)
  }
})

app.get('/api/read', async (c) => {
  try {
    const filePath = c.req.query('path') || ""
    const fullPath = path.join('static/blogs/', filePath)

    return c.text(fs.readFileSync(fullPath, 'utf8'))
  } catch (error: any) {
    return c.json({
      success: false,
      output: `Error: ${error.message || 'Unknown error'}`
    }, 500)
  }
})

// Pet API routes
app.get('/api/pets/', async (c) => {
  const pets = await DatabaseHelper.getAllPets();
  return c.json(pets);
});

app.get('/api/pets/:id', async (c) => {
  const id = c.req.param('id');
  const pet = await DatabaseHelper.getPetById(id);
  return c.json(pet);
});

app.post('/api/create', async (c) => {
  try {
    const data = await c.req.json();
    const createRequest = { name: data.name };
    const rowsCreated = await DatabaseHelper.createPetByName(createRequest.name);

    if (rowsCreated === -1) {
      return c.text("Database error occurred", 500);
    }
    return c.text("Success!");
  } catch (error) {
    console.error("Error creating pet:", error);
    return c.text("Error processing request", 500);
  }
});

app.get('/clear', async (c) => {
  await DatabaseHelper.clearAll();
  return c.text("Cleared successfully.");
});

app.post('/test_llm', RouteTestLLM);

// Static files
app.use('*', serveStatic({ root: './static/public' }));

// Initialize database
try {
  initDatabase(app);
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Failed to initialize database:', error);
}

// Serve app
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
