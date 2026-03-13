// src/App.tsx (VITE 2 - settings.readtalk.workers.dev)
import { useState, useEffect } from "react";
import "./App.css";

interface ChatItem {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'archived';
  isArchived?: boolean;
  unreadCount?: number;
}

function App() {
  const [currentUser, setCurrentUser] = useState<{userId: string; email: string} | null>(null)
  const [activeTab, setActiveTab] = useState<'chats' | 'updates' | 'communities' | 'calls'>('chats')
  const [showArchived, setShowArchived] = useState(false)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [archivedChats, setArchivedChats] = useState<ChatItem[]>([])

  // ===== AMBIL PARAMETER USER =====
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const email = params.get('email')
    
    if (userId && email) {
      setCurrentUser({ userId, email })
      loadChats(userId)
    }
  }, [])

  // ===== LOAD CHATS DARI D1/KV =====
  const loadChats = async (userId: string) => {
    try {
      // Ini contoh data, nanti ambil dari database
      const mockChats: ChatItem[] = [
        {
          id: '1',
          name: 'SETOR RESI',
          lastMessage: 'Kakang Sayang❤️: Gpp, Masi bany...',
          timestamp: '08/12/25',
          status: 'archived',
          isArchived: true
        },
        {
          id: '2',
          name: 'Dalduk Pak Deni',
          lastMessage: '👤 Foto',
          timestamp: '20.19',
          status: 'archived',
          isArchived: true
        },
        {
          id: '3',
          name: 'Kakang Sayang❤️',
          lastMessage: '✅ Kakang lagi apa',
          timestamp: '20.18',
          status: 'delivered',
          unreadCount: 2
        },
        {
          id: '4',
          name: 'Teh Mitha',
          lastMessage: 'Sieun tepa pasti nage ..',
          timestamp: '19.32',
          status: 'read'
        },
        {
          id: '5',
          name: 'Afish',
          lastMessage: '✅ Iyah sama" afish',
          timestamp: '19.17',
          status: 'read'
        },
        {
          id: '6',
          name: 'Azog',
          lastMessage: '✅ Gak dapet cun',
          timestamp: '9.9',
          status: 'read'
        },
        {
          id: '7',
          name: 'Ayahanda',
          lastMessage: '❤️ Talannn ciiara tak tarianwah',
          timestamp: '',
          status: 'read'
        }
      ]

      setArchivedChats(mockChats.filter(chat => chat.isArchived))
      setChats(mockChats.filter(chat => !chat.isArchived))
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  // ===== LOGOUT =====
  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev')
  }

  return (
    <div className="whatsapp-container">
      {/* HEADER */}
      <div className="wa-header">
        <div className="header-left">
          <h1>READTalk</h1>
        </div>
        <div className="header-right">
          <button className="header-icon">🔍</button>
          <button className="header-icon" onClick={() => setShowArchived(!showArchived)}>📋</button>
          <button className="header-icon">⋮</button>
        </div>
      </div>

      {/* USER INFO (CURRENT USER) */}
      {currentUser && (
        <div className="current-user-info">
          <span className="user-avatar">
            {currentUser.email?.charAt(0).toUpperCase()}
          </span>
          <span className="user-email">{currentUser.email}</span>
          <span className="user-id">ID: {currentUser.userId.substring(0, 8)}...</span>
        </div>
      )}

      {/* SEARCH BAR (seperti "Tanya Meta AI") */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder={`Tanya ${currentUser?.email?.split('@')[0] || 'READTalk'} AI`}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* ARCHIVED SECTION (kalo ada) */}
        {archivedChats.length > 0 && showArchived && (
          <div className="archived-section">
            <div className="section-header" onClick={() => setShowArchived(!showArchived)}>
              <span className="header-icon">📦</span>
              <span className="header-title">Diarsipkan</span>
              <span className="header-count">{archivedChats.length}</span>
              <span className="chevron">{showArchived ? '▼' : '▶'}</span>
            </div>
            
            {showArchived && (
              <div className="archived-list">
                {archivedChats.map(chat => (
                  <div key={chat.id} className="chat-item archived">
                    <div className="chat-avatar">
                      {chat.avatar ? (
                        <img src={chat.avatar} alt={chat.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{chat.name}</div>
                      <div className="chat-message">{chat.lastMessage}</div>
                    </div>
                    <div className="chat-meta">
                      <span className="chat-time">{chat.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHATS LIST */}
        <div className="chats-list">
          {chats.map(chat => (
            <div key={chat.id} className="chat-item">
              <div className="chat-avatar">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {chat.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-message">{chat.lastMessage}</div>
              </div>
              <div className="chat-meta">
                <span className="chat-time">{chat.timestamp}</span>
                {chat.unreadCount && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <span className="nav-icon">💬</span>
          <span className="nav-label">Chat</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('updates')}
        >
          <span className="nav-icon">🔄</span>
          <span className="nav-label">Pembaruan</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'communities' ? 'active' : ''}`}
          onClick={() => setActiveTab('communities')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">Komunitas</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          <span className="nav-icon">📞</span>
          <span className="nav-label">Panggilan</span>
        </button>
      </div>

      {/* LOGOUT BUTTON (kecil di bawah) */}
      <button onClick={handleLogout} className="logout-mini">
        🚪
      </button>
    </div>
  )
}

export default App
