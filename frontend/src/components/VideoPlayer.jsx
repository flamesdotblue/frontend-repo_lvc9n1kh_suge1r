import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Settings } from 'lucide-react'

export default function VideoPlayer({ src, type = 'video/mp4', title }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
  }

  const changeSpeed = (s) => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = s
    setSpeed(s)
    setSpeedOpen(false)
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black relative group">
      <video
        ref={videoRef}
        src={src}
        controls={false}
        preload="metadata"
        className="w-full h-56 object-contain bg-black"
        onClick={togglePlay}
      >
        <source src={src} type={type} />
      </video>

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-white/90 hover:bg-white shadow"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setSpeedOpen((v) => !v)}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white shadow flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> <span>{speed}x</span>
          </button>
          {speedOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg border shadow z-10">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${speed === s ? 'font-semibold' : ''}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {title && (
        <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-white/80 rounded">{title}</div>
      )}
    </div>
  )
}
