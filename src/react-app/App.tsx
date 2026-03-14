// src/App.tsx
import { useState, useEffect } from 'react';

import CloudflareLogo from './assets/Cloudflare_Logo.svg';
import SearchIcon from './assets/search.svg';
import UsersIcon from './assets/users.svg';
import SettingsIcon from './assets/settings.svg';
import EnvelopeIcon from './assets/envelope.svg';
import UserAddIcon from './assets/user-add.svg';
// tambahkan icon lain jika perlu: camera, trash, share, dll

import './App.css';           // ← semua style di sini (atau pakai CSS Modules / Tailwind)

interface ResendItem {
  id: string;
  name: string;
  preview: string;           // potongan pesan terakhir atau alasan gagal
  time: string;
  avatar?: string;           // optional custom avatar
  status?: 'pending' | 'failed' | 'sent';
  unread?: number;
}

function App() {
  const [items, setItems] = useState<ResendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  // Ambil user dari query string (dari parent / auth flow)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('userId');
    const eml = params.get('email');

    if (uid) setUserId(uid);
    if (eml) setEmail(eml);
  }, []);

  // Fetch daftar resend / chat
  useEffect(() => {
    const fetchResendList = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/resend-list'); // sesuaikan endpoint Hono kamu
        if (!res.ok) throw new Error('Gagal load data');
        const data: ResendItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        // bisa tambah state error jika mau
      } finally {
        setLoading(false);
      }
    };

    fetchResendList();
  }, []);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev');
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <img src={CloudflareLogo} alt="Cloudflare" className="logo-small" />
          <h1>ResendList</h1>
        </div>
        <div className="header-actions">
          <button className="icon-button" title="New group / broadcast">
            <img src={UsersIcon} alt="Users" />
          </button>
          <button className="icon-button" title="Settings">
            <img src={SettingsIcon} alt="Settings" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="search-bar">
        <div className="search-wrapper">
          <img src={SearchIcon} alt="" className="search-icon" />
          <input
            type="search"
            placeholder="Cari nama atau pesan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* User info (jika ada) */}
      {userId && email && (
        <div className="user-info-card">
          <p>
            <strong>User:</strong> {userId.slice(0, 8)}... | {email}
          </p>
        </div>
      )}

      {/* Daftar item */}
      <main className="list-container">
        {loading ? (
          <div className="loading">Memuat daftar pengiriman ulang...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <img src={EnvelopeIcon} alt="Envelope" className="empty-icon" />
            <p>Tidak ada item untuk dikirim ulang</p>
          </div>
        ) : (
          <ul className="resend-list">
            {filtered.map(item => (
              <li key={item.id} className="resend-item">
                <div className="avatar-area">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-fallback">{item.name.charAt(0)}</div>
                  )}
                </div>

                <div className="content-area">
                  <div className="top-row">
                    <h3 className="name">{item.name}</h3>
                    <span className="time">{item.time}</span>
                  </div>
                  <p className="preview">{item.preview}</p>
                </div>

                <div className="status-area">
                  {item.unread ? (
                    <span className="badge">{item.unread}</span>
                  ) : null}
                  <span className={`status-dot ${item.status || 'pending'}`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Logout tetap ada */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* FAB jika mau tambah action cepat */}
      <button className="fab">
        <img src={UserAddIcon} alt="Tambah" />
      </button>
    </div>
  );
}

export default App;
