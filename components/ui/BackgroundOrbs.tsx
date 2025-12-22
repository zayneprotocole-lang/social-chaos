'use client'

export default function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Fond de base */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Orbes colorés */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[120px]" />
      <div className="absolute top-[30%] right-[-20%] h-[450px] w-[450px] rounded-full bg-cyan-500/25 blur-[100px]" />
      <div className="absolute bottom-[-15%] left-[20%] h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-[110px]" />
      <div className="absolute top-[60%] left-[-10%] h-[300px] w-[300px] rounded-full bg-purple-500/15 blur-[80px]" />
    </div>
  )
}
