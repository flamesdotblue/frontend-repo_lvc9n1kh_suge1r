import { useEffect, useState } from 'react'
import VideoPlayer from './VideoPlayer'

const apiBase = import.meta.env.VITE_BACKEND_URL

export default function VideoGrid({ token }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/videos/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load videos')
      setVideos(data.videos || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p className="text-sm text-gray-600">Loading videos…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  if (!videos.length) return <p className="text-sm text-gray-600">No videos yet. Upload your first one!</p>

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => {
        const streamUrl = `${apiBase}/videos/stream/${v._id}`
        return (
          <div key={v._id} className="space-y-2">
            <VideoPlayer src={streamUrl} type={v.content_type} title={v.original_name} />
            <div className="text-sm text-gray-700 truncate">{v.original_name}</div>
          </div>
        )
      })}
    </div>
  )
}
