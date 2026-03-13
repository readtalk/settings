// src/App.tsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get('userId') || "");
    setEmail(params.get('email') || "");
  }, []);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
      setShowMenu(false);
    } catch (err) {
      console.error('Camera denied');
    }
  };

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev');
  };

  return (
    <div className="wa-container">
      {/* HEADER */}
      <div className="wa-header">
        <h1>READTalk</h1>
        <div className="header-actions">
          <button className="icon-btn">🔍</button>
          <button className="icon-btn">➕</button>
          <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
        </div>
      </div>

      {/* MENU 3 TITIK */}
      {showMenu && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={requestCamera}>📷 Camera</div>
          <div className="menu-item">User ID: {userId}</div>
          <div className="menu-item">Email: {email}</div>
          <div className="menu-item" onClick={handleLogout}>🚪 Logout</div>
        </div>
      )}

      {/* SEARCH */}
      <div className="search-section">
        <input className="search-input" placeholder="Tanya AI atau Cari" />
      </div>

      {/* KONTEN KOSONG */}
      <div style={{ flex: 1 }}></div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Chat</button>
        <button className={`nav-item ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>Status</button>
        <button className={`nav-item ${activeTab === 'communities' ? 'active' : ''}`} onClick={() => setActiveTab('communities')}>Komunitas</button>
        <button className={`nav-item ${activeTab === 'calls' ? 'active' : ''}`} onClick={() => setActiveTab('calls')}>Panggilan</button>
      </div>
    </div>
  );
}

export default App;
