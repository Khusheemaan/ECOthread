
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { Shirt, CheckCircle2, X, AlertCircle, Loader2, Award, Cat, Scissors, Repeat, Sparkles, Map as MapIcon, Zap, ShoppingBag } from 'lucide-react';

const JeansIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 2v20h4V12h2v10h4V2H7z" />
    <path d="M7 6h10" />
    <path d="M12 2v4" />
  </svg>
);

const HoodieIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    {/* Main Silhouette */}
    <path d="M12 2c-2.76 0-5 2.24-5 5 0 1.25.46 2.39 1.21 3.26l-4.11 2.54c-.33.15-.55.48-.55.84v8.19c0 .55.45 1 1 1h1.49v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1h1.49c.55 0 1-.45 1-1v-8.19c0-.36-.22-.69-.55-.84l-4.11-2.54c.75-.87 1.21-2.01 1.21-3.26 0-2.76-2.24-5-5-5z"/>
    
    {/* Internal White Details to match the requested image */}
    <g stroke="white" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Hood Opening */}
      <circle cx="12" cy="7" r="2.5" />
      {/* Central Zipper Line */}
      <path d="M12 9.5v12.5" />
      {/* Drawstrings */}
      <path d="M10.8 10v3" />
      <path d="M13.2 10v3" />
      {/* Drawstring Knots */}
      <circle cx="10.8" cy="13.5" r="0.4" fill="white" stroke="none" />
      <circle cx="13.2" cy="13.5" r="0.4" fill="white" stroke="none" />
      {/* Pocket Outlines */}
      <path d="M8.5 16.5l3.5 1M15.5 16.5l-3.5 1" />
      <path d="M8.5 16.5v3.5h3.5v-4.5" />
      <path d="M15.5 16.5v3.5h-3.5v-4.5" />
      {/* Cuff and Hem Line Separators */}
      <path d="M4.2 20.2h2.5" />
      <path d="M17.3 20.2h2.5" />
      <path d="M6.8 21.8h10.4" />
    </g>
  </svg>
);

const HatIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    {/* Main cap body silhouette */}
    <path d="M21.2 17.5c-.4-5.2-4-9-8.7-9-1.2 0-2.4.3-3.4.9C6.8 10.7 4.5 13 4.5 16.5c0 .5.1 1 .2 1.4-1.2.4-2.2 1.1-2.2 2.1 0 1.1 1 2 3.5 2.5 4 1 8 0 12-1 2.5-.6 3.5-2 3.2-4.5z" />
    {/* Top Button */}
    <path d="M15.5 5.5c0-.6-.5-1-1.2-1s-1.2.4-1.2 1 .5 1 1.2 1 1.2-.4 1.2-1z" />
    
    {/* White details */}
    <g stroke="white" strokeWidth="0.7" fill="none" strokeLinecap="round">
      {/* Panel curve */}
      <path d="M19 10c1 3.5 0 8.5-4 10.5" />
      {/* Brim curve */}
      <path d="M6 16.5c2 1.5 7 2.5 11.5 1" />
    </g>
  </svg>
);

interface LoopPathViewProps {
  user: User | null;
  onUpdateUser: (newLevel: number) => void;
  onLoginRequest: () => void;
}

const MAX_STEPS = 20;

const MAZE_PATH = [
  { x: 5, y: 8 },    
  { x: 15, y: 15 },  
  { x: 25, y: 15 },  
  { x: 25, y: 25 },  
  { x: 15, y: 25 },  
  { x: 15, y: 45 },  
  { x: 35, y: 45 },  
  { x: 35, y: 35 },  
  { x: 55, y: 35 },  
  { x: 55, y: 15 },  
  { x: 75, y: 15 },  
  { x: 75, y: 45 },  
  { x: 55, y: 45 },  
  { x: 55, y: 65 },  
  { x: 25, y: 65 },  
  { x: 25, y: 85 },  
  { x: 45, y: 85 },  
  { x: 45, y: 75 },  
  { x: 75, y: 75 },  
  { x: 75, y: 85 },  
  { x: 95, y: 85 },  
];

