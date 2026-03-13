import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUserId(params.get('userId') || '')
    setEmail(params.get('email') || '')
  }, [])

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev')
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>READTalk</h1>
        <div className="header-icons">
          <button className="icon-btn">📷</button>
          <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
        </div>
      </header>

      {/* Menu 3 titik */}
      {showMenu && (
        <div className="menu">
          <div className="menu-item">User ID: {userId}</div>
          <div className="menu-item">Email: {email}</div>
          <div className="menu-item" onClick={handleLogout}>Logout</div>
        </div>
      )}

      {/* Search */}
      <div className="search">
        <input type="text" placeholder="Tanya AI atau Cari" />
      </div>

      {/* Konten Utama */}
      <main className="main">
        {/* KOSONG */}
      </main>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="action-buttons">
          <button className="action-btn">🔍</button>
          <button className="action-btn">🤖</button>
          <button className="fab">+</button>
        </div>
        <nav className="nav">
          <button className="nav-btn active">Chat</button>
          <button className="nav-btn">Status</button>
          <button className="nav-btn">Komunitas</button>
          <button className="nav-btn">Panggilan</button>
        </nav>
      </div>
    </div>
  )
}

export default App
