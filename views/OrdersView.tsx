
import React, { useState, useMemo } from 'react';
/* Added missing ShieldCheck and Globe icons to the import list from lucide-react */
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, Printer, Send, Search, AlertCircle, ArrowUpRight, ArrowDownLeft, History, Map as MapIcon, ChevronRight, Info, ShieldCheck, Globe } from 'lucide-react';
import { Order, User } from '../types';

interface OrdersViewProps {
  user: User | null;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onLoginRequest: () => void;
}

const OrdersView: React.FC<OrdersViewProps> = ({ user, orders, onUpdateOrderStatus, onLoginRequest }) => {
  const [mainTab, setMainTab] = useState<'history' | 'tracking'>('history');
  const [historySubTab, setHistorySubTab] = useState<'sales' | 'purchases'>('purchases');
  const [trackingSearch, setTrackingSearch] = useState('');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  const sales = useMemo(() => orders.filter(o => o.type === 'Sale'), [orders]);
  const purchases = useMemo(() => orders.filter(o => o.type === 'Purchase'), [orders]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 transition-colors">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <Package size={40} className="text-gray-400 dark:text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 serif">Your Orders</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs">Log in to manage your sales and track your purchases.</p>
        <button onClick={onLoginRequest} className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">Sign In</button>
      </div>
    );
  }

  const handleTrackingSearch = () => {
    const found = orders.find(o => 
      o.id.toLowerCase() === trackingSearch.toLowerCase() || 
      o.trackingNumber.toLowerCase() === trackingSearch.toLowerCase()
    );
    if (found) {
      setSelectedTrackingOrder(found);
      setMainTab('tracking');
    } else {
      alert("Order ID or Tracking Number not found in your loop history.");
    }
  };

  const selectTrackingOrder = (order: Order) => {
    setSelectedTrackingOrder(order);
    setMainTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-6 py-8 space-y-10 animate-in fade-in duration-500 text-zinc-900 dark:text-zinc-100 transition-colors">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold serif mb-2">Order Center</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Manage your circular fashion history and track active loops.</p>
        </div>
        
        {/* Sub-sections: Order History vs Track Order */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-[20px] w-full md:w-auto shadow-inner">
          <button 
            onClick={() => setMainTab('history')}
            className={`flex-1 md:px-6 py-2.5 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${mainTab === 'history' ? 'bg-white dark:bg-black text-[#4a5d4e] dark:text-[#8ea894] shadow-md' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <History size={14} /> Order History
          </button>
          <button 
            onClick={() => setMainTab('tracking')}
            className={`flex-1 md:px-6 py-2.5 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${mainTab === 'tracking' ? 'bg-white dark:bg-black text-[#4a5d4e] dark:text-[#8ea894] shadow-md' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <MapIcon size={14} /> Track Your Order
          </button>
        </div>
      </section>

      {mainTab === 'history' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
          {/* History Categories */}
          <div className="flex gap-10 border-b dark:border-white/5 pb-1">
            <button 
              onClick={() => setHistorySubTab('purchases')}
              className={`pb-3 px-1 text-sm font-bold transition-all relative ${historySubTab === 'purchases' ? 'text-[#4a5d4e] dark:text-[#8ea894]' : 'text-zinc-400'}`}
            >
              Purchases ({purchases.length})
              {historySubTab === 'purchases' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-full animate-in zoom-in-y" />}
            </button>
            <button 
              onClick={() => setHistorySubTab('sales')}
              className={`pb-3 px-1 text-sm font-bold transition-all relative ${historySubTab === 'sales' ? 'text-[#4a5d4e] dark:text-[#8ea894]' : 'text-zinc-400'}`}
            >
              Sales ({sales.length})
              {historySubTab === 'sales' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-full animate-in zoom-in-y" />}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(historySubTab === 'purchases' ? purchases : sales).length > 0 ? (
              (historySubTab === 'purchases' ? purchases : sales).map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border dark:border-white/5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner border dark:border-white/10 shrink-0">
                      <img src={order.itemImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={order.itemName} />
                    </div>
                    <div className="flex-1 text-center md:text-left min-w-0 space-y-2">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                         <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                           order.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 
                           order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 
                           'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                         }`}>
                           {order.status}
                         </span>
                         <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{order.date} • Loop {order.id}</span>
                      </div>
                      <h4 className="text-2xl font-bold serif truncate">{order.itemName}</h4>
                      <p className="text-sm text-zinc-500 font-medium">
                        {historySubTab === 'purchases' ? `Partner: ${order.counterparty}` : `Customer: ${order.counterparty}`} • {order.price}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                       <button 
                         onClick={() => selectTrackingOrder(order)}
                         className="px-8 py-3 bg-[#2d3a30] dark:bg-[#8ea894] text-white dark:text-black rounded-xl text-xs font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <MapIcon size={14}/> Track Live
                       </button>
                       {order.status === 'Pending' && order.type === 'Sale' && (
                         <button 
                           onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                           className="px-8 py-3 border-2 border-[#4a5d4e] dark:border-[#8ea894] text-[#4a5d4e] dark:text-[#8ea894] rounded-xl text-xs font-bold hover:bg-[#4a5d4e] hover:text-white dark:hover:bg-[#8ea894] dark:hover:text-black transition-all flex items-center justify-center gap-2"
                         >
                            Confirm Shipping
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center bg-zinc-50 dark:bg-white/5 rounded-[48px] border-4 border-dashed dark:border-white/5">
                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Package size={40} className="text-zinc-300" />
                </div>
                <h3 className="text-2xl font-bold serif mb-2">No activity recorded</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Your circular fashion milestones will be archived here once you start looping.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in slide-in-from-right duration-300">
          {/* Tracking Search Input */}
          <div className="max-w-2xl mx-auto space-y-6">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Enter Loop ID (e.g. ORD-8291) or Tracking #..." 
                  value={trackingSearch}
                  onChange={e => setTrackingSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrackingSearch()}
                  className="w-full bg-white dark:bg-zinc-900 border-2 dark:border-white/10 rounded-[28px] px-8 py-6 pr-20 text-base font-bold focus:outline-none focus:ring-4 focus:ring-[#4a5d4e]/20 dark:focus:ring-[#8ea894]/10 shadow-2xl transition-all"
                />
                <button 
                  onClick={handleTrackingSearch}
                  className="absolute right-3.5 top-3.5 bottom-3.5 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-6 rounded-[20px] font-bold hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                  <Search size={22}/>
                </button>
             </div>
             <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500"/> Verified Loops</span>
                <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500"/> Carbon Neutral Transit</span>
             </div>
          </div>

          {selectedTrackingOrder ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
               {/* Order Details Column */}
               <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border dark:border-white/5 shadow-2xl space-y-8 animate-in slide-in-from-left duration-500">
                   <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-inner bg-zinc-50 dark:bg-black">
                      <img src={selectedTrackingOrder.itemImage} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest shadow-lg">
                        {selectedTrackingOrder.status}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-widest">Active Loop</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">{selectedTrackingOrder.date}</p>
                      </div>
                      <h3 className="text-3xl font-bold serif leading-tight">{selectedTrackingOrder.itemName}</h3>
                      <p className="text-sm text-zinc-400 font-mono tracking-tighter">{selectedTrackingOrder.trackingNumber}</p>
                   </div>
                   <div className="pt-8 border-t dark:border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-lg text-[#4a5d4e] dark:text-[#8ea894] shadow-sm">
                           {selectedTrackingOrder.counterparty[0]}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Looped with</p>
                            <p className="text-base font-bold truncate">{selectedTrackingOrder.counterparty}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[#4a5d4e] dark:text-[#8ea894] shadow-sm">
                           <MapPin size={22} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Destination</p>
                            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">{selectedTrackingOrder.shippingAddress}</p>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Live Tracking Timeline Column */}
               <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right duration-500">
                 <div className="bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[48px] border dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                       <div>
                          <h3 className="text-3xl font-bold serif">Live Transit Loop</h3>
                          <p className="text-zinc-500 text-sm mt-1">Real-time status updates from our circular logistics hub.</p>
                       </div>
                       <div className="bg-green-500/10 px-5 py-2 rounded-2xl flex items-center gap-3 border border-green-500/20">
                         <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                         <span className="text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest">System Operational</span>
                       </div>
                    </div>

                    {/* Timeline Path */}
                    <div className="space-y-12 relative">
                       {/* Main Connector */}
                       <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] transition-all duration-1000" style={{ height: `${(selectedTrackingOrder.transitHistory.filter(s => s.completed).length / selectedTrackingOrder.transitHistory.length) * 100}%` }}></div>
                       </div>
                       
                       {selectedTrackingOrder.transitHistory.map((step, idx) => (
                         <div key={idx} className={`flex gap-10 relative z-10 transition-all duration-700 ${!step.completed ? 'opacity-30 grayscale blur-[0.5px]' : 'scale-100'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xl transition-all ${
                              step.completed 
                              ? 'bg-[#2d3a30] dark:bg-[#8ea894] text-white dark:text-black scale-110 ring-4 ring-[#4a5d4e]/10 dark:ring-[#8ea894]/10' 
                              : 'bg-white dark:bg-zinc-800 border-4 border-zinc-100 dark:border-white/5 text-zinc-300'
                            }`}>
                               {step.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>}
                            </div>
                            <div className="flex-1 pb-4">
                               <div className="flex flex-col md:flex-row justify-between items-start gap-1 md:items-center">
                                  <h4 className={`font-bold text-xl ${step.completed ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>{step.status}</h4>
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{step.time}</span>
                               </div>
                               <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2 font-medium">
                                 <MapPin size={14} className={step.completed ? "text-[#4a5d4e] dark:text-[#8ea894]" : "text-zinc-300"} /> {step.location}
                               </p>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-16 pt-10 border-t dark:border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center bg-zinc-50/50 dark:bg-black/20 -mx-10 md:-mx-14 -mb-10 md:-mb-14 p-10">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">
                            <Truck className="text-[#4a5d4e] dark:text-[#8ea894]" size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Estimated Arrival</p>
                            <p className="text-xl font-bold">{new Date(new Date().getTime() + 86400000*3).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                          </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                          <button className="flex-1 md:px-8 py-4 bg-white dark:bg-zinc-800 border dark:border-white/10 rounded-2xl text-xs font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                             <Printer size={16}/> Receipt
                          </button>
                          <button className="flex-1 md:px-8 py-4 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black rounded-2xl text-xs font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                            <ExternalLink size={16}/> Details
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-24 text-center space-y-10 animate-in zoom-in-95 duration-500">
               <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-[60px] blur-[100px] opacity-10"></div>
                  <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-[50px] flex items-center justify-center mx-auto shadow-2xl group transition-all hover:scale-105 hover:rotate-2 duration-500 border dark:border-white/10">
                     <Truck size={56} className="text-[#4a5d4e] dark:text-[#8ea894] group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-4xl font-bold serif">Ready to track your loop?</h3>
                  <p className="text-zinc-500 max-w-md mx-auto text-lg">Select an order from your history tab or enter a Loop ID above to see live circular tracking in action.</p>
               </div>
               
               {/* Quick Select Grid */}
               {orders.length > 0 && (
                 <div className="pt-8 space-y-6">
                    <p className="text-[11px] font-bold text-[#4a5d4e] dark:text-[#8ea894] uppercase tracking-[0.2em]">Recent Activity</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {orders.slice(0, 3).map(o => (
                         <button 
                           key={o.id}
                           onClick={() => selectTrackingOrder(o)}
                           className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-[24px] border-2 border-transparent hover:border-[#4a5d4e] dark:hover:border-[#8ea894] shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
                         >
                            <img src={o.itemImage} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                            <div className="text-left flex-1 min-w-0">
                               <p className="text-sm font-bold truncate group-hover:text-[#4a5d4e] dark:group-hover:text-[#8ea894]">{o.itemName}</p>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{o.id}</p>
                            </div>
                            <ChevronRight size={18} className="text-zinc-200 group-hover:text-[#4a5d4e] dark:group-hover:text-[#8ea894] transition-colors" />
                         </button>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersView;
