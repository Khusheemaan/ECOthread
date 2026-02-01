
import React from 'react';
import { ShoppingBag, Trash2, ChevronRight, ArrowLeft, Shirt, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  total: string;
}

const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onRemove, onCheckout, total }) => {
  return (
    <div className="px-6 py-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-[#fcfbf7] mb-2 serif">Your Loop Cart</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Review your pre-loved picks and complete the circle.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-full border border-amber-200 dark:border-amber-800/20">
          <ShoppingBag size={18} className="text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">{cart.length} {cart.length === 1 ? 'Item' : 'Items'} Ready</span>
        </div>
      </section>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 items-center border dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-inner border dark:border-white/10 shrink-0">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest bg-[#4a5d4e]/5 dark:bg-[#8ea894]/5 px-2 py-0.5 rounded">{item.brand || 'Eco Choice'}</span>
                  </div>
                  <h4 className="text-2xl font-bold serif truncate text-zinc-900 dark:text-white">{item.name}</h4>
                  <p className="text-sm text-zinc-400 font-medium">{item.category} • {item.color} • {item.fabric}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l dark:border-white/5 sm:pl-6">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Price</p>
                    <p className="text-xl font-bold text-[#4a5d4e] dark:text-[#8ea894]">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-zinc-50 dark:bg-black rounded-xl border dark:border-white/10 p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-[#fcfbf7] dark:bg-black/40 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm">
                 <Shirt size={24} className="text-zinc-300" />
               </div>
               <p className="text-zinc-500 font-medium max-w-xs">Want to add more to your sustainable loop? Explore the marketplace for more gems.</p>
               <button onClick={() => window.location.hash = 'share'} className="text-[#4a5d4e] dark:text-[#8ea894] font-bold text-sm uppercase tracking-widest hover:underline">Continue Looping</button>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border dark:border-white/5 shadow-2xl sticky top-24 space-y-8 animate-in slide-in-from-right duration-500">
               <h3 className="text-2xl font-bold serif text-zinc-900 dark:text-white">Loop Summary</h3>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="text-zinc-900 dark:text-white font-bold">${total} CAD</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-zinc-500">Transit Loop</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                 </div>
                 <div className="pt-4 border-t dark:border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</p>
                      <p className="text-3xl font-bold text-zinc-900 dark:text-white serif">${total} CAD</p>
                    </div>
                 </div>
               </div>

               <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-start gap-3 border border-amber-100 dark:border-amber-900/20">
                 <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                 <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">By completing this loop, you are extending the lifecycle of {cart.length} garment{cart.length > 1 ? 's' : ''} and reducing textile waste.</p>
               </div>

               <button 
                onClick={onCheckout}
                className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-5 rounded-2xl font-bold text-lg shadow-xl hover:opacity-90 hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                 Checkout & Loop <ChevronRight size={20} />
               </button>

               <div className="flex items-center justify-center gap-4 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                 <span>Secure</span>
                 <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                 <span>Sustainable</span>
                 <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                 <span>Verified</span>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in-95 duration-500 bg-white dark:bg-zinc-900 rounded-[48px] border-4 border-dashed dark:border-white/5">
          <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <ShoppingBag size={48} className="text-zinc-200" />
          </div>
          <h3 className="text-3xl font-bold serif text-zinc-900 dark:text-white mb-2">Your cart is empty</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium leading-relaxed">The loop starts with a single thread. Head over to the Marketplace to find your first pre-loved treasure.</p>
          <button 
            onClick={() => window.location.hash = 'share'}
            className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl transition-all flex items-center gap-3 active:scale-95"
          >
            Explore Marketplace <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartView;
