import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, FaceLandmarker } from '@mediapipe/tasks-vision';

// 1. COMPLETELY REWRITTEN LAYOUT
// Kept strictly to the left (x: 0.05) and right (x: 0.77) to leave the center completely clear for you!
// Also tweaked width (w) and height (h) so nothing clips out of the frame.
const DRUMS = [
  // LEFT SIDE
  { id: 'crash', name: 'Crash', x: 0.03, y: 0.08, w: 0.18, h: 0.22, color: 'rgba(255, 215, 0, 0.3)', hitColor: 'rgba(255, 215, 0, 0.8)', soundUrl: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tink.wav'},
  { id: 'hihat', name: 'Hi-Hat', x: 0.03, y: 0.38, w: 0.18, h: 0.22, color: 'rgba(255, 255, 255, 0.2)', hitColor: 'rgba(255, 255, 255, 0.8)', soundUrl: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav'},
  { id: 'snare', name: 'Snare', x: 0.03, y: 0.68, w: 0.18, h: 0.22, color: 'rgba(236, 72, 153, 0.3)', hitColor: 'rgba(236, 72, 153, 0.9)', soundUrl: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav'}, 
  
  // RIGHT SIDE
  { id: 'tom', name: 'Tom', x: 0.79, y: 0.2, w: 0.18, h: 0.25, color: 'rgba(59, 130, 246, 0.3)', hitColor: 'rgba(59, 130, 246, 0.9)', soundUrl: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav'},
  { id: 'kick', name: 'Kick', x: 0.79, y: 0.55, w: 0.18, h: 0.25, color: 'rgba(168, 85, 247, 0.3)', hitColor: 'rgba(168, 85, 247, 0.9)', soundUrl: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/kick.wav'}   
];

export default function DrumKit({ onExit }: { onExit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [useGoggles, setUseGoggles] = useState(true);
  const [discoMode, setDiscoMode] = useState(true);
  const [discoColor, setDiscoColor] = useState('transparent');
  
  const useGogglesRef = useRef(true);
  const discoModeRef = useRef(true);
  
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAILoading, setIsAILoading] = useState(true);
  
  const hitTimestamps = useRef<Record<string, number>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    useGogglesRef.current = useGoggles;
    discoModeRef.current = discoMode;
  }, [useGoggles, discoMode]);

  const unlockAudio = async () => {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
    for (const drum of DRUMS) {
      try {
        const response = await fetch(drum.soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtxRef.current!.decodeAudioData(arrayBuffer);
        audioBuffersRef.current[drum.id] = audioBuffer;
      } catch (err) { console.error(err); }
    }
    setIsAudioReady(true);
  };

  useEffect(() => {
    let animationFrameId: number;
    let lastVideoTime = -1;

    const initializeAI = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "CPU" },
          runningMode: "VIDEO", numHands: 2
        });
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task", delegate: "CPU" },
          runningMode: "VIDEO"
        });
        setIsAILoading(false);
        startWebcam();
      } catch (err) { setIsAILoading(false); }
    };

    const startWebcam = async () => {
      try {
        // 2. SPEED HACK: Force the camera to lower resolution and high framerate. 
        // This makes the CPU tracking significantly faster and more responsive!
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 60 }
          }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => { predictWebcam(); });
        }
      } catch (error) { console.error(error); }
    };

    const predictWebcam = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !handLandmarkerRef.current || !faceLandmarkerRef.current) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      const now = performance.now();

      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const handResults = handLandmarkerRef.current.detectForVideo(video, now);
        const faceResults = faceLandmarkerRef.current.detectForVideo(video, now);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (useGogglesRef.current && faceResults.faceLandmarks?.[0]) {
          const face = faceResults.faceLandmarks[0];
          const bridge = face[168];
          const leftEdge = face[127];
          const rightEdge = face[356];
          
          const bx = (1 - bridge.x) * canvas.width;
          const by = bridge.y * canvas.height;
          const w = Math.abs(leftEdge.x - rightEdge.x) * canvas.width * 1.1;

          const grad = ctx.createLinearGradient(bx - w/2, by, bx + w/2, by);
          grad.addColorStop(0, 'rgba(0, 255, 255, 0.7)');
          grad.addColorStop(0.5, 'rgba(255, 0, 255, 0.5)');
          grad.addColorStop(1, 'rgba(0, 255, 255, 0.7)');

          ctx.fillStyle = grad;
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.roundRect(bx - w / 2, by - 22, w, 45, 10);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx - w/2.2, by - 15);
          ctx.lineTo(bx + w/2.2, by - 15);
          ctx.stroke();
        }

        if (handResults.landmarks) {
          for (const landmarks of handResults.landmarks) {
            const index = { x: 1 - landmarks[8].x, y: landmarks[8].y };
            
            DRUMS.forEach(drum => {
              const isHit = index.x > drum.x && index.x < (drum.x + drum.w) && index.y > drum.y && index.y < (drum.y + drum.h);
              const lastHit = hitTimestamps.current[drum.id] || 0;
              
              if (isHit && (now - lastHit > 250)) {
                hitTimestamps.current[drum.id] = now;
                
                const buffer = audioBuffersRef.current[drum.id];
                if (audioCtxRef.current?.state === 'running' && buffer) {
                  const source = audioCtxRef.current.createBufferSource();
                  source.buffer = buffer;
                  source.connect(audioCtxRef.current.destination);
                  source.start(0);
                }

                if (discoModeRef.current) {
                  const colors = ['rgba(236,72,153,0.5)', 'rgba(59,130,246,0.5)', 'rgba(168,85,247,0.5)', 'rgba(34,197,94,0.5)'];
                  setDiscoColor(colors[Math.floor(Math.random() * colors.length)]);
                  setTimeout(() => setDiscoColor('transparent'), 100);
                }
              }
            });

            landmarks.forEach(pt => {
              ctx.fillStyle = "#00FF00";
              ctx.beginPath();
              ctx.arc((1 - pt.x) * canvas.width, pt.y * canvas.height, 3, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }

        DRUMS.forEach(drum => {
          const glowing = (now - (hitTimestamps.current[drum.id] || 0)) < 150;
          ctx.fillStyle = glowing ? drum.hitColor : drum.color;
          ctx.beginPath();
          ctx.roundRect(drum.x * canvas.width, drum.y * canvas.height, drum.w * canvas.width, drum.h * canvas.height, 15);
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.stroke();
        });
      }
      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    initializeAI();
    return () => { 
      cancelAnimationFrame(animationFrameId); 
      handLandmarkerRef.current?.close(); 
      faceLandmarkerRef.current?.close(); 
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-150 overflow-hidden" 
      style={{ backgroundColor: discoColor !== 'transparent' ? discoColor : 'transparent' }}
    >
      <div className="w-full max-w-[1400px] flex justify-between items-center mb-4 z-20">
        <div className="flex gap-4">
          <button 
            onClick={() => setUseGoggles(!useGoggles)} 
            className={`px-4 py-2 rounded-lg font-bold border backdrop-blur-md transition-all ${useGoggles ? 'bg-cyan-500/80 text-black border-cyan-400' : 'bg-black/40 text-white border-white/20'}`}
          >
            {useGoggles ? 'GOGGLES: ON' : 'GOGGLES: OFF'}
          </button>
          <button 
            onClick={() => setDiscoMode(!discoMode)} 
            className={`px-4 py-2 rounded-lg font-bold border backdrop-blur-md transition-all ${discoMode ? 'bg-purple-500/80 text-white border-purple-400' : 'bg-black/40 text-white border-white/20'}`}
          >
            {discoMode ? 'DISCO: ON' : 'DISCO: OFF'}
          </button>
        </div>
        <button onClick={onExit} className="px-6 py-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded-lg font-bold transition-all">EXIT</button>
      </div>

      {/* 3. BIGGER SCREEN: Changed max-w-6xl to w-[95vw] max-w-[1400px]. This stretches the camera feed to look massive! */}
      <div className="relative z-20 w-[95vw] max-w-[1400px] aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(170,59,255,0.3)] bg-black/40 backdrop-blur-sm flex items-center justify-center">
        {!isAudioReady && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
             <button onClick={unlockAudio} className="px-12 py-5 bg-white text-black font-black rounded-full text-2xl hover:scale-105 active:scale-95 transition-all shadow-white/20 shadow-xl">READY TO ROCK?</button>
          </div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-80" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      </div>
    </div>
  );
}