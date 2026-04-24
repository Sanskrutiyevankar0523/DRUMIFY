export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl space-y-8">
        
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
          YOUR HANDS.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            YOUR STAGE.
          </span>
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Drumify uses advanced edge-AI to track your hands in real-time. No VR headsets, no expensive drum kits. Just your laptop camera and your rhythm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Zero Latency</h3>
            <p className="text-neutral-400">Powered by Web Audio API for instant sound playback.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">AI Tracking</h3>
            <p className="text-neutral-400">Google MediaPipe reads 21 joints per hand at 60 FPS.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">100% Private</h3>
            <p className="text-neutral-400">All processing happens directly on your device.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="px-12 py-5 bg-white text-black font-black rounded-full text-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          START DRUMMING
        </button>

      </div>
    </div>
  );
}