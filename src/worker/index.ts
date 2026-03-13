// src/worker/index.ts
import { Hono } from "hono";

interface Env {
  SETTINGS_DB: D1Database;
  SETTINGS_KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// ===== SEARCH ENDPOINT =====
app.get("/api/search", async (c) => {
  // ✅ TAMBAH DEFAULT UNTUK QUERY
  const query = c.req.query('q') || '';
  
  if (!query.trim()) {
    return c.json({ error: 'Search query required' }, 400);
  }
  
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  
  try {
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
    
  } catch (error: any) {
    console.error('Search error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ===== GET USER BY ID =====
app.get("/api/user/:userId", async (c) => {
  // ✅ AMBIL PARAM DENGAN AMAN
  const userId = c.req.param('userId');
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 400);
  }
  
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  
  try {
    const session = c.env.SETTINGS_DB.withSession(clientBookmark);
    
    const user = await session.prepare(
      'SELECT userId, email, yourname, avatar FROM users WHERE userId = ?'
    ).bind(userId).first();
    
    const newBookmark = session.getBookmark();
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(user, 200, {
      'x-d1-bookmark': newBookmark
    });
    
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ===== CREATE USER =====
app.post("/api/users", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, email, yourname } = body;
    
    // ✅ VALIDASI INPUT
    if (!userId || !email) {
      return c.json({ error: 'userId and email required' }, 400);
    }
    
    const session = c.env.SETTINGS_DB.withSession('first-primary');
    
    await session.prepare(
      'INSERT INTO users (userId, email, yourname) VALUES (?, ?, ?)'
    ).bind(userId, email, yourname || email.split('@')[0]).run();
    
    const bookmark = session.getBookmark();
    
    return c.json({ success: true }, 200, {
      'x-d1-bookmark': bookmark
    });
    
  } catch (error: any) {
    console.error('Create user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ===== TEST API =====
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
