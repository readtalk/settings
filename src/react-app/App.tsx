// src/App.tsx
import { useState, useEffect } from "react";
import CloudflareLogo from "./assets/Cloudflare_logo.svg";
import MenuDotsVertical from "./assets/menu-dots-vertical.svg";
import SearchIcon from "./assets/search.svg";
import EnvelopeIcon from "./assets/envelope.svg";
import UserAddIcon from "./assets/user-add.svg";
import UsersIcon from "./assets/users.svg";
import SettingsIcon from "./assets/settings.svg";
import CameraIcon from "./assets/camera.svg";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // default tab

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
      {/* Header */}
      <header className="app-header">
        <div className="app-header-left">
          <img src={CloudflareLogo} alt="Cloudflare" className="app-header-logo" />
          <h1 className="app-header-title">READTalk</h1>
        </div>

        <div className="app-header-right">
          {userId && email && (
            <div className="app-user-info">
              {userId.substring(0, 8)}... | {email.split("@")[0]}
            </div>
          )}

          <button className="app-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <img src={MenuDotsVertical} alt="Menu" />
          </button>

          {showMenu && (
            <div className="app-dropdown">
              <button className="app-dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
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

      {/* Main + Sidebar */}
      <div className="app-main">
        <aside className="app-sidebar">
          {/* Empty state contoh */}
          <div className="app-empty">
            <img src={EnvelopeIcon} alt="No items" className="app-empty-icon" />
            <p className="app-empty-text">Tidak ada item untuk dikirim ulang</p>
          </div>
        </aside>

        <main className="app-content">
          {/* Nanti isi detail item yang dipilih */}
          <p>Pilih item dari sidebar untuk melihat detail</p>
        </main>
      </div>

      {/* Bottom Navigation (mobile only) */}
      <nav className="app-bottom-nav">
        <button className={`app-bottom-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <img src={UsersIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "updates" ? "active" : ""}`} onClick={() => setActiveTab("updates")}>
          <img src={CameraIcon} alt="Pembaruan" className="app-bottom-icon" />
          <span>Pembaruan</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "communities" ? "active" : ""}`} onClick={() => setActiveTab("communities")}>
          <img src={UsersIcon} alt="Komunitas" className="app-bottom-icon" />
          <span>Komunitas</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "calls" ? "active" : ""}`} onClick={() => setActiveTab("calls")}>
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
