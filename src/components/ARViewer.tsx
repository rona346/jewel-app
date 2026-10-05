import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, RefreshCw, AlertCircle, Loader2, Video, VideoOff, Sparkles, Hand, User } from 'lucide-react';
import { FilesetResolver, HandLandmarker, FaceLandmarker } from '@mediapipe/tasks-vision';

interface ARViewerProps {
  productImg: string;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Bridal Sets';
  onClose: () => void;
}

export default function ARViewer({ productImg, category, onClose }: ARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  // Manual positioning fallback
  const [isManualMode, setIsManualMode] = useState(false);

  // Initialize MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        if (category === 'Rings' || category === 'Bracelets') {
          handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1
          });
        } else {
          faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "GPU"
            },
            runningMode: "VIDEO"
          });
        }
      } catch (err) {
        console.error("MediaPipe Init Error:", err);
        setError("AI Tracking failed to initialize. Switching to manual mode.");
        setIsManualMode(true);
      }
    };

    initMediaPipe();

    return () => {
      handLandmarkerRef.current?.close();
      faceLandmarkerRef.current?.close();
    };
  }, [category]);

  const stopCamera = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsLoading(false);
    setIsTracking(false);
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
          setIsLoading(false);
          if (!isManualMode) startTracking();
        };
      }
    } catch (err: any) {
      console.error("Camera Access Error:", err);
      setIsLoading(false);
      setError("Camera access denied or not found.");
    }
  };

  const startTracking = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const jewelleryImg = new Image();
    jewelleryImg.src = productImg;
    jewelleryImg.crossOrigin = "anonymous";

    const render = () => {
      if (video.readyState < 2) {
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      // Match canvas size to video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let tracked = false;
      const startTimeMs = performance.now();

      if (!isManualMode) {
        if (handLandmarkerRef.current && (category === 'Rings' || category === 'Bracelets')) {
          const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            
            // Ring finger PIP joint (landmark 14)
            const target = category === 'Rings' ? landmarks[14] : landmarks[0]; // Wrist for bracelet
            
            const x = target.x * canvas.width;
            const y = target.y * canvas.height;
            
            // Calculate scale based on distance between landmarks
            const dx = (landmarks[13].x - landmarks[14].x) * canvas.width;
            const dy = (landmarks[13].y - landmarks[14].y) * canvas.height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const scale = dist * 2.5;
            
            // Calculate rotation
            const angle = Math.atan2(dy, dx) + Math.PI / 2;

            drawJewellery(ctx, jewelleryImg, x, y, scale, angle);
            tracked = true;
          }
        } else if (faceLandmarkerRef.current) {
          const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            
            if (category === 'Earrings') {
              // Left ear (234) and Right ear (454)
              const leftEar = landmarks[234];
              const rightEar = landmarks[454];
              
              // Draw both earrings
              const scale = Math.abs(landmarks[454].x - landmarks[234].x) * canvas.width * 0.15;
              
              drawJewellery(ctx, jewelleryImg, leftEar.x * canvas.width, leftEar.y * canvas.height, scale, 0);
              drawJewellery(ctx, jewelleryImg, rightEar.x * canvas.width, rightEar.y * canvas.height, scale, 0);
            } else if (category === 'Necklaces' || category === 'Bridal Sets') {
              // Chin (152)
              const chin = landmarks[152];
              const x = chin.x * canvas.width;
              const y = (chin.y + 0.1) * canvas.height; // Offset down from chin
              
              const scale = Math.abs(landmarks[454].x - landmarks[234].x) * canvas.width * 0.8;
              drawJewellery(ctx, jewelleryImg, x, y, scale, 0);
            }
            tracked = true;
          }
        }
      }

      setIsTracking(tracked);
      requestRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const drawJewellery = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, scale: number, rotate: number) => {
    if (!img.complete) return;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    const aspect = img.width / img.height;
    const w = scale;
    const h = scale / aspect;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <div className="relative w-full h-full max-w-md bg-[#050505] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/90">
                {isManualMode ? 'Manual Mode' : 'AI Smart Try-On'}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-white/40">
                {isManualMode ? 'Drag to position' : (isTracking ? 'Tracking Active' : 'Searching for ' + (category === 'Rings' ? 'Hand' : 'Face'))}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 bg-[#111] flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none ${isManualMode ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Manual Mode Overlay */}
          {isCameraActive && isManualMode && (
            <motion.div
              drag
              dragConstraints={{ left: -150, right: 150, top: -200, bottom: 200 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 pointer-events-auto cursor-move z-30"
            >
              <img 
                src={productImg} 
                alt="AR Overlay" 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold whitespace-nowrap">
                    Drag to Position
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!isCameraActive && !error && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-20 bg-[#050505]">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 border border-[#D4AF37]/20">
                <Sparkles size={32} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-white">AI Virtual Try-On</h3>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Our advanced AI will track your {category === 'Rings' ? 'hand' : 'face'} to perfectly place the {category.toLowerCase().slice(0, -1)}.
              </p>
              <button 
                onClick={startCamera}
                className="px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95"
              >
                <Video size={16} />
                Start AI Tracking
              </button>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
              <Loader2 size={40} className="text-[#D4AF37] animate-spin mb-4" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold">Loading AI Models...</p>
            </div>
          )}

          {isCameraActive && !isTracking && !isLoading && !isManualMode && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <Loader2 size={12} className="text-[#D4AF37] animate-spin" />
                <span className="text-[9px] uppercase tracking-widest text-white/80">
                  Position your {category === 'Rings' ? 'hand' : 'face'} in view
                </span>
              </div>
              <button 
                onClick={() => setIsManualMode(true)}
                className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold hover:underline"
              >
                Switch to Manual Mode
              </button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-[#050505] z-40">
              <AlertCircle size={32} className="text-red-500 mb-4" />
              <p className="text-sm text-white/50 mb-8">{error}</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={startCamera}
                  className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full"
                >
                  Retry
                </button>
                <button 
                  onClick={() => { setError(null); setIsManualMode(true); startCamera(); }}
                  className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold"
                >
                  Use Manual Mode
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-8 bg-black border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex gap-4">
            {isCameraActive && (
              <button 
                onClick={stopCamera}
                className="px-6 py-3 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-red-500/20 flex items-center gap-2"
              >
                <VideoOff size={14} />
                Stop
              </button>
            )}
            {isCameraActive && (
              <button 
                onClick={() => {
                  setIsManualMode(!isManualMode);
                  if (isManualMode) startTracking();
                }}
                className="px-6 py-3 bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/10 flex items-center gap-2"
              >
                {isManualMode ? <Sparkles size={14} /> : <Hand size={14} />}
                {isManualMode ? 'Use AI' : 'Manual'}
              </button>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-[11px] text-white/60 leading-relaxed max-w-[240px]">
              {isManualMode 
                ? "Drag the jewellery to position it manually. You can also switch back to AI tracking."
                : (isTracking 
                    ? "AI is tracking your movement. The jewellery will follow you in real-time."
                    : "Move closer to the camera to enable AI tracking.")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
