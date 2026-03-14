// src/App.tsx //
import { useState, useEffect } from "react";

import CloudflareLogo from "./assets/Cloudflare_Logo.svg";
import MenuDotsVertical from "./assets/menu-dots-vertical.svg";
import SearchIcon from "./assets/search.svg";
import EnvelopeIcon from "./assets/envelope.svg";
import UserAddIcon from "./assets/user-add.svg";
import UsersIcon from "./assets/users.svg";
import CameraIcon from "./assets/camera.svg";
import SettingsIcon from "./assets/settings.svg";

import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // userId url //
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("userId") || "");
    setEmail(params.get("email") || "");
  }, []);

  const handleLogout = () => {
    window.parent.postMessage({ type: "LOGOUT" }, "https://readtalk.pages.dev");
    setShowMenu(false);
  };

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="app-header">
        <div className="app-header-left">
          <img src={CloudflareLogo} alt="Cloudflare" className="app-header-logo" />
          <h1 className="app-header-title">READTalk</h1>
        </div>

        <div className="app-header-right">
          {userId && email && (
            <span className="app-user-info">
              {userId.slice(0, 8)}... | {email.split("@")[0]}
            </span>
          )}

          <button className="app-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <img src={MenuDotsVertical} alt="Menu" />
          </button>

          {showMenu && (
            <div className="app-dropdown">
              <button className="app-dropdown-item app-logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SEARCH */}
      <div className="app-search-container">
        <div className="app-search-box">
          <img src={SearchIcon} alt="" className="app-search-icon" />
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            className="app-search-input"
          />
        </div>
      </div>

      {/* MAIN + SIDEBAR */}
      <div className="app-main">
        <aside className="app-sidebar">
          <div className="app-empty">
            <img src={EnvelopeIcon} alt="Kosong" className="app-empty-icon" />
            <p className="app-empty-text">Tidak ada item untuk dikirim ulang</p>
          </div>
        </aside>

        <main className="app-content">
          <p>Pilih item dari sidebar untuk melihat detail</p>
        </main>
      </div>

      {/* BOTTOM NAV */}
      <nav className="app-bottom-nav">
        <button
          className={`app-bottom-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <img src={UsersIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "pembaruan" ? "active" : ""}`}
          onClick={() => setActiveTab("pembaruan")}
        >
          <img src={CameraIcon} alt="Pembaruan" className="app-bottom-icon" />
          <span>Pembaruan</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "komunitas" ? "active" : ""}`}
          onClick={() => setActiveTab("komunitas")}
        >
          <img src={UsersIcon} alt="Komunitas" className="app-bottom-icon" />
          <span>Komunitas</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "panggilan" ? "active" : ""}`}
          onClick={() => setActiveTab("panggilan")}
        >
          <img src={SettingsIcon} alt="Panggilan" className="app-bottom-icon" />
          <span>Panggilan</span>
        </button>
      </nav>

      {/* FAB */}
      <button className="app-fab">
        <img src={UserAddIcon} alt="Tambah" />
      </button>
    </div>
  );
}

export default App;
