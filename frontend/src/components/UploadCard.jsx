import { useRef, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL

export default function UploadCard({ token, onUploaded }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${apiBase}/videos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      onUploaded()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="p-5 rounded-2xl border bg-white/70 backdrop-blur shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Upload videos</h3>
          <p className="text-sm text-gray-600">Add videos to your library. They will sync across devices logged into this account.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Choose file'}
        </button>
        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
