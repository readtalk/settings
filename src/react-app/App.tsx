// src/App.tsx
import { useState, useEffect } from 'react';

import CloudflareLogo from './assets/Cloudflare_Logo.svg';
import SearchIcon from './assets/search.svg';
import UsersIcon from './assets/users.svg';
import SettingsIcon from './assets/settings.svg';
import EnvelopeIcon from './assets/envelope.svg';
import UserAddIcon from './assets/user-add.svg'; // untuk FAB jika perlu

import './App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  // nanti bisa tambah state chats/resend items kalau sudah ada API

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get('userId') || '');
    setEmail(params.get('email') || '');
  }, []);

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev');
  };

  return (
    <div className="whatsapp-layout">
      {/* Header (mirip WhatsApp: logo kecil + title + icons kanan) */}
      <header className="whatsapp-header">
        <div className="header-brand">
          <img src={CloudflareLogo} alt="CF" className="header-logo" />
          <h1 className="header-title">ResendList</h1>
        </div>
        <div className="header-icons">
          <button className="icon-btn">
            <img src={UsersIcon} alt="Users" />
          </button>
          <button className="icon-btn">
            <img src={SettingsIcon} alt="Settings" />
          </button>
        </div>
      </header>

      {/* Search bar (persis posisi & bentuk WhatsApp) */}
      <div className="search-container">
        <div className="search-box">
          <img src={SearchIcon} alt="" className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Area list (flex 1 + scroll) */}
      <main className="chat-list-area">
        <div className="empty-state">
          <img src={EnvelopeIcon} alt="Envelope" className="empty-icon" />
          <p className="empty-text">Tidak ada item untuk dikirim ulang</p>
        </div>
        {/* Nanti kalau ada data, ganti jadi <ul className="chat-list"> ... map items ... </ul> */}
      </main>

      {/* Bottom section: Logout (bisa diganti jadi bottom nav kalau perlu) */}
      <div className="bottom-bar">
        {userId && email && (
          <div className="user-info">
            User: {userId.slice(0, 8)}... | {email}
          </div>
        )}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* FAB (new item / add) - posisi kanan bawah seperti WhatsApp */}
      <button className="fab">
        <img src={UserAddIcon} alt="Add" />
      </button>
    </div>
  );
}

export default App;
