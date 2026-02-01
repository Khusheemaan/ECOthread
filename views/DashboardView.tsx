
import React from 'react';
import { Shirt, Scissors, Repeat, Map as MapIcon, ChevronRight, Sparkles, Leaf } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const menuItems = [
    {
      id: 'wear',
      title: 'Wear & Inspire',
      description: 'Style your current pieces with AI lookbooks and earn points in the gallery.',
      icon: Shirt,
      color: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-400',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
      id: 'care',
      title: 'Care & Repair',
      description: 'Find local tailors or use AI to fix tears and upcycle old clothes.',
      icon: Scissors,
      color: 'bg-amber-100 dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-400',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
      id: 'share',
      title: 'Share & Swap',
      description: 'Join the community marketplace to find a new home for your pre-loved favorites.',
      icon: Repeat,
      color: 'bg-emerald-100 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
      id: 'loop',
      title: 'The ECO Maze',
      description: 'Progress through sustainability milestones and unlock real-world rewards.',
      icon: MapIcon,
      color: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400',
      image: 'https://images.unsplash.com/photo-1518005020251-58296d8f8d71?q=80&w=400&h=300&auto=format&fit=crop'
    }
  ];

  return (
    <div className="px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif">Explore the Loop</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">Your circular fashion journey, simplified.</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-3xl border border-amber-200 dark:border-amber-800/20 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white"><Leaf size={20} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Daily Loop Status</p>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">2 Quests Available</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className="group relative bg-white dark:bg-zinc-900 rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 dark:border-white/5 text-left flex flex-col h-full"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <img 
                src={item.image} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" 
                alt={item.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className={`${item.color} p-3 rounded-2xl backdrop-blur-md`}>
                  <item.icon size={28} className={item.textColor} />
                </div>
                <h3 className="text-3xl font-bold text-white serif">{item.title}</h3>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between gap-4">
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{item.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest">
                Start Section <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
