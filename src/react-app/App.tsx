// src/App.tsx
import { useState, useEffect } from 'react';

import CloudflareLogo from './assets/Cloudflare_Logo.svg';
import SearchIcon from './assets/search.svg';
import UsersIcon from './assets/users.svg';
import SettingsIcon from './assets/settings.svg';
import EnvelopeIcon from './assets/envelope.svg';

import './App.css';

interface ResendItem {
  id: string;
  name: string;
  preview: string;
  time: string;
  status?: 'pending' | 'failed' | 'sent';
}

function App() {
  const [items, setItems] = useState<ResendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Simulasi fetch (ganti dengan fetch real ke /api/resend-list)
    setTimeout(() => {
      setItems([]); // kosong → tampil empty state
      setLoading(false);
    }, 800);
  }, []);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <img src={CloudflareLogo} alt="" className="logo-cloudflare" />
          <h1>ResendList</h1>
        </div>
        <div className="header-right">
          <button className="header-btn"><img src={UsersIcon} alt="Users" /></button>
          <button className="header-btn"><img src={SettingsIcon} alt="Settings" /></button>
        </div>
      </header>

      <div className="search-container">
        <div className="search-inner">
          <img src={SearchIcon} alt="" className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      <main className="main-content">
        {loading ? (
          <div className="loading">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-view">
            <img src={EnvelopeIcon} alt="No items" className="empty-envelope" />
            <p className="empty-text">Tidak ada item untuk dikirim ulang</p>
          </div>
        ) : (
          <ul className="list">
            {/* Item akan muncul di sini kalau ada data */}
          </ul>
        )}
      </main>

      <footer className="footer">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </footer>
    </div>
  );
}

export default App;
