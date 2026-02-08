import { useState, useEffect, useRef } from 'react'

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('work') // 'work', 'shortBreak', 'longBreak'
  const timerRef = useRef(null)

  const modes = {
    work: { label: '專注', time: 25 * 60, color: 'bg-red-500' },
    shortBreak: { label: '短暫休息', time: 5 * 60, color: 'bg-teal-500' },
    longBreak: { label: '長假休息', time: 15 * 60, color: 'bg-blue-500' }
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current)
      setIsActive(false)
      // 可以在這裡加入音效通知
      alert(`${modes[mode].label}時間結束！`)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isActive, timeLeft, mode])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(modes[mode].time)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsActive(false)
    setTimeLeft(modes[newMode].time)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col items-center justify-center p-4 ${modes[mode].color}`}>
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 text-center">
        <h1 className="text-white text-2xl font-bold mb-8">番茄鐘計時器</h1>
        
        <div className="flex justify-center gap-2 mb-8">
          {Object.entries(modes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === key 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        <div className="text-white text-8xl font-black mb-12 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={toggleTimer}
            className="w-full py-4 bg-white text-gray-800 rounded-2xl text-xl font-bold shadow-xl hover:bg-gray-50 transition-transform active:scale-95"
          >
            {isActive ? '暫停' : '開始'}
          </button>
          
          <button
            onClick={resetTimer}
            className="text-white/80 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors"
          >
            重設計時
          </button>
        </div>
      </div>
      
      <footer className="mt-12 text-white/60 text-sm font-medium">
        Stay Focused with Tomato Timer
      </footer>
    </div>
  )
}

export default App