const LoopPathView: React.FC<LoopPathViewProps> = ({ user, onUpdateUser, onLoginRequest }) => {
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const currentStep = user?.currentLevel ? Math.min(user.currentLevel - 1, MAX_STEPS) : 0;
  const isFinished = currentStep >= MAX_STEPS;

  const MazeWalls = () => (
    <g stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="2.5" strokeLinecap="square">
      <path d="M 0 10 L 0 100 L 100 100 L 100 90 M 100 80 L 100 0 L 10 0" fill="none" />
      <path d="M 10 10 L 40 10" />
      <path d="M 10 20 L 30 20" />
      <path d="M 50 0 L 50 20" />
      <path d="M 60 10 L 90 10" />
      <path d="M 10 30 L 10 60" />
      <path d="M 20 30 L 20 50" />
      <path d="M 30 30 L 50 30" />
      <path d="M 30 30 L 30 60" />
      <path d="M 40 40 L 40 80" />
      <path d="M 50 40 L 60 40" />
      <path d="M 60 30 L 60 70" />
      <path d="M 70 20 L 80 20" />
      <path d="M 80 20 L 80 40" />
      <path d="M 70 50 L 90 50" />
      <path d="M 90 40 L 90 70" />
      <path d="M 10 70 L 30 70" />
      <path d="M 20 80 L 20 100" />
      <path d="M 30 80 L 50 80" />
      <path d="M 50 70 L 50 100" />
      <path d="M 60 80 L 80 80" />
      <path d="M 70 90 L 90 90" />
    </g>
  );

  const yarnPathD = useMemo(() => {
    return MAZE_PATH.slice(0, currentStep + 1)
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
  }, [currentStep]);

  const handleAdvance = async () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsVerifying(false);
    onUpdateUser(user.currentLevel + 1);
    setActiveTask(null);
  };

  const currentPos = MAZE_PATH[currentStep];

  return (
    <div className="relative min-h-screen bg-[#fcfbf7] dark:bg-black p-6 transition-colors duration-500 flex flex-col items-center font-bricolage">
      {/* Header */}
      <header className="mb-14 w-full flex flex-col items-center text-center space-y-4">
        <div className="space-y-4">
          <h2 className="text-6xl font-extrabold text-[#2d3a30] dark:text-[#fcfbf7] tracking-tight uppercase">ECO Maze</h2>
          <p className="text-xl md:text-2xl text-[#4a5d4e] dark:text-[#8ea894] font-bold tracking-tight max-w-lg mx-auto leading-tight italic">
            The yarn unspools with every trade. Buy and sell to reveal the hidden path to your Loop Loot.
          </p>
        </div>
        <div className="flex flex-col items-center pt-2">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">Current Loop</p>
          <p className="text-4xl font-extrabold text-[#22c55e] tracking-tight">{currentStep}<span className="text-zinc-200 dark:text-zinc-800 mx-1">/</span>{MAX_STEPS}</p>
        </div>
      </header>

      {/* Maze Area */}
      <div className="relative w-full max-w-lg aspect-square bg-white dark:bg-zinc-900 rounded-[64px] shadow-2xl border-8 border-[#4a5d4e]/5 dark:border-white/5 p-8 overflow-hidden group mb-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <MazeWalls />
          
          <path 
            d={yarnPathD} 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-all duration-1000 ease-in-out opacity-40"
          />

          <text x="-5" y="18" fontSize="6" className="fill-red-500 font-bold">➔</text>
          
          {/* Exit / Merch Marker */}
          <g transform="translate(92, 82)">
             <circle cx="4" cy="4" r="5" fill="white" stroke="#22c55e" strokeWidth="0.8" className="dark:fill-zinc-800 shadow-sm" />
             <foreignObject x="1.5" y="1.5" width="5" height="5">
                <div className="flex items-center justify-center w-full h-full">
                  <Shirt size={4} className="text-[#22c55e]" />
                </div>
             </foreignObject>
             {!isFinished && <text x="9" y="5" fontSize="3" className="fill-[#22c55e] font-black animate-pulse uppercase">Loot</text>}
          </g>

          {/* Kitten Pointer */}
          <g style={{ transform: `translate(${currentPos.x}px, ${currentPos.y}px)`, transition: 'transform 1s ease-in-out' }}>
             <circle r="6" fill="#22c55e" opacity="0.1" className="animate-ping" />
             <foreignObject x="-5" y="-5" width="10" height="10">
                <div className="flex items-center justify-center w-full h-full text-[10px] select-none">
                  🐈
                </div>
             </foreignObject>
             <circle r="1.5" fill="#22c55e" cy="5" />
          </g>
        </svg>

        {isFinished && (
          <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <Award size={56} />
            </div>
            <h3 className="text-4xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">Maze Solved!</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-medium">You've successfully navigated the loop. Your exclusive reward is waiting.</p>
            <button 
              onClick={() => setShowRewardModal(true)}
              className="bg-[#22c55e] text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transition-all uppercase tracking-tight"
            >
              Claim Your Prize
            </button>
          </div>
        )}
      </div>

      {/* Potential Rewards Section */}
      <section className="w-full max-w-4xl pb-24 px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-extrabold text-[#2d3a30] dark:text-[#fcfbf7] uppercase tracking-tight mb-3">The Loop Loot Pool</h3>
          <p className="text-zinc-500 text-sm font-medium">Solve the maze to unlock these premium circular staples.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'ECOthread Shirt', icon: Shirt, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
            { name: 'Zip-up Hoodie', icon: HoodieIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { name: 'ECOthread Hat', icon: HatIcon, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { name: 'ECOthread Jeans', icon: JeansIcon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border dark:border-white/5 shadow-sm text-center flex flex-col items-center gap-5 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className={`${item.bg} p-6 rounded-3xl transition-transform group-hover:scale-110 shadow-inner`}>
                <item.icon className={item.color} size={36} />
              </div>
              <p className="font-extrabold text-zinc-900 dark:text-white text-xs uppercase tracking-widest">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowRewardModal(false)}></div>
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[56px] p-12 shadow-2xl text-center border-4 border-green-400">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-400 rounded-full flex items-center justify-center shadow-2xl text-white">
                <Shirt size={48} />
             </div>
             <h3 className="text-5xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight mt-8 mb-4">Loop Legend</h3>
             <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">As a reward for solving the ECO Maze, you've unlocked a mystery item from our collection.</p>
             <div className="bg-zinc-100 dark:bg-black p-8 rounded-[32px] mb-8 border-2 border-dashed border-[#22c55e]/30">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Redemption Code</p>
                <p className="text-4xl font-extrabold tracking-tight text-[#22c55e] uppercase">MAZE-LOOP-2024</p>
             </div>
             <button 
              onClick={() => setShowRewardModal(false)}
              className="w-full bg-[#22c55e] text-white py-5 rounded-2xl font-bold text-xl uppercase tracking-tight shadow-lg"
             >
               Go to Shop
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoopPathView;
