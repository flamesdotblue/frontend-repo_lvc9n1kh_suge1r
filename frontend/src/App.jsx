import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import UploadCard from './components/UploadCard'
import VideoGrid from './components/VideoGrid'
import { LogOut } from 'lucide-react'

function Header({ authed, onLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold">V</div>
          <h1 className="text-lg font-semibold">Vibe Videos</h1>
        </div>
        {authed && (
          <button onClick={onLogout} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default function App() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('auth_token')
    if (t) setToken(t)
  }, [])

  const handleAuthed = ({ token }) => {
    setToken(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setToken('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <Header authed={!!token} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {!token ? (
          <div className="max-w-2xl mx-auto">
            <AuthForm onAuthenticated={handleAuthed} />
          </div>
        ) : (
          <div className="space-y-8">
            <UploadCard token={token} onUploaded={() => window.location.reload()} />
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Your videos</h2>
              <VideoGrid token={token} />
            </section>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Built for seamless video uploads and playback with account sync.</footer>
    </div>
  )
}
