// App.tsx - settings.readtalk.workers.dev
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";

// Tipe untuk hasil pencarian
interface SearchResult {
  userId: string;
  email: string;
  yourname: string;
  avatar?: string;
}

function App() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("unknown");
	const [userId, setUserId] = useState("");
	const [email, setEmail] = useState("");
	
	// State untuk pencarian
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [bookmark, setBookmark] = useState<string>("first-unconstrained");

	// Ambil parameter dari URL (dikirim dari Vite 1)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlUserId = params.get('userId');
		const urlEmail = params.get('email');
		
		if (urlUserId) setUserId(urlUserId);
		if (urlEmail) setEmail(urlEmail);
	}, []);

	// Fungsi pencarian dengan bookmark
	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		
		setIsSearching(true);
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
				headers: {
					'x-d1-bookmark': bookmark  // Kirim bookmark ke worker
				}
			});
			
			// Ambil bookmark baru dari response header
			const newBookmark = response.headers.get('x-d1-bookmark');
			if (newBookmark) setBookmark(newBookmark);
			
			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			setIsSearching(false);
		}
	};

	// Fungsi LOGOUT
	const handleLogout = () => {
		window.parent.postMessage({ type: 'LOGOUT' }, 'https://readtalk.pages.dev');
	};

	return (
		<>
			<div>
				<a href="" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
				<a href="" target="_blank">
					<img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
				</a>
				<a href="" target="_blank">
					<img
						src={cloudflareLogo}
						className="logo cloudflare"
						alt="Cloudflare logo"
					/>
				</a>
			</div>
			
			<h1>resendlist</h1>
			
			{/* Search Bar */}
			<div className="search-container" style={{ 
				margin: '20px', 
				padding: '20px', 
				background: '#f5f5f5', 
				borderRadius: '8px' 
			}}>
				<input
					type="text"
					placeholder="Cari user berdasarkan nama atau email..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
					style={{
						width: '100%',
						padding: '12px',
						marginBottom: '10px',
						borderRadius: '8px',
						border: '1px solid #ddd',
						fontSize: '16px'
					}}
				/>
				<button 
					onClick={handleSearch}
					disabled={isSearching}
					style={{
						width: '100%',
						padding: '12px',
						background: '#ff0000',
						color: 'white',
						border: 'none',
						borderRadius: '8px',
						fontSize: '16px',
						cursor: 'pointer',
						opacity: isSearching ? 0.7 : 1
					}}
				>
					{isSearching ? 'Mencari...' : '🔍 Cari'}
				</button>
			</div>

			{/* Hasil Pencarian */}
			{searchResults.length > 0 && (
				<div className="search-results" style={{ margin: '20px' }}>
					<h3>Hasil Pencarian ({searchResults.length})</h3>
					{searchResults.map((user) => (
						<div key={user.userId} style={{
							padding: '15px',
							margin: '10px 0',
							background: '#f9f9f9',
							borderRadius: '8px',
							border: '1px solid #eee'
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
								<div style={{
									width: '50px',
									height: '50px',
									borderRadius: '50%',
									background: '#ff0000',
									color: 'white',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '20px'
								}}>
									{user.avatar ? (
										<img src={user.avatar} style={{ width: '100%', borderRadius: '50%' }} />
									) : (
										user.yourname?.charAt(0).toUpperCase()
									)}
								</div>
								<div>
									<div><strong>{user.yourname || 'Unknown'}</strong></div>
									<div style={{ color: '#666' }}>{user.email}</div>
									<div style={{ fontSize: '12px', color: '#999' }}>
										ID: {user.userId.substring(0, 16)}...
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Bookmark info (debug) */}
			<div style={{ margin: '20px', fontSize: '12px', color: '#999' }}>
				Bookmark: {bookmark.substring(0, 20)}...
			</div>
			
			{/* Tampilkan user info */}
			{userId && email && (
				<div style={{ 
					background: '#f0f0f0', 
					padding: '10px', 
					margin: '10px 20px',
					borderRadius: '8px'
				}}>
					<p><strong>User:</strong> {userId.substring(0, 8)}... | {email}</p>
				</div>
			)}
			
			<div className="card">
				<button
					onClick={() => setCount((count) => count + 1)}
					aria-label="increment"
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			
			<div className="card">
				<button
					onClick={() => {
						fetch("/api/")
							.then((res) => res.json() as Promise<{ name: string }>)
							.then((data) => setName(data.name));
					}}
					aria-label="get name"
				>
					Name from API is: {name}
				</button>
				<p>
					Edit <code>worker/index.ts</code> to change the name
				</p>
			</div>
			
			{/* TOMBOL LOGOUT */}
			<div className="card" style={{ border: '2px solid #ff0000', marginTop: '20px' }}>
				<button 
					onClick={handleLogout}
					style={{
						backgroundColor: '#ff0000',
						color: 'white',
						border: 'none',
						padding: '10px 20px',
						borderRadius: '8px',
						fontSize: '16px',
						cursor: 'pointer',
						width: '100%'
					}}
				>
					🚪 Logout
				</button>
				<p>Klik untuk logout dari aplikasi</p>
			</div>
			
			<p className="read-the-docs">Click on the logos to learn more</p>
		</>
	);
}

export default App;
