import { useState } from 'react';
import Login from './Login';
import Landing from './Landing';
import DrumKit from './DrumKit';
import Background3D from './Background3D'; // Import the 3D scene!
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'landing' | 'drumming'>('login');

  return (
    // The main wrapper is set to black, full screen, and hides anything that spills over
    <div className="relative min-h-screen bg-[#05020a] overflow-hidden font-sans text-white">
      
      {/* The 3D Background runs constantly behind everything */}
      <Background3D />

      {/* The Page Content (z-10 ensures it stays in front of the 3D canvas) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {currentPage === 'login' && <Login onLogin={() => setCurrentPage('landing')} />}
        {currentPage === 'landing' && <Landing onStart={() => setCurrentPage('drumming')} />}
        {currentPage === 'drumming' && <DrumKit onExit={() => setCurrentPage('landing')} />}
      </div>

    </div>
  );
}