// src/worker/index.ts
import { Hono } from "hono";

interface Env {
  SETTINGS_DB: D1Database;
  SETTINGS_KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/api/search", async (c) => {
  
  const query = c.req.query('q') || '';
  
  if (!query) {
    return c.json({ error: 'Query parameter q is required' }, 400);
  }
  
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  const session = c.env.SETTINGS_DB.withSession(clientBookmark);
  
  const { results } = await session.prepare(
    `SELECT userId, email, yourname, avatar 
     FROM users 
     WHERE yourname LIKE ? OR email LIKE ? 
     LIMIT 20`
  ).bind(`%${query}%`, `%${query}%`).all();
  
  const newBookmark = session.getBookmark();
  
  return c.json(results, 200, {
    'x-d1-bookmark': newBookmark
  });
});

export default app;
