// src/App.tsx - settings.readtalk.workers.dev
import { useState, useEffect } from "react";

import MenuDotsVertical from "./assets/menu-dots-vertical.svg";
import SearchIcon from "./assets/search.svg";
import EnvelopeIcon from "./assets/envelope.svg";
import UserAddIcon from "./assets/plus-small.svg";
import BubbleDiscussionIcon from "./assets/bubble-discussion.svg";
import CameraIcon from "./assets/camera.svg";
import UsersIcon from "./assets/users.svg";
import PhoneCallIcon from "./assets/phone-call.svg";
import SettingsIcon from "./assets/settings.svg"; // <-- TAMBAH
import EditIcon from "./assets/edit.svg"; // <-- TAMBAH
import DefaultAvatar from "./assets/default-avatar.svg"; // <-- TAMBAH

import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // <-- TAMBAH
  const [activeTab, setActiveTab] = useState("chat");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Settings state
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId") || "";
    const eml = params.get("email") || "";
    setUserId(uid);
    setEmail(eml);
    
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem(`readtalk_settings_${uid}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAvatar(settings.avatar || DefaultAvatar);
      setName(settings.name || "");
      setAbout(settings.about || "");
    } else {
      // Default name from email
      setName(eml.split("@")[0]);
    }
  }, []);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('readtalk_theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('readtalk_theme', newTheme);
  };

  const handleLogout = () => {
    window.parent.postMessage({ type: "LOGOUT" }, "https://readtalk.pages.dev");
    setShowMenu(false);
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        // Save to localStorage
        const settings = { avatar: result, name, about };
        localStorage.setItem(`readtalk_settings_${userId}`, JSON.stringify(settings));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save settings
  const saveSettings = () => {
    const settings = { avatar, name, about };
    localStorage.setItem(`readtalk_settings_${userId}`, JSON.stringify(settings));
    setIsEditing(false);
    setShowSettings(false);
  };

  return (
    <div className={`app-layout ${theme}`}>
      <header className="app-header">
        <div className="app-header-left">         
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
              <button 
                className="app-dropdown-item" 
                onClick={() => {
                  setShowSettings(true);
                  setShowMenu(false);
                }}
              >
                <img src={SettingsIcon} alt="Settings" className="app-dropdown-icon" />
                Settings
              </button>
              <button className="app-mode-toggle" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
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
          <img src={SearchIcon} alt="Search" className="app-search-icon" />
          <input
            type="text"
            placeholder="Search name or message..."
            className="app-search-input"
          />
        </div>
      </div>

      {/* MAIN + SIDEBAR */}
      <div className="app-main">
        <aside className="app-sidebar">
          <div className="app-empty">
            <img src={EnvelopeIcon} alt="Empty" className="app-empty-icon" />
            <p className="app-empty-text">No items to resend</p>
          </div>
        </aside>

        <main className="app-content">
          <p>Select an item from sidebar to view details</p>
        </main>
      </div>

      {/* BOTTOM NAV */}
      <nav className="app-bottom-nav">
        <button
          className={`app-bottom-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <img src={BubbleDiscussionIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "updates" ? "active" : ""}`}
          onClick={() => setActiveTab("updates")}
        >
          <img src={CameraIcon} alt="Updates" className="app-bottom-icon" />
          <span>Updates</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "communities" ? "active" : ""}`}
          onClick={() => setActiveTab("communities")}
        >
          <img src={UsersIcon} alt="Communities" className="app-bottom-icon" />
          <span>Communities</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "calls" ? "active" : ""}`}
          onClick={() => setActiveTab("calls")}
        >
          <img src={PhoneCallIcon} alt="Calls" className="app-bottom-icon" />
          <span>Calls</span>
        </button>
      </nav>

      {/* FAB */}
      <button className="app-fab">
        <img src={UserAddIcon} alt="Add" />
      </button>

      {/* SETTINGS POPUP */}
      {showSettings && (
        <div className="app-settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="app-settings-popup" onClick={(e) => e.stopPropagation()}>
            <div className="app-settings-header">
              <h2>Settings</h2>
              <button className="app-settings-close" onClick={() => setShowSettings(false)}>×</button>
            </div>

            <div className="app-settings-content">
              {/* Avatar */}
              <div className="app-settings-avatar-section">
                <img src={avatar} alt="Avatar" className="app-settings-avatar" />
                {isEditing ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="app-settings-avatar-input"
                  />
                ) : (
                  <button className="app-settings-edit-btn" onClick={() => setIsEditing(true)}>
                    <img src={EditIcon} alt="Edit" />
                  </button>
                )}
              </div>

              {/* User Info Internal */}
              <div className="app-settings-info">
                <div className="app-settings-field">
                  <label>User ID</label>
                  <div className="app-settings-value">{userId}</div>
                </div>
                <div className="app-settings-field">
                  <label>Email</label>
                  <div className="app-settings-value">{email}</div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="app-settings-edit">
                <div className="app-settings-field">
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="app-settings-input"
                    />
                  ) : (
                    <div className="app-settings-value">{name || "Not set"}</div>
                  )}
                </div>

                <div className="app-settings-field">
                  <label>About</label>
                  {isEditing ? (
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Tell something about yourself"
                      className="app-settings-textarea"
                      rows={3}
                    />
                  ) : (
                    <div className="app-settings-value">{about || "Not set"}</div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="app-settings-actions">
                {isEditing ? (
                  <>
                    <button className="app-settings-btn cancel" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className="app-settings-btn save" onClick={saveSettings}>
                      Save
                    </button>
                  </>
                ) : (
                  <button className="app-settings-btn edit" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
