// src/App.tsx (Vite 2 - settings.readtalk.workers.dev)
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("unknown");
	const [userId, setUserId] = useState("");
	const [email, setEmail] = useState("");

	// Ambil parameter dari URL (dikirim dari Vite 1)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlUserId = params.get('userId');
		const urlEmail = params.get('email');
		
		if (urlUserId) setUserId(urlUserId);
		if (urlEmail) setEmail(urlEmail);
	}, []);

	// Fungsi LOGOUT
	const handleLogout = () => {
		// Kirim pesan ke parent (Vite 1 - readtalk.pages.dev)
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
			
			{/* Tampilkan user info */}
			{userId && email && (
				<div style={{ 
					background: '#f0f0f0', 
					padding: '10px', 
					margin: '10px 0',
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
