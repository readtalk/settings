// src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';           // ← taruh semua style di sini atau gunakan CSS Modules / Tailwind

// Dummy / contoh tipe data (sesuaikan dengan response API kamu nanti)
interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  avatarUrl?: string;
  isGroup?: boolean;
  unreadCount?: number;
  status?: 'online' | 'offline' | 'typing';
}

// Komponen utama
function App() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulasi fetch data dari Hono API di Cloudflare
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // Ganti endpoint sesuai route Hono kamu
        const res = await fetch('/api/chats');
        if (!res.ok) throw new Error('Gagal mengambil data');
        
        const data: ChatItem[] = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        // Optional: tampilkan pesan error ke user
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <img 
            src="/Cloudflare_Logo.svg" 
            alt="Cloudflare" 
            className="cloudflare-logo" 
          />
          <h1>READTalk</h1>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="New group">
            <img src="/users.svg" alt="Add users" />
          </button>
          <button className="icon-btn" title="Settings">
            <img src="/settings.svg" alt="Settings" />
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <img src="/search.svg" alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Cari atau mulai chat baru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Daftar chat */}
      <main className="chat-list-container">
        {loading ? (
          <div className="loading-state">
            Memuat daftar chat...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="empty-state">
            <p>Not Found</p>
          </div>
        ) : (
          <ul className="chat-list">
            {filteredChats.map((chat) => (
              <li key={chat.id} className="chat-item">
                <div className="avatar-wrapper">
                  {chat.avatarUrl ? (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      className="chat-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {chat.isGroup && (
                    <span className="group-indicator">👥</span>
                  )}
                </div>

                <div className="chat-info">
                  <div className="chat-header">
                    <h3 className="chat-name">
                      {chat.name}
                      {chat.unreadCount ? (
                        <span className="unread-badge">{chat.unreadCount}</span>
                      ) : null}
                    </h3>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <p className="last-message">{chat.message}</p>
                </div>

                {chat.status && (
                  <span className={`status-dot ${chat.status}`} />
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Floating action button (opsional) */}
      <button className="fab">
        <img src="/envelope.svg" alt="New message" />
      </button>
    </div>
  );
}

export default App;
