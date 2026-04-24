export default function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-neutral-700 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        
        <h1 className="text-4xl font-bold text-center mb-2 tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Drumify
        </h1>
        <p className="text-neutral-400 text-center mb-8">Sign in to your virtual stage.</p>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input type="email" required className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="rockstar@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input type="password" required className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity">
            Enter Studio
          </button>
        </form>
        
      </div>
    </div>
  );
}