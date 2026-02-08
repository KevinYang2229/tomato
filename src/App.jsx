import { useState, useEffect, useRef } from 'react'

const MODES = {
  work: { label: '專注', time: 25, color: '#ef4444', bgColor: 'bg-red-500' },
  shortBreak: { label: '短暫休息', time: 5, color: '#14b8a6', bgColor: 'bg-teal-500' },
  longBreak: { label: '長假休息', time: 15, color: '#3b82f6', bgColor: 'bg-blue-500' }
}

function App() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.time * 60)
  const [isActive, setIsActive] = useState(false)
  const [task, setTask] = useState('')
  const [completedSessions, setCompletedSessions] = useState(0)
  
  const timerRef = useRef(null)

  // 請求通知權限
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current)
      setIsActive(false)
      handleTimerComplete()
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isActive, timeLeft])

  const handleTimerComplete = () => {
    const message = `${MODES[mode].label}結束了！`
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('番茄鐘通知', { body: message })
    }
    
    if (mode === 'work') {
      setCompletedSessions(prev => prev + 1)
    }
    
    alert(message)
  }

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(MODES[mode].time * 60)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsActive(false)
    setTimeLeft(MODES[newMode].time * 60)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const totalTime = MODES[mode].time * 60
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const RADIUS = 120
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <div className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 ${MODES[mode].bgColor}`}>
      <div className="w-full max-w-lg">
        {/* 頂部導航/模式切換 */}
        <div className="flex bg-black/10 backdrop-blur-md p-1.5 rounded-2xl mb-8 border border-white/10">
          {Object.entries(MODES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === key 
                  ? 'bg-white text-gray-800 shadow-xl' 
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* 主要計時器卡片 */}
        <div className="bg-white/15 backdrop-blur-2xl rounded-[40px] p-10 shadow-2xl border border-white/20 text-center relative overflow-hidden">
          <div className="relative z-10">
            {/* 圓形進度條 */}
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r={RADIUS}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="128"
                  cy="128"
                  r={RADIUS}
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-white transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white text-7xl font-black tracking-tight tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                  {Math.round(progress)}% 完成
                </span>
              </div>
            </div>

            {/* 水平進度條 */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-8">
              <div 
                className="bg-white h-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* 控制按鈕 */}
            <div className="flex flex-col gap-5">
              <button
                onClick={toggleTimer}
                className="w-full py-5 bg-white text-gray-900 rounded-3xl text-2xl font-black shadow-2xl hover:bg-gray-50 transition-all active:scale-95"
              >
                {isActive ? 'PAUSE' : 'START'}
              </button>
              
              <div className="flex justify-center items-center gap-8">
                <button
                  onClick={resetTimer}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                
                <div className="h-4 w-px bg-white/10"></div>
                
                <div className="text-white/60 text-sm font-medium">
                  今日完成: <span className="text-white font-bold">{completedSessions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 當前任務輸入 */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="你現在在忙什麼？"
            className="w-full bg-black/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-hidden focus:bg-black/20 transition-all text-center font-medium"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
