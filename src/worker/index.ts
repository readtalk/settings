import { Hono } from "hono";

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// ===== SEARCH ENDPOINT BOOKMARK =====
app.get("/api/search", async (c) => {
  const query = c.req.query('q');
  if (!query) return c.json({ error: 'Query required' }, 400);
  
  // bookmark header (frontend)
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  
  // session bookmark
  const session = c.env.SETTINGS_DB.withSession(clientBookmark);
  
  try {
    // Query pencarian
    const { results } = await session.prepare(
      `SELECT userId, email, yourname, avatar 
       FROM users 
       WHERE yourname LIKE ? OR email LIKE ? 
       LIMIT 20`
    ).bind(`%${query}%`, `%${query}%`).all();    
    
    const newBookmark = session.getBookmark();
    
    // Return + bookmark header
    return c.json(results, 200, {
      'x-d1-bookmark': newBookmark
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
});

// ===== CREATE USER (WRITE) =====
app.post("/api/users", async (c) => {
  const { userId, email, yourname } = await c.req.json();
  
  // primary database
  const session = c.env.SETTINGS_DB.withSession('first-primary');
  
  try {
    await session.prepare(
      'INSERT INTO users (userId, email, yourname) VALUES (?, ?, ?)'
    ).bind(userId, email, yourname).run();
    
    const bookmark = session.getBookmark();
    
    return c.json({ success: true }, 200, {
      'x-d1-bookmark': bookmark
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ===== GET USER BY ID =====
app.get("/api/user/:userId", async (c) => {
  const userId = c.req.param('userId');
  const bookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  
  const session = c.env.SETTINGS_DB.withSession(bookmark);
  
  const user = await session.prepare(
    'SELECT userId, email, yourname, avatar FROM users WHERE userId = ?'
  ).bind(userId).first();
  
  const newBookmark = session.getBookmark();
  
  return c.json(user || null, 200, {
    'x-d1-bookmark': newBookmark
  });
});

// ===== API =====
app.get("/api/", (c) => c.json({ name: "Search" }));

export default app;
