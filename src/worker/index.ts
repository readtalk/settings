import { Hono } from "hono";

// ✅ SESUAIKAN DENGAN WRANGLER.JSON
interface Env {
  SETTINGS_DB: D1Database;  // ← SAMA! SETTINGS_DB
  SETTINGS_KV: KVNamespace;  // ← Tambahin juga kalau perlu
}

const app = new Hono<{ Bindings: Env }>();

// ✅ PAKAI SETTINGS_DB (bukan DB)
app.get("/api/search", async (c) => {
  const query = c.req.query('q');
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';
  
  const session = c.env.SETTINGS_DB.withSession(clientBookmark);  // ← INI!
  
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

// ✅ PAKAI SETTINGS_KV kalau perlu
app.get("/api/kv-test", async (c) => {
  const value = await c.env.SETTINGS_KV.get('test-key');
  return c.json({ value });
});

export default app;
