
import React, { useState, useRef } from 'react';
import { getOutfitSuggestions } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Plus, Heart, Share2, Shirt, Camera, ChevronRight, Leaf, Eye, X, Upload, CheckCircle2 } from 'lucide-react';

const WearView: React.FC = () => {
  const [garmentInput, setGarmentInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [dynamicMatches, setDynamicMatches] = useState<any[]>([]);
  
  // Upload Gallery Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated editorial style inspiration showing models in various outfits
  const styleInspirationItems = [
    {
      id: 'insp-1',
      title: 'Minimalist Loop',
      tag: 'Eco-Linen',
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      prompt: "Yellow minimalist summer set"
    },
    {
      id: 'insp-2',
      title: 'Streetwear Find',
      tag: 'Vintage Denim',
      img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop",
      prompt: "Oversized utility jacket with denim"
    },
    {
      id: 'insp-3',
      title: 'Bohemian Story',
      tag: 'Thrifted Silk',
      img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
      prompt: "Floral maxi dress with textures"
    },
    {
      id: 'insp-4',
      title: 'Modern Classic',
      tag: 'Pre-loved Wool',
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      prompt: "Tailored beige blazer and trousers"
    },
    {
      id: 'insp-5',
      title: 'Retro Revival',
      tag: '70s Vintage',
      img: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?q=80&w=800&auto=format&fit=crop",
      prompt: "Vintage patterned knitwear"
    },
    {
      id: 'insp-6',
      title: 'Urban Explorer',
      tag: 'Upcycled Nylon',
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
      prompt: "Technical windbreaker and cargos"
    }
  ];

  // Image pool mapped to common garment keywords for dynamic matches
  const communityImagePool: Record<string, any[]> = {
    dress: [
      { id: 'd1', img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400", user: "@lin_eco", likes: 142, tag: "Summer Loop" },
      { id: 'd2', img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400", user: "@floral_fix", likes: 89, tag: "Thrifted" }
    ],
    blazer: [
      { id: 'b1', img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400", user: "@tailored_loop", likes: 210, tag: "Corporate Chic" },
      { id: 'b2', img: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400", user: "@vintage_prof", likes: 156, tag: "Second Hand" }
    ],
    shirt: [
      { id: 's1', img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400", user: "@minimal_max", likes: 320, tag: "Button Up" },
      { id: 's2', img: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=400", user: "@linen_lover", likes: 94, tag: "Sustainable" }
    ],
    jeans: [
      { id: 'j1', img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400", user: "@denim_doctor", likes: 412, tag: "Mended" },
      { id: 'j2', img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400", user: "@indigo_loop", likes: 203, tag: "Classic" }
    ],
    default: [
      { id: 'df1', img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400", user: "@sarah_eco", likes: 124, tag: "Matching Vibe" },
      { id: 'df2', img: "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=400", user: "@marcus_v", likes: 89, tag: "Minimalist" },
      { id: 'df3', img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=400", user: "@vintage_vibe", likes: 210, tag: "Streetwear" }
    ]
  };

  const handleGenerate = async () => {
    if (!garmentInput) return;
    setIsLoading(true);
    
    // Simulate finding matching community looks
    const input = garmentInput.toLowerCase();
    let matches: any[] = [];
    
    if (input.includes('dress')) matches = [...communityImagePool.dress];
    else if (input.includes('blazer') || input.includes('jacket')) matches = [...communityImagePool.blazer];
    else if (input.includes('shirt') || input.includes('top') || input.includes('blouse')) matches = [...communityImagePool.shirt];
    else if (input.includes('jeans') || input.includes('denim') || input.includes('pants')) matches = [...communityImagePool.jeans];
    else matches = [...communityImagePool.default];

    const result = await getOutfitSuggestions(garmentInput);
    if (result) {
      setSuggestions(result);
      setDynamicMatches(matches);
      setShowInspiration(true);
    }
    setIsLoading(false);
  };

  const handleApplyPrompt = (prompt: string) => {
    setGarmentInput(prompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadGallery = async () => {
    if (!uploadImage) return;
    setIsUploading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadSuccess(false);
      setUploadImage(null);
    }, 2000);
  };

  return (
    <div className="px-6 py-8 space-y-12 animate-in fade-in duration-500">
      <section>
        <h2 className="text-3xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] mb-2 serif">Wear & Inspire</h2>
        <p className="text-gray-600 dark:text-gray-400">Transform your current closet with AI styling and community looks.</p>
      </section>

      {/* AI Outfit Generator */}
      <section className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-sm border border-[#4a5d4e]/10 dark:border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif">AI Lookbook Generator</h3>
            <p className="text-sm text-gray-500">Smart styling for your existing pieces.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">What are you wearing? *</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={garmentInput}
                onChange={(e) => setGarmentInput(e.target.value)}
                placeholder="e.g. Oversized silk dress"
                className="flex-1 bg-[#fcfbf7] dark:bg-black border border-[#4a5d4e]/20 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50 text-zinc-900 dark:text-zinc-100 font-bold transition-all placeholder:text-gray-400"
              />
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <span className="animate-pulse">Styling...</span> : <><Sparkles size={18}/> Generate</>}
              </button>
            </div>
          </div>

          {(suggestions.length > 0 || isLoading) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? [1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-50 dark:bg-black/40 h-48 rounded-3xl animate-pulse" />
                )) : suggestions.map((s, idx) => (
                  <div key={idx} className="bg-[#fcfbf7] dark:bg-black p-6 rounded-3xl border border-[#4a5d4e]/5 dark:border-white/5 shadow-sm group">
                    <h4 className="font-bold text-[#4a5d4e] dark:text-[#8ea894] mb-3 text-lg leading-tight serif">{s.title}</h4>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed font-medium">
                      {s.description}
                    </p>
                    <ul className="text-[11px] space-y-2 text-zinc-600 dark:text-zinc-400 opacity-90 group-hover:opacity-100 transition-opacity">
                      {s.items.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                          <span className="font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Dynamic Styling Gallery - Shows matches for the input */}
              {showInspiration && !isLoading && (
                <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-[32px] border border-dashed border-[#4a5d4e]/20">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-bold text-[#2d3a30] dark:text-white flex items-center gap-2 serif">
                        <ImageIcon size={18} className="text-purple-500" /> Community Matches for "{garmentInput}"
                      </h4>
                      <p className="text-[10px] text-gray-500">Share how you wear this piece to inspire the loop community.</p>
                    </div>
                    <button className="text-[#4a5d4e] dark:text-[#8ea894] text-sm font-bold underline">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dynamicMatches.map((item) => (
                      <div key={item.id} className="aspect-[3/4] rounded-2xl overflow-hidden relative group cursor-pointer border dark:border-white/5">
                        <img src={item.img} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Style" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-white font-bold text-xs">{item.user}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] text-white/80 flex items-center gap-1"><Heart size={10} className="fill-red-500 text-red-500" /> {item.likes}</span>
                            <span className="text-[9px] text-white/80 uppercase font-bold tracking-tighter">{item.tag}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="aspect-[3/4] bg-[#fcfbf7] dark:bg-black rounded-2xl border-2 border-dashed border-[#4a5d4e]/20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors group/upload"
                    >
                      <Camera size={24} className="text-[#4a5d4e] dark:text-[#8ea894] group-hover/upload:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Share Your Look</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Style Inspiration Gallery */}
      <section className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif mb-2">Style Inspiration</h3>
            <p className="text-sm text-gray-500">Discover curated circular looks featuring models across the loop community.</p>
          </div>
          <button className="text-[#4a5d4e] dark:text-[#8ea894] text-sm font-bold flex items-center gap-1 group">
            Explore Full Lookbook <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {styleInspirationItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col border dark:border-white/5"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <button 
                    onClick={() => handleApplyPrompt(item.prompt)}
                    className="bg-white/90 backdrop-blur-md text-[#2d3a30] px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                  >
                    <Eye size={18} /> Get the Look
                  </button>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-[#4a5d4e]/90 dark:bg-[#8ea894]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-white dark:text-black uppercase tracking-widest shadow-lg">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white serif leading-tight mb-1">{item.title}</h4>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Community Feature</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-[#4a5d4e] dark:bg-[#8ea894] rounded-[48px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white dark:text-black shadow-inner">
              <Leaf size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white dark:text-black serif">Be the Inspiration</h4>
              <p className="text-white/80 dark:text-black/70 text-sm font-medium">upload you own model shots to the gallery</p>
            </div>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-white dark:bg-black text-[#4a5d4e] dark:text-[#8ea894] px-10 py-5 rounded-[24px] font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Join the Gallery
          </button>
        </div>
      </section>

      {/* Upload to Gallery Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => !isUploading && setIsUploadModalOpen(false)}></div>
          <div className="relative bg-[#fcfbf7] dark:bg-zinc-900 w-full max-w-lg rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95 transition-colors overflow-hidden border border-white dark:border-white/5">
            {uploadSuccess ? (
              <div className="text-center py-10 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white serif mb-2">Look Shared!</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Your look has been submitted to the community gallery for review.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4a5d4e]/10 dark:bg-[#8ea894]/10 rounded-xl text-[#4a5d4e] dark:text-[#8ea894]">
                      <ImageIcon size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white serif">Share Your Look</h2>
                  </div>
                  <button onClick={() => setIsUploadModalOpen(false)} disabled={isUploading} className="p-2 dark:text-white"><X /></button>
                </div>

                <div className="space-y-6">
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">Upload a model shot of your pre-loved styling to inspire others in the ECOthread loop.</p>
                  
                  <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[250px] relative group overflow-hidden">
                    {uploadImage ? (
                      <>
                        <img src={uploadImage} className="absolute inset-0 w-full h-full object-cover" alt="Upload Preview" />
                        <button 
                          onClick={() => setUploadImage(null)}
                          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                          <Upload size={32} />
                        </div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Click to upload photo</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Style Description</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Vintage 90s Streetwear" 
                         className="w-full bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                       />
                    </div>
                  </div>

                  <button 
                    onClick={handleUploadGallery}
                    disabled={isUploading || !uploadImage}
                    className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-5 rounded-2xl font-bold text-lg shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isUploading ? (
                      <>Processing...</>
                    ) : (
                      <>Join the Gallery</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WearView;
