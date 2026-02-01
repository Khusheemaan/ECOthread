import React, { useState, useMemo, useRef } from 'react';
import { Plus, X, Camera, Sparkles, Upload, AlertCircle, CheckCircle2, Tag, Filter, ChevronDown, DollarSign, Search, ShoppingCart, Trash2, User as UserIcon, LogIn } from 'lucide-react';
import { Garment, User } from '../types';

interface ShareViewProps {
  user: User | null;
  onAddToCart: (item: any) => void;
  onLoginRequest: () => void;
  onProgress?: () => void;
}

const COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Brown', 'Grey', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Multi-color', 'Other'];
const CATEGORY_OPTIONS = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Accessory', 'Footwear', 'Other'];
const BRAND_OPTIONS = ["Levi's", "Zara", "Patagonia", "Uniqlo", "Nike", "Adidas", "H&M", "Arc'teryx", "Everlane", "Thrifted", "Other"];
const STYLE_OPTIONS = ["Vintage", "Streetwear", "Minimalist", "Bohemian", "Sport", "Chic", "Grunge", "Y2K", "Formal"];
const MATERIAL_OPTIONS = ['Organic Cotton', 'Recycled Polyester', 'Wool', 'Linen', 'Hemp', 'Tencel', 'Silk', 'Leather', 'Denim', 'Other'];

