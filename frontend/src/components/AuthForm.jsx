import { useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState('signup') // signup | verify | login
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const useEmail = email.trim().length > 0
  const contactPayload = useEmail ? { email } : { phone }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactPayload, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to sign up')
      setMessage(`Verification code: ${data.otp}. Please enter it to verify.`)
      setMode('verify')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${apiBase}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactPayload, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verification failed')
      setMessage('Verified! You can now log in.')
      setMode('login')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactPayload, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('auth_token', data.token)
      onAuthenticated({ token: data.token, userId: data.user_id })
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/70 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {mode === 'signup' && 'Create your account'}
          {mode === 'verify' && 'Verify your account'}
          {mode === 'login' && 'Welcome back'}
        </h2>
        <div className="text-sm text-gray-600">
          {mode !== 'login' ? (
            <button className="underline" onClick={() => setMode('login')}>Have an account?</button>
          ) : (
            <button className="underline" onClick={() => setMode('signup')}>Create account</button>
          )}
        </div>
      </div>

      <form onSubmit={mode === 'signup' ? handleSignup : mode === 'verify' ? handleVerify : handleLogin} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (or use phone)"
            className="col-span-2 sm:col-span-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="col-span-2 sm:col-span-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full"
          />
        </div>

        {mode !== 'verify' && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full"
          />
        )}

        {mode === 'verify' && (
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter OTP"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Please wait…' : mode === 'signup' ? 'Sign up' : mode === 'verify' ? 'Verify' : 'Log in'}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

      {mode === 'signup' && (
        <p className="mt-3 text-xs text-gray-500">For demo, the OTP will be shown here after you sign up.</p>
      )}
    </div>
  )
}
