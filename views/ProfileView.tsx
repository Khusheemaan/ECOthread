
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Save, Sparkles, LogOut, Camera, Calendar, Phone, AtSign, Plus, X, Pencil, Upload } from 'lucide-react';
import { updateUserProfileAPI } from '../services/apiService';

interface ProfileViewProps {
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onLoginRequest: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onLogout, onLoginRequest }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    dob: '',
    stylePreferences: [] as string[]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [otherStyle, setOtherStyle] = useState('');
  const [isAddingOtherStyle, setIsAddingOtherStyle] = useState(false);
  
  // Avatar Update State
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        stylePreferences: user.stylePreferences || []
      });
    }
  }, [user]);

  const styleOptions = [
    "Vintage", "Minimalist", "Streetwear", "Bohemian", "Chic", "Grunge", "Athleisure", "Preppy", "Y2K"
  ];

  const handleSave = async () => {
    if (!user) return;

    try {
      const profileUpdates = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        dob: formData.dob,
        stylePreferences: formData.stylePreferences
      };

      const result = await updateUserProfileAPI(user.id, profileUpdates);

      if (result.success) {
        onUpdateUser(result.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert('Failed to update profile: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Avatar Update Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
        setShowAvatarOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Could not access camera.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && user) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      onUpdateUser({ ...user, avatar: canvas.toDataURL('image/jpeg') });
      stopCamera();
      setShowAvatarOptions(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const toggleStyle = (style: string) => {
    setFormData(prev => {
      const exists = prev.stylePreferences.includes(style);
      if (exists) {
        return { ...prev, stylePreferences: prev.stylePreferences.filter(s => s !== style) };
      } else {
        return { ...prev, stylePreferences: [...prev.stylePreferences, style] };
      }
    });
  };

  const addOtherStyle = () => {
    if (otherStyle.trim() && !formData.stylePreferences.includes(otherStyle.trim())) {
      setFormData(prev => ({
        ...prev,
        stylePreferences: [...prev.stylePreferences, otherStyle.trim()]
      }));
      setOtherStyle('');
      setIsAddingOtherStyle(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 transition-colors">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <UserIcon size={40} className="text-gray-400 dark:text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] mb-2 serif">Guest Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">Log in to customize your profile, save your style preferences, and track your eco-journey.</p>
        <button onClick={onLoginRequest} className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-8 py-3 rounded-xl font-bold transition-all">Log In / Sign Up</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-8 transition-colors">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif">My Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Update your details and style.</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-[#4a5d4e]/10 dark:bg-[#8ea894]/10 text-[#4a5d4e] dark:text-[#8ea894] rounded-full hover:bg-[#4a5d4e]/20 dark:hover:bg-[#8ea894]/20 transition-all font-bold text-sm"
            >
              <Pencil size={18} />
              <span>Edit</span>
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="flex items-center gap-2 px-4 py-2 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black rounded-full hover:opacity-90 transition-all font-bold text-sm"
            >
              <Save size={18} />
              <span>Save</span>
            </button>
          )}
          <button 
            onClick={onLogout} 
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Avatar Section */}
      <section className="flex flex-col items-center">
        <div className="relative group">
          <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 object-cover shadow-lg" />
          <button 
            onClick={() => setShowAvatarOptions(true)} 
            className="absolute bottom-0 right-0 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={18} />
          </button>
        </div>
      </section>

      {/* Avatar Update Modal */}
      {showAvatarOptions && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowAvatarOptions(false); if(isCameraActive) stopCamera(); }}></div>
          <div className="relative bg-[#fcfbf7] dark:bg-zinc-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl p-8 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-black dark:text-white serif">Update Photo</h3>
              <button onClick={() => { setShowAvatarOptions(false); if(isCameraActive) stopCamera(); }} className="dark:text-white"><X /></button>
            </div>

            {!isCameraActive ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-black border-2 border-dashed border-[#4a5d4e]/20 dark:border-white/10 rounded-2xl hover:border-[#4a5d4e] transition-colors"
                >
                  <Upload size={32} className="text-[#4a5d4e] dark:text-[#8ea894]" />
                  <span className="text-xs font-bold text-black dark:text-white uppercase">Upload</span>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </button>
                <button 
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-black border-2 border-dashed border-[#4a5d4e]/20 dark:border-white/10 rounded-2xl hover:border-[#4a5d4e] transition-colors"
                >
                  <Camera size={32} className="text-[#4a5d4e] dark:text-[#8ea894]" />
                  <span className="text-xs font-bold text-black dark:text-white uppercase">Camera</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square bg-black rounded-2xl overflow-hidden relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3">
                  <button onClick={stopCamera} className="flex-1 bg-gray-200 dark:bg-zinc-800 text-black dark:text-white py-3 rounded-xl font-bold">Cancel</button>
                  <button onClick={capturePhoto} className="flex-1 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-3 rounded-xl font-bold">Snap!</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personal Details Form */}
      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-lg font-bold text-black dark:text-white"><UserIcon size={20} /> Personal Details</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">First Name</label>
            <input 
              type="text" disabled={!isEditing} value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Last Name</label>
            <input 
              type="text" disabled={!isEditing} value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Username</label>
            <input 
              type="text" disabled={!isEditing} value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Email</label>
            <input 
              type="email" disabled={!isEditing} value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Phone Number</label>
            <input 
              type="tel" disabled={!isEditing} value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="Optional"
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Date of Birth</label>
            <input 
              type="date" disabled={!isEditing} value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
              className="w-full bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4a5d4e] disabled:opacity-50"
            />
          </div>
        </div>
      </section>

      {/* Style Preferences */}
      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-lg font-bold text-black dark:text-white"><Sparkles size={20} /> Style Preferences</div>
        
        <div className="flex flex-wrap gap-2">
          {styleOptions.map(style => {
            const isSelected = formData.stylePreferences.includes(style);
            return (
              <button
                key={style}
                onClick={() => isEditing && toggleStyle(style)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  isSelected 
                  ? 'bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black border-transparent' 
                  : 'bg-[#fcfbf7] dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                } disabled:opacity-80`}
              >
                {style}
              </button>
            );
          })}
          
          {/* Custom style tags */}
          {formData.stylePreferences.filter(s => !styleOptions.includes(s)).map(style => (
            <div key={style} className="flex items-center gap-1 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold">
              {style}
              {isEditing && <button onClick={() => toggleStyle(style)} className="p-0.5"><X size={12} /></button>}
            </div>
          ))}

          {isEditing && (
            <button 
              onClick={() => setIsAddingOtherStyle(!isAddingOtherStyle)}
              className="px-4 py-2 rounded-full text-xs font-bold border-2 border-dashed border-[#4a5d4e]/30 text-[#4a5d4e] dark:text-[#8ea894] flex items-center gap-1"
            >
              <Plus size={14} /> Other
            </button>
          )}
        </div>

        {isAddingOtherStyle && (
          <div className="flex gap-2 animate-in slide-in-from-top-2">
            <input 
              type="text" value={otherStyle}
              onChange={e => setOtherStyle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addOtherStyle()}
              placeholder="e.g. Punk, Retro"
              className="flex-1 bg-[#fcfbf7] dark:bg-black border dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-black dark:text-white focus:outline-none"
            />
            <button onClick={addOtherStyle} className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold">Add</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfileView;