const ShareView: React.FC<ShareViewProps> = ({ user, onAddToCart, onLoginRequest, onProgress }) => {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [userListings, setUserListings] = useState<Partial<Garment & { owner: string; priceNum: number }>[]>([]);

  const [newGarment, setNewGarment] = useState<Partial<Garment> & { 
    tempImages: string[]
  }>({
    name: '',
    category: 'Top',
    fabric: '',
    color: '',
    style: '',
    brand: '',
    repairs: 0,
    type: 'Resell',
    price: '',
    tempImages: []
  });

  const [customFields, setCustomFields] = useState({
    color: '',
    category: '',
    brand: '',
    fabric: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [filters, setFilters] = useState({
    color: '', 
    category: '',
    brand: '',
    style: '',
    minPrice: 0,
    maxPrice: 500
  });

  const initialMarketplaceItems: Partial<Garment & { owner: string; priceNum: number }>[] = [
    { 
      id: 'm1', name: "Vintage Levi's 501", price: "$45 CAD", priceNum: 45, type: "Resell", owner: "Elena", repairs: 1, 
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Blue', brand: "Levi's", category: 'Bottom', style: 'Vintage', fabric: 'Denim'
    },
    { 
      id: 'm2', name: "Linen Summer Dress", price: "$60 CAD", priceNum: 60, type: "Resell", owner: "Kai", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Red', brand: 'Zara', category: 'Dress', style: 'Bohemian', fabric: 'Linen'
    },
    { 
      id: 'm3', name: "Brown Utility Jacket", price: "$120 CAD", priceNum: 120, type: "Resell", owner: "Sarah", repairs: 2, 
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Brown', brand: 'Thrifted', category: 'Outerwear', style: 'Minimalist', fabric: 'Wool'
    },
    { 
      id: 'm4', name: "Technical Shell", price: "$350 CAD", priceNum: 350, type: "Resell", owner: "Marc", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Olive', brand: "Arc'teryx", category: 'Outerwear', style: 'Streetwear', fabric: 'Recycled Polyester'
    },
    { 
      id: 'm5', name: "Organic Cotton Tee", price: "$25 CAD", priceNum: 25, type: "Resell", owner: "Sacha", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Black', brand: "Uniqlo", category: 'Top', style: 'Minimalist', fabric: 'Organic Cotton'
    },
    { 
      id: 'm6', name: "White Linen Midi", price: "$85 CAD", priceNum: 85, type: "Resell", owner: "Nadia", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'White', brand: 'Everlane', category: 'Dress', style: 'Chic', fabric: 'Linen'
    },
    { 
      id: 'm7', name: "Better Sweater Fleece", price: "$95 CAD", priceNum: 95, type: "Resell", owner: "Jordan", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Grey', brand: 'Patagonia', category: 'Outerwear', style: 'Sport', fabric: 'Recycled Polyester'
    },
    { 
      id: 'm8', name: "Leather Crossbody", price: "$55 CAD", priceNum: 55, type: "Resell", owner: "Mia", repairs: 1, 
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Brown', brand: 'Other', category: 'Accessory', style: 'Vintage', fabric: 'Leather'
    },
    { 
      id: 'm9', name: "Retro Air Force 1", price: "$75 CAD", priceNum: 75, type: "Resell", owner: "Leo", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Red', brand: 'Nike', category: 'Footwear', style: 'Streetwear', fabric: 'Leather'
    },
    { 
      id: 'm12', name: "Pink Silk Slip", price: "$110 CAD", priceNum: 110, type: "Resell", owner: "Eva", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Pink', brand: 'Zara', category: 'Dress', style: 'Chic', fabric: 'Silk'
    },
    { 
      id: 'm13', name: "Purple Thrifted Hoodie", price: "$30 CAD", priceNum: 30, type: "Resell", owner: "Sam", repairs: 2, 
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Purple', brand: 'Thrifted', category: 'Top', style: 'Grunge', fabric: 'Organic Cotton'
    },
    { 
      id: 'm14', name: "Orange Utility Pants", price: "$65 CAD", priceNum: 65, type: "Resell", owner: "Finn", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Orange', brand: 'Adidas', category: 'Bottom', style: 'Streetwear', fabric: 'Recycled Polyester'
    },
    { 
      id: 'm15', name: "Multi-color Knit Scarf", price: "$20 CAD", priceNum: 20, type: "Resell", owner: "Lila", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Multi-color', brand: 'Other', category: 'Accessory', style: 'Bohemian', fabric: 'Wool'
    },
    { 
      id: 'm16', name: "Dark Grey Chinos", price: "$50 CAD", priceNum: 50, type: "Resell", owner: "Hugo", repairs: 0, 
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=400&h=400&auto=format&fit=crop",
      color: 'Grey', brand: 'Uniqlo', category: 'Bottom', style: 'Minimalist', fabric: 'Organic Cotton'
    }
  ];

  const filteredMarketplaceItems = useMemo(() => {
    return initialMarketplaceItems.filter(item => {
      if (filters.color && item.color !== filters.color) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.brand && item.brand !== filters.brand) return false;
      if (filters.style && item.style !== filters.style) return false;
      if (item.priceNum !== undefined) {
        if (item.priceNum < filters.minPrice || item.priceNum > filters.maxPrice) return false;
      }
      return true;
    });
  }, [filters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewGarment(prev => ({ 
            ...prev, 
            tempImages: [...prev.tempImages, reader.result as string].slice(0, 5)
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRef.current) cameraRef.current.srcObject = stream;
    } catch (err) {
      alert("Could not access camera.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = cameraRef.current.videoWidth;
      canvas.height = cameraRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(cameraRef.current, 0, 0);
      setNewGarment(prev => ({ 
        ...prev, 
        tempImages: [...prev.tempImages, canvas.toDataURL('image/jpeg')].slice(0, 5) 
      }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = cameraRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const removeImage = (index: number) => {
    setNewGarment(prev => ({
      ...prev,
      tempImages: prev.tempImages.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!newGarment.name?.trim()) errors.push("Item Name is required.");
    if (!newGarment.color) errors.push("Color selection is required.");
    else if (newGarment.color === 'Other' && !customFields.color.trim()) errors.push("Please specify the custom color.");
    if (!newGarment.fabric) errors.push("Material selection is required.");
    else if (newGarment.fabric === 'Other' && !customFields.fabric.trim()) errors.push("Please specify the custom material.");
    if (!newGarment.category) errors.push("Type selection is required.");
    else if (newGarment.category === 'Other' && !customFields.category.trim()) errors.push("Please specify the custom type.");
    if (newGarment.brand === 'Other' && !customFields.brand.trim()) errors.push("Please specify the custom brand.");
    if (!newGarment.price || isNaN(Number(newGarment.price)) || Number(newGarment.price) <= 0) {
        errors.push("A valid price is required.");
    }
    if (Number(newGarment.price) > 500) errors.push("Maximum price is $500 to keep it affordable.");
    if (!newGarment.tempImages || newGarment.tempImages.length === 0) errors.push("At least one photo is required.");
    setFormErrors(errors);
    if (errors.length > 0 && formContainerRef.current) {
      formContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return errors.length === 0;
  };

  const handleListGarment = async () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    if (!validateForm()) return;
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const finalColor = newGarment.color === 'Other' ? customFields.color : newGarment.color;
    const finalCategory = newGarment.category === 'Other' ? customFields.category : newGarment.category;
    const finalFabric = newGarment.fabric === 'Other' ? customFields.fabric : newGarment.fabric;
    const finalBrand = newGarment.brand === 'Other' ? customFields.brand : (newGarment.brand || 'Local Loop');
    const listingToAdd: Partial<Garment & { owner: string; priceNum: number }> = {
      id: `u-list-${Date.now()}`,
      name: newGarment.name,
      price: `$${newGarment.price} CAD`,
      priceNum: Number(newGarment.price),
      type: 'Resell',
      owner: user.name,
      repairs: newGarment.repairs || 0,
      imageUrl: newGarment.tempImages[0],
      color: finalColor,
      fabric: finalFabric,
      brand: finalBrand,
      category: finalCategory as any,
      style: newGarment.style || 'Modern'
    };
    setUserListings(prev => [listingToAdd, ...prev]);
    setIsPublishing(false);
    setIsSuccess(true);
    if (onProgress) onProgress();
    setTimeout(() => {
      setIsSuccess(false);
      setIsSellModalOpen(false);
      setNewGarment({
        name: '', category: 'Top', fabric: '', color: '',
        style: '', brand: '', repairs: 0, type: 'Resell', price: '', tempImages: []
      });
      setCustomFields({ color: '', category: '', brand: '', fabric: '' });
      setFormErrors([]);
    }, 2000);
  };

  const handleDeleteUserListing = (id: string) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      setUserListings(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), filters.maxPrice - 10);
    setFilters({ ...filters, minPrice: Math.max(0, value) });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), filters.minPrice + 10);
    setFilters({ ...filters, maxPrice: Math.min(500, value) });
  };

  return (
    <div className="px-6 py-8 space-y-10 animate-in fade-in duration-500 text-black">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-[#fcfbf7] mb-2 serif">The Marketplace</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Start the loop by discovering and reselling pre-loved favorites at affordable prices.</p>
        </div>
        <button 
          onClick={() => { setIsSellModalOpen(true); setFormErrors([]); setIsSuccess(false); }}
          className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl transition-all active:scale-95"
        >
          <Plus size={20} /> List Item
        </button>
      </section>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-white/5 shadow-sm space-y-8">
        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-bold serif text-xl">
          <Filter size={20} className="text-[#4a5d4e] dark:text-[#8ea894]" /> 
          Filters
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 text-black">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Type</label>
            <div className="relative">
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm text-black dark:text-zinc-100 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2 text-black">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Color</label>
            <div className="relative">
              <select 
                value={filters.color}
                onChange={(e) => setFilters({...filters, color: e.target.value})}
                className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm text-black dark:text-zinc-100 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Colors</option>
                {COLOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2 text-black">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Brand</label>
            <div className="relative">
              <select 
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
                className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm text-black dark:text-zinc-100 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Brands</option>
                {BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2 text-black">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Style</label>
            <div className="relative">
              <select 
                value={filters.style}
                onChange={(e) => setFilters({...filters, style: e.target.value})}
                className="w-full bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm text-black dark:text-zinc-100 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Styles</option>
                {STYLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 dark:border-white/5 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Price Range (CAD)</label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">$</span>
                  <input 
                    type="number" 
                    value={filters.minPrice} 
                    onChange={handleMinPriceChange}
                    className="w-24 bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-lg pl-6 pr-3 py-2 text-xs font-bold text-black dark:text-white"
                  />
                </div>
                <span className="text-zinc-300">—</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">$</span>
                  <input 
                    type="number" 
                    value={filters.maxPrice} 
                    onChange={handleMaxPriceChange}
                    className="w-24 bg-[#fcfbf7] dark:bg-black border border-zinc-200 dark:border-white/10 rounded-lg pl-6 pr-3 py-2 text-xs font-bold text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative h-10 flex items-center">
              <div className="absolute w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
              <div 
                className="absolute h-2 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-full" 
                style={{ 
                  left: `${(filters.minPrice / 500) * 100}%`, 
                  right: `${100 - (filters.maxPrice / 500) * 100}%` 
                }}
              ></div>
              <input 
                type="range" min="0" max="500" step="5" 
                value={filters.minPrice} 
                onChange={handleMinPriceChange}
                className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#4a5d4e] dark:accent-[#8ea894] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4a5d4e] [&::-webkit-slider-thumb]:rounded-full" 
              />
              <input 
                type="range" min="0" max="500" step="5" 
                value={filters.maxPrice} 
                onChange={handleMaxPriceChange}
                className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#4a5d4e] dark:accent-[#8ea894] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4a5d4e] [&::-webkit-slider-thumb]:rounded-full" 
              />
            </div>

            <button 
              onClick={() => setFilters({color: '', category: '', brand: '', style: '', minPrice: 0, maxPrice: 500})}
              className="text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-widest pb-2"
            >
              Clear
            </button>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">
             <span>$0</span>
             <span className="text-[#4a5d4e] dark:text-[#8ea894]">Active Range: ${filters.minPrice} - ${filters.maxPrice}</span>
             <span>$500</span>
          </div>
        </div>
      </section>

      {user && userListings.length > 0 && (
        <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-lg text-white dark:text-black">
                <UserIcon size={20} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-[#fcfbf7] serif">Your Listings</h3>
            </div>
            <span className="bg-[#4a5d4e]/10 dark:bg-[#8ea894]/10 text-[#4a5d4e] dark:text-[#8ea894] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {userListings.length} {userListings.length === 1 ? 'Item' : 'Items'} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userListings.map(item => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-sm border border-zinc-100 dark:border-white/5 transition-all group border-l-4 border-l-[#4a5d4e] dark:border-l-[#8ea894]">
                <div className="aspect-square relative overflow-hidden">
                   <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                   <div className="absolute top-6 right-6 bg-[#4a5d4e] dark:bg-[#8ea894] px-4 py-2 rounded-full text-[10px] font-bold text-white dark:text-black uppercase tracking-widest shadow-lg">
                     Your Item
                   </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-black">
                      <h4 className="text-2xl font-bold text-zinc-900 dark:text-white serif leading-tight">{item.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{item.category} • {item.color} • {item.fabric}</p>
                    </div>
                    <p className="text-[#4a5d4e] dark:text-[#8ea894] font-bold text-2xl">{item.price}</p>
                  </div>
                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-zinc-50 dark:border-white/5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Listing</span>
                    <button 
                      onClick={() => handleDeleteUserListing(item.id!)} 
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-[#fcfbf7] serif">Affordable Closet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMarketplaceItems.length > 0 ? filteredMarketplaceItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-sm border border-zinc-100 dark:border-white/5 transition-all group cursor-pointer hover:shadow-2xl">
              <div className="aspect-square relative overflow-hidden">
                 <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                 <div className="absolute top-6 right-6 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-zinc-900 dark:text-[#8ea894] uppercase tracking-widest shadow-lg">
                   Preloved
                 </div>
                 <div className="absolute bottom-6 left-6 flex gap-2">
                   <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter">{item.brand}</span>
                   <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter">{item.style}</span>
                 </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-black">
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-white serif leading-tight">{item.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{item.category} • {item.color} • {item.fabric}</p>
                  </div>
                  <p className="text-[#4a5d4e] dark:text-[#8ea894] font-bold text-2xl">{item.price}</p>
                </div>
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-zinc-50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-black">
                     <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">{item.owner?.[0]}</div>
                     <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">{item.owner}</span>
                  </div>
                  <button 
                    onClick={() => onAddToCart(item)} 
                    className="bg-zinc-900 dark:bg-[#8ea894] text-white dark:text-black px-6 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-300 mb-4">
                 <Search size={40} />
               </div>
               <p className="text-zinc-900 dark:text-zinc-100 font-bold serif text-2xl">No items match your loop.</p>
               <p className="text-zinc-500 text-sm max-w-xs mx-auto">Try resetting the Filters to find more affordable pieces.</p>
               <button onClick={() => setFilters({color: '', category: '', brand: '', style: '', minPrice: 0, maxPrice: 500})} className="text-[#4a5d4e] dark:text-[#8ea894] font-bold underline">Clear All Filters</button>
            </div>
          )}
        </div>
      </section>

      {isSellModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { if(!isSuccess && !isPublishing) setIsSellModalOpen(false); stopCamera(); }}></div>
          <div className="relative bg-[#fcfbf7] dark:bg-zinc-900 w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors border border-white dark:border-white/10">
            <div className="p-8 border-b dark:border-white/10 flex justify-between items-center bg-white dark:bg-black">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white serif">Start a New Loop</h2>
              <button onClick={() => { setIsSellModalOpen(false); stopCamera(); }} className="p-3 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors"><X /></button>
            </div>
            <div ref={formContainerRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar text-black">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={56} />
                  </div>
                  <h3 className="text-4xl font-bold text-zinc-900 dark:text-white serif mb-3">Item Listed!</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">Your piece is now available for other Loopers to discover.</p>
                </div>
              ) : (
                <>
                  {formErrors.length > 0 && (
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[32px] animate-in slide-in-from-top-4">
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 list-disc pl-5 font-bold">
                        {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Garment Photos *</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {newGarment.tempImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-[24px] overflow-hidden relative border border-zinc-100 dark:border-white/10 group">
                          <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                          <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                        </div>
                      ))}
                      {newGarment.tempImages.length < 5 && (
                        <div className="aspect-square bg-white dark:bg-black border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-[24px] flex flex-col gap-1 p-2">
                          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center text-[#4a5d4e] dark:text-[#8ea894] hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-[18px]"><Upload size={24} /><span className="text-[10px] font-bold uppercase mt-1">File</span></button>
                          <button onClick={startCamera} className="flex-1 flex flex-col items-center justify-center text-[#4a5d4e] dark:text-[#8ea894] hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-[18px]"><Camera size={24} /><span className="text-[10px] font-bold uppercase mt-1">Camera</span></button>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                        </div>
                      )}
                    </div>
                  </div>
                  {isCameraActive && (
                    <div className="fixed inset-0 z-[130] bg-black flex flex-col items-center justify-center p-6">
                      <div className="relative w-full max-w-lg aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900"><video ref={cameraRef} autoPlay playsInline className="w-full h-full object-cover" /></div>
                      <div className="flex gap-10 mt-12 items-center">
                        <button onClick={stopCamera} className="bg-white/10 text-white p-6 rounded-full"><X size={32}/></button>
                        <button onClick={capturePhoto} className="w-24 h-24 bg-white rounded-full border-[10px] border-zinc-300 active:scale-95 transition-all"></button>
                        <div className="w-16"></div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Item Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Silk Wrap Dress" 
                        className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                        value={newGarment.name}
                        onChange={e => setNewGarment({...newGarment, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Price (Max $500) *</label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</div>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl pl-10 pr-5 py-4 text-black dark:text-white font-bold focus:outline-none"
                          value={newGarment.price}
                          onChange={e => setNewGarment({...newGarment, price: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest block mb-1">Color *</label>
                      <select value={newGarment.color} onChange={e => setNewGarment({...newGarment, color: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white focus:outline-none">
                        <option value="">Select</option>
                        {COLOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {newGarment.color === 'Other' && (
                        <input type="text" placeholder="Specify Color..." value={customFields.color} onChange={e => setCustomFields({...customFields, color: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-black dark:text-white mt-2 animate-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest block mb-1">Type *</label>
                      <select value={newGarment.category} onChange={e => setNewGarment({...newGarment, category: e.target.value as any})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white focus:outline-none">
                        <option value="">Select</option>
                        {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {newGarment.category === 'Other' && (
                        <input type="text" placeholder="Specify Type..." value={customFields.category} onChange={e => setCustomFields({...customFields, category: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-black dark:text-white mt-2 animate-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest block mb-1">Brand</label>
                      <select value={newGarment.brand} onChange={e => setNewGarment({...newGarment, brand: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white focus:outline-none">
                        <option value="">Select</option>
                        {BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {newGarment.brand === 'Other' && (
                        <input type="text" placeholder="Specify Brand..." value={customFields.brand} onChange={e => setCustomFields({...customFields, brand: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-black dark:text-white mt-2 animate-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest block mb-1">Material *</label>
                      <select value={newGarment.fabric} onChange={e => setNewGarment({...newGarment, fabric: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white focus:outline-none">
                        <option value="">Select</option>
                        {MATERIAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {newGarment.fabric === 'Other' && (
                        <input type="text" placeholder="Specify Material..." value={customFields.fabric} onChange={e => setCustomFields({...customFields, fabric: e.target.value})} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-black dark:text-white mt-2 animate-in slide-in-from-top-1" />
                      )}
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[32px] border border-amber-100 dark:border-amber-800/10 text-black">
                    <div className="flex items-center gap-3 mb-5 text-amber-900 dark:text-amber-400 font-bold text-lg"><Sparkles size={22} /> Garment Story</div>
                    <textarea placeholder="Tell us about this item's journey..." className="w-full bg-white dark:bg-black border border-amber-100 dark:border-white/10 rounded-[24px] p-5 text-sm text-black dark:text-zinc-200 focus:outline-none h-40 resize-none font-bold"></textarea>
                  </div>
                </>
              )}
            </div>
            {!isSuccess && (
              <div className="p-10 bg-white dark:bg-black border-t dark:border-white/10">
                <button 
                  onClick={handleListGarment} 
                  disabled={isPublishing} 
                  className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-5 rounded-2xl font-bold shadow-lg hover:opacity-95 disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : user ? 'List Item for Resale' : 'Login to List'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareView;
