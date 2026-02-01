
import React, { useState, useEffect, useRef } from 'react';
import { getRepairAdvice, getUpcyclingIdeas } from '../services/geminiService';
import { Scissors, RefreshCw, Wand2, Camera, X, Upload, AlertCircle, Play, Youtube, ExternalLink, GraduationCap, Star } from 'lucide-react';

const CareView: React.FC = () => {
  const [fabric, setFabric] = useState('');
  const [issue, setIssue] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Upcycling State
  const [upcycleImage, setUpcycleImage] = useState<string | null>(null);
  const [upcycleIdeas, setUpcycleIdeas] = useState<any[]>([]);
  const [isUpcycling, setIsUpcycling] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (isCameraOpen) {
        setCameraError(null);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err: any) {
          console.error("Camera access error:", err);
          setIsCameraOpen(false);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setCameraError("Camera access was denied. Please check your browser's site settings to allow camera use for ECOthread.");
          } else {
            setCameraError("Unable to access camera. Please use file upload instead.");
          }
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setUpcycleImage(canvasRef.current.toDataURL('image/jpeg'));
        setIsCameraOpen(false);
      }
    }
  };

  const handleGetAdvice = async () => {
    if (!fabric || !issue) return;
    setIsLoading(true);
    const res = await getRepairAdvice(issue, fabric);
    setAdvice(res);
    setIsLoading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpcycleImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const skillVideos = [
    { title: "Visible Mending 101", query: "visible mending for beginners", duration: "12 mins", icon: <Star className="text-amber-500" /> },
    { title: "How to Sew a Button", query: "sew a button securely", duration: "5 mins", icon: <Scissors className="text-blue-500" /> },
    { title: "Hemming Pants by Hand", query: "hand hemming pants tutorial", duration: "15 mins", icon: <RefreshCw className="text-emerald-500" /> },
    { title: "Fixing a Snag in Knits", query: "fix snag in sweater knit", duration: "8 mins", icon: <GraduationCap className="text-purple-500" /> }
  ];

  return (
    <div className="px-6 py-8 space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] mb-2 serif">Care & Repair</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Extend the life of your wardrobe by mending what's broken.</p>
      </section>

      {/* Upcycling Section */}
      <section className="bg-[#2d3a30] dark:bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-white/10 rounded-xl"><Wand2 size={24} className="text-[#8ea894]" /></div>
             <h3 className="text-2xl font-bold serif text-white">The Upcycle AI</h3>
          </div>

          {cameraError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="text-red-400 shrink-0 mt-1" size={18} />
              <p className="text-sm text-red-100">{cameraError}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              {!upcycleImage ? (
                !isCameraOpen ? (
                  <div className="h-64 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center bg-white/5">
                    <div onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                      <Upload size={24} className="text-white" />
                      <p className="font-bold text-sm mt-2 text-white">Upload File</p>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </div>
                    <div className="h-1/2 w-px bg-white/10"></div>
                    <button onClick={() => setIsCameraOpen(true)} className="flex-1 flex flex-col items-center justify-center hover:bg-white/5 transition-all text-white">
                      <Camera size={24} />
                      <p className="font-bold text-sm mt-2">Take Photo</p>
                    </button>
                  </div>
                ) : (
                  <div className="h-64 bg-black rounded-3xl overflow-hidden relative">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                       <button onClick={() => setIsCameraOpen(false)} className="bg-red-500 p-3 rounded-full text-white"><X size={20} /></button>
                       <button onClick={capturePhoto} className="w-14 h-14 bg-white rounded-full border-4 border-gray-300"></button>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-64 relative rounded-3xl overflow-hidden bg-black/20 group">
                  <img src={upcycleImage} className="w-full h-full object-contain" alt="Upcycle Preview" />
                  <button onClick={() => setUpcycleImage(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><X size={20} /></button>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
               <h4 className="text-xl font-bold text-[#8ea894]">Ready to transform?</h4>
               <p className="text-white/70 text-sm">AI will analyze your item and suggest DIY projects to give it a new loop.</p>
               <button 
                 onClick={async () => {
                   if (!upcycleImage) return;
                   setIsUpcycling(true);
                   const res = await getUpcyclingIdeas(upcycleImage);
                   if (res) setUpcycleIdeas(res);
                   setIsUpcycling(false);
                 }} 
                 disabled={!upcycleImage || isUpcycling} 
                 className="w-full bg-[#8ea894] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
               >
                 {isUpcycling ? <RefreshCw className="animate-spin" /> : <Wand2 />} Generate Projects
               </button>
            </div>
          </div>

          {upcycleIdeas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in slide-in-from-bottom-4">
              {upcycleIdeas.map((idea, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{idea.difficulty}</span>
                  <h4 className="font-bold mb-2 text-zinc-900">{idea.projectTitle}</h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mb-3">{idea.description}</p>
                  <button 
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=diy+how+to+${encodeURIComponent(idea.projectTitle)}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Youtube size={14} className="text-red-500" /> Watch Tutorial
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Repair Assistant */}
      <section className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-sm border border-zinc-100 dark:border-white/5 transition-colors">
        <h3 className="text-2xl font-bold serif mb-6 text-zinc-900 dark:text-zinc-100">Repair Assistant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Fabric Type</label>
            <input 
              type="text" 
              placeholder="e.g. Denim, Cotton, Silk" 
              value={fabric} 
              onChange={e => setFabric(e.target.value)} 
              className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">The Issue</label>
            <input 
              type="text" 
              placeholder="e.g. Ripped seam, missing button" 
              value={issue} 
              onChange={e => setIssue(e.target.value)} 
              className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50 transition-all" 
            />
          </div>
        </div>
        <button 
          onClick={handleGetAdvice} 
          disabled={isLoading} 
          className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-4 rounded-2xl font-bold mt-8 shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Consulting Master...' : 'Get Fix Guide'}
        </button>

        {advice && (
          <div className="mt-8 p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[32px] border border-amber-200 dark:border-amber-800/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl font-bold text-amber-900 dark:text-amber-400 serif">{advice.guideTitle}</h4>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Expert Guide</span>
            </div>
            <div className="space-y-4 mb-8">
              {advice.steps.map((s: string, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center text-amber-800 dark:text-amber-400 text-xs font-bold shrink-0">{i+1}</div>
                  <p className="text-zinc-800 dark:text-zinc-300 text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
            <div className="p-5 bg-white dark:bg-zinc-800/50 rounded-2xl border border-amber-100 dark:border-amber-800/20 mb-6">
              <p className="text-xs text-amber-800 dark:text-amber-400 italic"><b>Pro Tip:</b> {advice.proTip}</p>
            </div>
            <div className="pt-6 border-t border-amber-200 dark:border-amber-800/30">
              <p className="text-xs text-amber-900 dark:text-amber-400 font-bold mb-3 uppercase tracking-widest">Related Video Tutorial</p>
              <button 
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(advice.youtubeSearchQuery)}`, '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold shadow-md transition-all active:scale-95"
              >
                <Youtube size={20} /> Watch on YouTube <ExternalLink size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Build Your Skills Section */}
      <section className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 serif mb-2">Build Your Skills</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Master essential DIY hacks to keep your clothes in the loop.</p>
          </div>
          <button className="text-[#4a5d4e] dark:text-[#8ea894] text-sm font-bold underline">View Mastery Path</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillVideos.map((video, idx) => (
            <button 
              key={idx} 
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(video.query)}`, '_blank')}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {video.icon}
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">{video.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <Play size={10} fill="currentColor" /> {video.duration}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase">YouTube Tutorial</span>
                 <Youtube size={16} className="text-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CareView;
