// src/App.tsx
import { useState, useEffect } from "react";
import CloudflareLogo from "./assets/Cloudflare_Logo.svg";
import MenuDotsVertical from "./assets/menu-dots-vertical.svg";
import SearchIcon from "./assets/search.svg";
import EnvelopeIcon from "./assets/envelope.svg";
import UserAddIcon from "./assets/user-add.svg";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // Ambil user info dari query parameter URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get("userId");
    const urlEmail = params.get("email");

    if (urlUserId) setUserId(urlUserId);
    if (urlEmail) setEmail(urlEmail);
  }, []);

  const handleLogout = () => {
    window.parent.postMessage({ type: "LOGOUT" }, "https://readtalk.pages.dev");
    setShowMenu(false);
  };

  return (
    <div className="wa-layout">
      {/* Header */}
      <header className="wa-header">
        <div className="wa-header-left">
          <img
            src={CloudflareLogo}
            alt="Cloudflare"
            className="wa-header-logo"
          />
          <h1 className="wa-header-title">ResendList</h1>
        </div>

        <div className="wa-header-right">
          {/* User info di pojok kanan atas */}
          {userId && email && (
            <div className="wa-user-info">
              <span className="wa-user-short">
                {userId.substring(0, 8)}... | {email.split("@")[0]}
              </span>
            </div>
          )}

          {/* Icon 3 titik */}
          <button
            className="wa-icon-btn wa-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img src={MenuDotsVertical} alt="Menu" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="wa-dropdown-menu">
              <button className="wa-dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search bar */}
      <div className="wa-search">
        <div className="wa-search-inner">
          <img src={SearchIcon} alt="" className="wa-search-icon" />
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            className="wa-search-input"
          />
        </div>
      </div>

      {/* Main area - empty state */}
      <main className="wa-main">
        <div className="wa-empty">
          <img src={EnvelopeIcon} alt="No items" className="wa-empty-icon" />
          <p className="wa-empty-text">Tidak ada item untuk dikirim ulang</p>
        </div>
      </main>

      {/* FAB (new item / add) */}
      <button className="wa-fab">
        <img src={UserAddIcon} alt="Tambah" />
      </button>
    </div>
  );
}

export default App;
