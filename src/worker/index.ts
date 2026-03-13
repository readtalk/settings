import { Hono } from "hono";

// 1. Interface Env harus cocok dengan binding di wrangler.json
interface Env {
  SETTINGS_DB: D1Database; // ← Binding Anda sesuai dokumen
}

const app = new Hono<{ Bindings: Env }>();

// 2. Endpoint search dengan akses ke D1 via c.env.SETTINGS_DB
app.get("/api/search", async (c) => {
  // Ambil query dari URL
  const query = c.req.query('q');
  if (!query) {
    return c.json({ error: 'Missing search query' }, 400);
  }

  // Ambil bookmark dari header untuk konsistensi data
  const clientBookmark = c.req.header('x-d1-bookmark') || 'first-unconstrained';

  try {
    // Buat session D1 dengan bookmark
    const session = c.env.SETTINGS_DB.withSession(clientBookmark);

    // Eksekusi query pencarian (pastikan tabel users sudah ada)
    const { results } = await session.prepare(
      `SELECT userId, email, yourname, avatar
       FROM users
       WHERE yourname LIKE ? OR email LIKE ?
       LIMIT 20`
    ).bind(`%${query}%`, `%${query}%`).all();

    // Dapatkan bookmark baru untuk respons
    const newBookmark = session.getBookmark();

    // Kembalikan hasil + bookmark baru di header
    return c.json(results, 200, {
      'x-d1-bookmark': newBookmark
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return c.json({ 
      error: 'Search failed', 
      details: error.message 
    }, 500);
  }
});

// 3. Endpoint untuk mengambil data user (contoh lain)
app.get("/api/user/:userId", async (c) => {
  const userId = c.req.param('userId');
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

export default app;
