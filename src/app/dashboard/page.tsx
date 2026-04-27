"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// --- Sub-Components ---

function Sidebar({ activeTab, setActiveTab, handleLogout, isOpen, setIsOpen, role }: any) {
  const adminItems = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'orders', icon: 'shopping_cart', label: 'Orders' },
    { id: 'products', icon: 'inventory_2', label: 'Products' },
    { id: 'reviews', icon: 'rate_review', label: 'Reviews' },
    { id: 'couriers', icon: 'local_shipping', label: 'Couriers' },
    { id: 'settings', icon: 'settings', label: 'Site Settings' },
    { id: 'reports', icon: 'analytics', label: 'Reports' },
  ];

  const customerItems = [
    { id: 'overview', icon: 'home', label: 'My Home' },
    { id: 'my_orders', icon: 'receipt_long', label: 'Order History' },
    { id: 'contact', icon: 'support_agent', label: 'Support & Help' },
  ];

  const menuItems = role === 'admin' ? adminItems : customerItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`w-64 bg-primary text-white flex flex-col fixed h-full z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white uppercase">TK Solution</span>
              <span className="text-[7px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-1">Make Your Life Easier</span>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/60">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-white/10 text-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 text-red-300 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminHeader({ activeTab, user, setIsSidebarOpen }: any) {
  const adminTitles: Record<string, string> = {
    overview: "Administrator Overview",
    orders: "Fulfillment Center",
    products: "Inventory & Catalog",
    reviews: "Customer Feedback",
    couriers: "Logistics Partners",
    settings: "Global Configuration",
    reports: "Operational Insights"
  };

  const customerTitles: Record<string, string> = {
    overview: "Welcome Back",
    my_orders: "Order Ledger",
    contact: "Contact Center"
  };

  const titles = user?.role === 'admin' ? adminTitles : customerTitles;

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 bg-stone-100 rounded-xl text-primary"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-xl md:text-3xl font-display font-bold text-primary tracking-tighter">{titles[activeTab] || "Dashboard"}</h1>
          <p className="hidden md:block text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
            {user?.role === 'admin' ? `System: ` : `Account: `} <span className={user?.role === 'admin' ? 'text-emerald-500' : 'text-primary'}>{user?.role === 'admin' ? 'Operational' : 'Verified'}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6 ml-auto md:ml-0">
        <div className="flex flex-col items-end">
          <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">{user?.name}</span>
          <span className="text-[7px] md:text-[8px] font-bold text-stone-400 uppercase tracking-widest">Root Access</span>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-stone-100 flex items-center justify-center text-primary font-black border border-stone-200">
          {user?.name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}

// --- Customer Components ---

function CustomerOverviewTab({ user, orders }: any) {
  const latestOrder = orders?.[0];
  const stats = [
    { label: 'Total Spent', value: `৳${orders?.reduce((acc:any, o:any)=>acc+Number(o.grand_total), 0).toLocaleString()}`, icon: 'savings' },
    { label: 'Total Orders', value: orders?.length || '0', icon: 'shopping_bag' },
    { label: 'Saved Address', value: user?.addresses?.length || '1', icon: 'location_on' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          <div className="relative z-10 space-y-6">
             <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight">Hello, {user?.full_name || 'Valued Customer'}</h2>
             <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">Welcome back to your TKS.bd sanctuary. Here you can track your harvests, manage your address, and connect with our support team.</p>
             <div className="flex flex-wrap gap-4 pt-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">{s.label}</span>
                     <span className="text-xl font-black text-accent">{s.value}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {latestOrder && (
         <div className="bg-white rounded-[3rem] border border-stone-100 p-10 shadow-sm">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-8">Latest Consignment</h3>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-primary border border-stone-100">
                     <span className="material-symbols-outlined text-4xl">inventory_2</span>
                  </div>
                  <div>
                     <p className="text-xl font-black text-primary">Order #{latestOrder.id}</p>
                     <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Placed on {new Date(latestOrder.created_at).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="flex flex-col items-end">
                  <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${latestOrder.order_status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {latestOrder.order_status}
                  </span>
                  <p className="text-[9px] text-stone-300 font-bold uppercase mt-3">Estimated arrival: Processing</p>
               </div>
            </div>
         </div>
       )}
    </div>
  );
}

function CustomerOrdersTab({ orders }: any) {
  return (
    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden animate-fade-in">
       <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
             <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                   <th className="px-10 py-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">Consignment ID</th>
                   <th className="px-10 py-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">Items</th>
                   <th className="px-10 py-8 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Amount</th>
                   <th className="px-10 py-8 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Status</th>
                   <th className="px-10 py-8 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Receipt</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-stone-50">
                {orders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-all">
                     <td className="px-10 py-8">
                        <span className="text-[12px] font-black text-primary">#{order.id}</span>
                        <p className="text-[9px] text-stone-400 mt-1 uppercase font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex -space-x-4">
                           {order.order_items?.slice(0, 3).map((item: any, i: number) => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 overflow-hidden shadow-sm">
                                <img src={item.products?.image_url || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                             </div>
                           ))}
                           {order.order_items?.length > 3 && (
                             <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                               +{order.order_items.length - 3}
                             </div>
                           )}
                        </div>
                     </td>
                     <td className="px-10 py-8 text-center">
                        <span className="text-[13px] font-black text-primary">৳{order.grand_total}</span>
                     </td>
                     <td className="px-10 py-8 text-center">
                        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.order_status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {order.order_status}
                        </span>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <button className="p-3 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-primary transition-all">
                           <span className="material-symbols-outlined text-xl">download_for_offline</span>
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function CustomerContactTab({ user }: any) {
  const [isSent, setIsSent] = useState(false);
  
  const handleSupport = async (e: any) => {
    e.preventDefault();
    // Simplified logic
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
       <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-stone-100 shadow-sm space-y-10">
          <div>
             <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tight">Technical Liaison</h2>
             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-2">Connect with our support infrastructure</p>
          </div>
          
          <form onSubmit={handleSupport} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold appearance-none">
                   <option>Inquiry regarding harvest quality</option>
                   <option>Logistics & Delivery delay</option>
                   <option>Payment verification issue</option>
                   <option>General appreciation</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Message Body</label>
                <textarea rows={5} placeholder="Describe your inquiry in detail..." className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-medium outline-none focus:border-primary"></textarea>
             </div>
             <button type="submit" className="w-full py-6 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
               {isSent ? <><span className="material-symbols-outlined text-lg">check_circle</span> Transmission Successful</> : <><span className="material-symbols-outlined text-lg">send</span> Initialize Transmission</>}
             </button>
          </form>
       </div>
       
       <div className="space-y-8">
          <div className="bg-primary text-white p-12 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 blur-[60px] -ml-16 -mb-16 rounded-full"></div>
             <span className="material-symbols-outlined text-4xl text-accent">verified_user</span>
             <h3 className="text-xl font-display font-black uppercase tracking-widest">Guaranteed Response</h3>
             <p className="text-white/60 text-xs leading-relaxed">Our liaison team is committed to responding to all technical and general inquiries within 24 operational hours. Your feedback is the soil in which we grow.</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm space-y-6">
             <span className="material-symbols-outlined text-4xl text-primary">local_post_office</span>
             <h3 className="text-xl font-display font-black uppercase tracking-widest text-primary">Direct Hotline</h3>
             <div className="space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Phone Support</p>
                <p className="text-xl font-black text-primary">+880 1XXXXXXXXX</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function OverviewTab({ stats, announcements }: any) {
  const statCards = [
    { label: 'Total Sales', value: `৳ ${stats?.totalSales?.toLocaleString() || '0'}`, icon: 'payments', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Orders', value: stats?.activeOrders || '0', icon: 'pending_actions', color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Customers', value: stats?.totalCustomers || '0', icon: 'person', color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Rating', value: stats?.avgRating?.toFixed(1) || '5.0', icon: 'stars', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-2xl font-display font-black text-primary tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden p-10">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6">Live Transaction Stream</h2>
            <div className="aspect-[2/1] bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 flex items-center justify-center">
               <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center px-10">
                  Analytics engine is collecting data from the soil... <br/>Transaction insights will sprout soon.
               </p>
            </div>
         </div>
         <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8">Broadcast Center</h3>
              <div className="space-y-6">
                 {announcements?.map((ann: any, i: number) => (
                   <div key={i} className="flex gap-4 group">
                     <div className="w-1 h-8 bg-accent rounded-full group-hover:h-12 transition-all"></div>
                     <div>
                       <p className="text-[11px] font-bold leading-relaxed">{ann.message || ann.content}</p>
                       <span className="text-[8px] text-white/40 uppercase tracking-widest mt-2 block">System Root Broadcast</span>
                     </div>
                   </div>
                 )) || <p className="text-[10px] text-white/40 italic">No active broadcasts.</p>}
              </div>
            </div>
            <div className="mt-10 pt-10 border-t border-white/10 text-center">
               <span className="text-[8px] font-black text-accent uppercase tracking-widest">TKS.bd Core System v1.0</span>
            </div>
         </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders, loading, checkFraud, fraudResults, fraudLoading, setBookingOrder, setIsBookingModalOpen }: any) {
  if (loading) return <div className="p-20 text-center text-stone-400 animate-pulse uppercase font-black text-[10px] tracking-widest">Accessing Order Ledger...</div>;
   return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total</th>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Fraud Check</th>
              <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black text-primary">#{order.id}</span>
                  <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-bold text-stone-700">{order.users?.full_name || 'Guest User'}</span>
                  <p className="text-[9px] text-stone-400 mt-1 font-bold">{order.users?.mobile_number}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[12px] font-black text-primary">৳{order.grand_total}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    order.order_status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                    order.order_status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {fraudResults[order.users?.mobile_number] ? (
                    <div className="flex items-center gap-2">
                       <span className={`text-[9px] font-black uppercase ${fraudResults[order.users?.mobile_number].total_orders > 3 ? 'text-emerald-500' : 'text-stone-400'}`}>
                         {fraudResults[order.users?.mobile_number].total_orders} Orders
                       </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => checkFraud(order.users?.mobile_number)}
                      disabled={fraudLoading[order.users?.mobile_number]}
                      className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline disabled:opacity-50"
                    >
                      {fraudLoading[order.users?.mobile_number] ? 'Checking...' : 'Check History'}
                    </button>
                  )}
                </td>
                <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                  <button 
                    onClick={() => { setBookingOrder(order); setIsBookingModalOpen(true); }}
                    className="px-4 py-2 bg-stone-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                     <span className="material-symbols-outlined text-sm">local_shipping</span> Book
                  </button>
                  <button className="p-3 hover:bg-stone-50 rounded-xl text-stone-300 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}function ProductsTab({ products, loading, setIsAddModalOpen, setEditingProduct, setIsEditModalOpen, deleteProduct, units, fetchUnits, lots, fetchLots, categories }: any) {
  const [activeSubTab, setActiveSubTab] = useState('list');
  const [newUnitName, setNewUnitName] = useState('');
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  const addUnit = async () => {
    if (!newUnitName) return;
    const res = await fetch("/api/admin/units", { method: "POST", body: JSON.stringify({ name: newUnitName }) });
    if (res.ok) { setNewUnitName(''); fetchUnits(); }
  };

  const deleteUnit = async (id: number) => {
    if (confirm("Delete Unit?")) {
      await fetch(`/api/admin/units?id=${id}`, { method: "DELETE" }); fetchUnits();
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-stone-400 animate-pulse uppercase font-black text-[10px] tracking-widest">Accessing Inventory...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Feature Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm">
        <div className="flex gap-2 md:gap-4 p-1.5 md:p-2 bg-stone-100 rounded-2xl overflow-x-auto">
          <button onClick={() => setActiveSubTab('list')} className={`whitespace-nowrap px-4 md:px-6 py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'list' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>Product Ledger</button>
          <button onClick={() => setActiveSubTab('units')} className={`whitespace-nowrap px-4 md:px-6 py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'units' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>Units</button>
          <button onClick={() => setActiveSubTab('lots')} className={`whitespace-nowrap px-4 md:px-6 py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'lots' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>Lots</button>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-4 bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-lg">add</span> New Catalog Item
        </button>
      </div>

      {activeSubTab === 'list' && (
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Visual</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Inventory</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden group-hover:scale-110 transition-transform shadow-sm">
                        <img src={product.image_url || '/placeholder.jpg'} className="w-full h-full object-cover" alt="" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-primary uppercase tracking-tight">{product.name}</span>
                        <span className="text-[8px] font-bold text-stone-400 uppercase mt-1">ID: #{product.id} • {product.categories?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-primary">{product.stock} {product.units?.name}</span>
                        <span className="text-[8px] font-black text-emerald-600 uppercase mt-1">Available</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-primary">৳{Number(product.price_per_unit)}</span>
                        <span className="text-[8px] font-bold text-stone-400 line-through">৳{Number(product.regular_price)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{product.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingProduct(product); setIsEditModalOpen(true); }} className="p-2 hover:bg-stone-100 rounded-lg text-stone-300 hover:text-primary transition-all"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-stone-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm h-fit space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Create New Unit</h3>
            <input value={newUnitName} onChange={(e) => setNewUnitName(e.target.value)} placeholder="e.g. KG, Piece, Box" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
            <button onClick={addUnit} className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">Register Unit</button>
          </div>
          <div className="md:col-span-2 bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Unit Title</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {units.map((unit: any) => (
                  <tr key={unit.id}>
                    <td className="px-8 py-5 text-[11px] font-bold text-primary uppercase tracking-widest">{unit.name}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => deleteUnit(unit.id)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'lots' && (
        <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-stone-50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Packaging & Lot Presets</h3>
            <button onClick={() => setIsLotModalOpen(true)} className="px-6 py-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl">Add Preset</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Preset Name</th>
                  <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Size (KG/Unit)</th>
                  <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Pkg Charge</th>
                  <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {lots.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-stone-50/50">
                    <td className="px-8 py-5 text-[11px] font-bold text-primary">{lot.name}</td>
                    <td className="px-8 py-5 text-[11px] font-bold text-primary">{lot.categories?.name}</td>
                    <td className="px-8 py-5 text-[11px] font-bold text-primary">{Number(lot.size)}</td>
                    <td className="px-8 py-5 text-[11px] font-bold text-primary">৳{lot.packaging_charge}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-stone-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lot Modal */}
      {isLotModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data = Object.fromEntries(fd.entries());
              const res = await fetch("/api/admin/lots", { method: "POST", body: JSON.stringify(data) });
              if (res.ok) { setIsLotModalOpen(false); fetchLots(); }
            }} className="p-10 space-y-8">
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Create Lot Configuration</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Lot Name</label>
                  <input name="name" required placeholder="e.g. Standard 5kg Box" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Category Mapping</label>
                  <select name="category_id" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold appearance-none">
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Weight/Size</label>
                    <input name="size" type="number" step="0.01" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Pkg Charge (৳)</label>
                    <input name="packaging_charge" type="number" step="0.01" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg">Save Configuration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CouriersTab({ couriers, toggleCourier, configureCourier, shippingConfigs, setEditingShippingConfig, setIsShippingModalOpen }: any) {
  const [activeSubTab, setActiveSubTab] = useState('list');

  return (
     <div className="space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-100 shadow-sm">
           <div className="flex gap-4 p-2 bg-stone-100 rounded-2xl w-fit overflow-x-auto max-w-full">
              <button onClick={() => setActiveSubTab('list')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'list' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>Partner List</button>
              <button onClick={() => setActiveSubTab('charges')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'charges' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>Shipping Charges</button>
           </div>
           <button onClick={() => {
              const name = prompt("Enter Courier Name:");
              const type = confirm("Is this an Online Courier (API)?") ? "online" : "offline";
              if (name) {
                fetch("/api/admin/couriers", { method: "POST", body: JSON.stringify({ name, type }) }).then(() => window.location.reload());
              }
           }} className="px-6 py-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add_box</span> Add Partner
           </button>
        </div>

       {activeSubTab === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {couriers.map((courier: any) => (
              <div key={courier.id} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 flex flex-col items-center text-center">
                 <div className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center ${courier.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-300'}`}>
                    <span className="material-symbols-outlined text-4xl">local_shipping</span>
                 </div>
                 <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-1">{courier.name}</h3>
                 <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-6">{courier.type} Partner</p>
                 <div className="w-full flex gap-3">
                    <button onClick={() => toggleCourier(courier.id, !courier.is_active)} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${courier.is_active ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{courier.is_active ? 'Deactivate' : 'Activate'}</button>
                    {courier.type === 'online' && <button onClick={() => configureCourier(courier)} className="px-4 py-3 bg-stone-100 rounded-xl text-stone-600 hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined text-sm">settings</span></button>}
                 </div>
              </div>
            ))}
          </div>
       )}

       {activeSubTab === 'charges' && (
          <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-stone-50 flex justify-between items-center">
                <h2 className="text-[10px] font-black text-primary uppercase tracking-widest">Rate Management Matrix</h2>
                <button onClick={() => { setEditingShippingConfig(null); setIsShippingModalOpen(true); }} className="px-6 py-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl">Add New Rate Rule</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-stone-50">
                   <tr>
                      <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Category / Courier</th>
                      <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Dhaka (Office/Home)</th>
                      <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Outside (Office/Home)</th>
                      <th className="px-8 py-5 text-[9px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                   {shippingConfigs.map((config: any) => (
                      <tr key={config.id} className="hover:bg-stone-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-primary">{config.categories?.name || 'All Products'}</span>
                            <p className="text-[8px] text-stone-400 mt-1 font-bold">{config.couriers?.name || 'Any Courier'}</p>
                         </td>
<td className="px-8 py-6 text-center">
                            <span className="text-[11px] font-bold text-emerald-600">৳{config.dhaka_office_rate} / ৳{config.dhaka_home_rate}</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className="text-[11px] font-bold text-orange-600">৳{config.outside_office_rate} / ৳{config.outside_home_rate}</span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button onClick={() => { setEditingShippingConfig(config); setIsShippingModalOpen(true); }} className="text-primary hover:underline text-[9px] font-black uppercase">Edit</button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}
    </div>
  );
}

function ReviewsTab({ reviews, toggleReview, deleteReview, setEditingReview, setIsReviewModalOpen, setIsAddReviewModalOpen }: any) {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border border-stone-100 shadow-sm">
          <div>
             <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Customer Testimonials</h2>
             <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1">Manage public feedback & ratings</p>
          </div>
          <button onClick={() => setIsAddReviewModalOpen(true)} className="px-6 py-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
             <span className="material-symbols-outlined text-lg">add</span> New Review
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reviews.map((review: any) => (
          <div key={review.id} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 group">
             <div className="w-16 h-16 rounded-full bg-stone-100 shrink-0 overflow-hidden border-2 border-stone-50">
                <img src={review.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.user_name}`} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                   <div>
                      <h3 className="text-[11px] font-black text-primary uppercase tracking-widest">{review.user_name || 'System User'}</h3>
                      <div className="flex justify-center md:justify-start text-accent mt-1">
                         {[...Array(5)].map((_, i) => (
                           <span key={i} className={`material-symbols-outlined text-[10px] ${i < review.rating ? '' : 'text-stone-100'}`} style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingReview(review); setIsReviewModalOpen(true); }} className="p-2 hover:bg-stone-50 rounded-lg text-stone-300 hover:text-primary transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => deleteReview(review.id)} className="p-2 hover:bg-red-50 rounded-lg text-stone-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                   </div>
                </div>
                <p className="text-[11px] text-stone-500 italic leading-relaxed">"{review.comment}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                   <button onClick={() => toggleReview(review.id, !review.is_visible)} className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${review.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                     {review.is_visible ? 'Public' : 'Hidden'}
                   </button>
                   <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ settings, saveSetting, uploadImage }: any) {
  const [activeSubTab, setActiveSubTab] = useState('sms');

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="flex gap-4 p-2 bg-stone-100 rounded-2xl w-fit overflow-x-auto max-w-full">
          {['sms', 'seo', 'social', 'contact'].map(tab => (
             <button key={tab} onClick={() => setActiveSubTab(tab)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}>{tab}</button>
          ))}
       </div>

       <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center">
             <div>
               <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">{activeSubTab.toUpperCase()} Configuration</h2>
               <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1">Manage global system parameters</p>
             </div>
             <span className="material-symbols-outlined text-3xl text-stone-200">settings</span>
          </div>
          
          <div className="p-10">
             {activeSubTab === 'sms' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                   <div className="lg:col-span-2 space-y-6">
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Gateway API URL</label>
                         <input defaultValue={settings.find((s:any) => s.key === 'sms_api_url')?.value || ''} onBlur={(e) => saveSetting('sms_api_url', e.target.value)} placeholder="https://..." className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">API Key</label>
                            <input defaultValue={settings.find((s:any) => s.key === 'sms_api_key')?.value || ''} onBlur={(e) => saveSetting('sms_api_key', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                         </div>
                         <div>
                            <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Sender ID</label>
                            <input defaultValue={settings.find((s:any) => s.key === 'sms_sender_id')?.value || ''} onBlur={(e) => saveSetting('sms_sender_id', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                         </div>
                      </div>
                   </div>
                   <div className="lg:col-span-3 space-y-6">
                       <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 mb-4">
                          <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">info</span> Dynamic Variables Guide
                          </p>
                          <div className="flex flex-wrap gap-2">
                             {[
                                { tag: '{customer_name}', label: 'Receiver Name' },
                                { tag: '{order_id}', label: 'Order Number' },
                                { tag: '{product_names}', label: 'Products' },
                                { tag: '{total_amount}', label: 'Grand Total' }
                             ].map(v => (
                                <span key={v.tag} className="px-3 py-1.5 bg-white border border-emerald-100 rounded-lg text-[8px] font-bold text-emerald-700">
                                   <code className="font-black text-emerald-900">{v.tag}</code>: {v.label}
                                </span>
                             ))}
                          </div>
                       </div>
                       {[ { key: 'sms_template_order_confirm', label: 'Order Confirm (Customer)' }, { key: 'sms_template_order_shipped', label: 'Shipment Alert (Customer)' } ].map(tpl => (
                          <div key={tpl.key}>
                             <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">{tpl.label}</label>
                             <textarea defaultValue={settings.find((s:any) => s.key === tpl.key)?.value || ''} onBlur={(e) => saveSetting(tpl.key, e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold min-h-[80px]" placeholder={`Example: Dear {customer_name}, your order #{order_id} for {product_names} has been confirmed.`} />
                          </div>
                       ))}
                   </div>
                </div>
             )}

             {activeSubTab === 'seo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Meta Title</label>
                         <input defaultValue={settings.find((s:any) => s.key === 'seo_title')?.value || ''} onBlur={(e) => saveSetting('seo_title', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                      </div>
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Meta Keywords</label>
                         <input defaultValue={settings.find((s:any) => s.key === 'seo_keywords')?.value || ''} onBlur={(e) => saveSetting('seo_keywords', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Meta Description</label>
                         <textarea defaultValue={settings.find((s:any) => s.key === 'seo_description')?.value || ''} onBlur={(e) => saveSetting('seo_description', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold min-h-[120px]" />
                      </div>
                   </div>
                </div>
             )}

             {activeSubTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {['facebook', 'instagram', 'youtube', 'whatsapp'].map(platform => (
                      <div key={platform}>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">{platform} Link</label>
                         <input 
                            defaultValue={settings.find((s:any) => s.key === `social_${platform}`)?.value || ''} 
                            onBlur={(e) => saveSetting(`social_${platform}`, e.target.value)}
                            placeholder={`https://${platform}.com/...`}
                            className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" 
                         />
                      </div>
                   ))}
                </div>
             )}

             {activeSubTab === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Support Phone</label>
                         <input defaultValue={settings.find((s:any) => s.key === 'contact_phone')?.value || ''} onBlur={(e) => saveSetting('contact_phone', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                      </div>
                      <div>
                         <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Support Email</label>
                         <input defaultValue={settings.find((s:any) => s.key === 'contact_email')?.value || ''} onBlur={(e) => saveSetting('contact_email', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[8px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Office Address</label>
                      <textarea defaultValue={settings.find((s:any) => s.key === 'contact_address')?.value || ''} onBlur={(e) => saveSetting('contact_address', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold min-h-[120px]" />
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

// --- Main Dashboard Controller ---

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [shippingConfigs, setShippingConfigs] = useState<any[]>([]);
  const [fraudResults, setFraudResults] = useState<Record<string, any>>({});
  const [fraudLoading, setFraudLoading] = useState<Record<string, boolean>>({});
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isCourierApiModalOpen, setIsCourierApiModalOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<any>(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [editingShippingConfig, setEditingShippingConfig] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingOrder, setBookingOrder] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Special Mango Logic States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isMangoCategory, setIsMangoCategory] = useState(false);
  const [filteredLots, setFilteredLots] = useState<any[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (user && user.role === 'customer' && !searchParams.get("tab")) {
       // Optional: Redirect to specific customer tab if needed
    }
  }, [user, searchParams]);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAnnouncements(data.announcements);
          setLoading(false);
        } else {
          router.replace("/auth/login");
        }
      } catch (err) { 
        console.error(err);
        router.replace("/auth/login");
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      if (activeTab === 'overview') fetchDashboardStats();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'products') { fetchProducts(); fetchCategories(); fetchUnits(); fetchCouriers(); fetchLots(); }
      if (activeTab === 'reviews') fetchReviews();
      if (activeTab === 'couriers') { fetchCouriers(); fetchShippingConfigs(); fetchCategories(); }
      if (activeTab === 'settings') fetchSettings();
    } else {
      // Customer Tabs
      if (activeTab === 'overview' || activeTab === 'my_orders') fetchOrders();
    }
  }, [activeTab, user]);

  useEffect(() => {
     const cat = categories.find(c => c.id == selectedCategoryId);
     const isMango = cat?.name?.toLowerCase().includes('mango') || cat?.name?.includes('আম');
     setIsMangoCategory(!!isMango);
     if (isMango) {
        setFilteredLots(lots.filter((l: any) => l.category_id == selectedCategoryId));
     } else {
        setFilteredLots([]);
     }
  }, [selectedCategoryId, categories, lots]);

  useEffect(() => {
     if (isEditModalOpen && editingProduct) {
        setSelectedCategoryId(editingProduct.category_id);
     }
  }, [isEditModalOpen, editingProduct]);

  async function fetchDashboardStats() {
    try { const res = await fetch("/api/admin/stats"); if (res.ok) setDashboardStats((await res.json()).stats); } catch (e) {}
  }

  async function fetchOrders() {
    setOrdersLoading(true);
    try { 
      const endpoint = user?.role === 'admin' ? "/api/admin/orders" : "/api/orders";
      const res = await fetch(endpoint); 
      if (res.ok) setOrders((await res.json()).orders || []); 
    } catch (e) {} finally { setOrdersLoading(false); }
  }

  async function fetchProducts() {
    setProductsLoading(true);
    try { const res = await fetch("/api/products"); if (res.ok) { const d = await res.json(); setProducts(d.products || d); } } catch (e) {} finally { setProductsLoading(false); }
  }

  async function fetchCategories() {
    try { const res = await fetch("/api/admin/categories"); if (res.ok) setCategories((await res.json()).categories || []); } catch (e) {}
  }

  async function fetchUnits() {
    try { const res = await fetch("/api/admin/units"); if (res.ok) setUnits((await res.json()).units || []); } catch (e) {}
  }

  async function fetchLots() {
    try { const res = await fetch("/api/admin/lots"); if (res.ok) setLots((await res.json()).lots || []); } catch (e) {}
  }

  async function fetchReviews() {
    try { const res = await fetch("/api/admin/reviews"); if (res.ok) setReviews((await res.json()).reviews || []); } catch (e) {}
  }

  async function fetchCouriers() {
    try { const res = await fetch("/api/admin/couriers"); if (res.ok) setCouriers((await res.json()).couriers || []); } catch (e) {}
  }

  async function fetchShippingConfigs() {
    try { const res = await fetch("/api/admin/shipping-configs"); if (res.ok) setShippingConfigs((await res.json()).configs || []); } catch (e) {}
  }

  async function fetchSettings() {
    try { const res = await fetch("/api/admin/settings"); if (res.ok) setSettings((await res.json()).settings || []); } catch (e) {}
  }

  const checkFraud = async (m: string) => { 
      setFraudLoading(p=>({...p,[m]:true})); 
      const r = await fetch(`/api/admin/fraud?mobile=${m}`); 
      if(r.ok) {
        const data = await r.json();
        setFraudResults(p=>({...p,[m]:data}));
      }
      setFraudLoading(p=>({...p,[m]:false})); 
  };

  const handleBookCourier = async (courierId: number) => {
    setBookingLoading(true);
    try {
      const res = await fetch("/api/admin/orders/book-courier", {
        method: "POST",
        body: JSON.stringify({ order_id: bookingOrder.id, courier_id: courierId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Booking Successful! Tracking: ${data.tracking_number}`);
        setIsBookingModalOpen(false);
        fetchOrders();
      } else alert(data.error);
    } catch (e) { alert("Booking failed"); }
    finally { setBookingLoading(false); }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) return (await res.json()).url;
    return null;
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const file = (e.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (file) { const url = await handleUpload(file); if (url) (data as any).image_url = url; }
    
    // Formatting multi-selects and numbers
    const selCouriers = couriers.filter(c => fd.get(`courier_id_${c.id}`) === 'on').map(c => c.name);
    (data as any).available_couriers = JSON.stringify(selCouriers);
    (data as any).allow_home_delivery = fd.get("allow_home_delivery") === "on";
    (data as any).allow_point_delivery = fd.get("allow_point_delivery") === "on";
    (data as any).is_preorder = fd.get("is_preorder") === "on";
    
    const res = await fetch("/api/admin/products", { method: "POST", body: JSON.stringify(data) });
    if (res.ok) { setIsAddModalOpen(false); fetchProducts(); }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const file = (e.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (file) { const url = await handleUpload(file); if (url) (data as any).image_url = url; }
    
    const selCouriers = couriers.filter(c => fd.get(`courier_id_${c.id}`) === 'on').map(c => c.name);
    (data as any).available_couriers = JSON.stringify(selCouriers);
    (data as any).allow_home_delivery = fd.get("allow_home_delivery") === "on";
    (data as any).allow_point_delivery = fd.get("allow_point_delivery") === "on";
    (data as any).is_preorder = fd.get("is_preorder") === "on";
    (data as any).id = editingProduct.id;
    
    const res = await fetch("/api/admin/products", { method: "PUT", body: JSON.stringify(data) });
    if (res.ok) { setIsEditModalOpen(false); fetchProducts(); }
  };

  const saveShippingConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const method = editingShippingConfig ? "PUT" : "POST";
    if (editingShippingConfig) (data as any).id = editingShippingConfig.id;
    const res = await fetch("/api/admin/shipping-configs", { method, body: JSON.stringify(data) });
    if (res.ok) { setIsShippingModalOpen(false); fetchShippingConfigs(); }
  };

  const handleAddReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const file = (e.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (file) { const url = await handleUpload(file); if (url) (data as any).image_url = url; }
    const res = await fetch("/api/admin/reviews", { method: "POST", body: JSON.stringify(data) });
    if (res.ok) { setIsAddReviewModalOpen(false); fetchReviews(); }
  };

  const handleEditReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    (data as any).id = editingReview.id;
    const file = (e.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (file) { const url = await handleUpload(file); if (url) (data as any).image_url = url; }
    const res = await fetch("/api/admin/reviews", { method: "PUT", body: JSON.stringify(data) });
    if (res.ok) { setIsReviewModalOpen(false); fetchReviews(); }
  };

  const toggleCourier = async (id: number, active: boolean) => {
    await fetch("/api/admin/couriers", { method: "PUT", body: JSON.stringify({ id, is_active: active }) }); fetchCouriers();
  };

  const toggleReview = async (id: number, visible: boolean) => {
    await fetch("/api/admin/reviews", { method: "PUT", body: JSON.stringify({ id, is_visible: visible }) }); fetchReviews();
  };

  const deleteReview = async (id: number) => { if (confirm("Delete?")) { await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" }); fetchReviews(); } };
  
  const deleteProduct = async (id: number) => { if (confirm("Delete?")) { await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" }); fetchProducts(); } };

  const saveSetting = async (key: string, value: string) => {
    await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key, value }) });
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Syncing Core Systems...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t:string) => router.push(`/dashboard?tab=${t}`, {scroll:false})} 
        handleLogout={async () => { await fetch("/api/auth/logout", {method:"POST"}); window.location.href = "/"; }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        role={user?.role}
      />
      
      <main className="flex-1 transition-all w-full max-w-full overflow-hidden">
        <AdminHeader activeTab={activeTab} user={user} setIsSidebarOpen={setIsSidebarOpen} />
        
        <div className="flex-1 p-6 lg:p-12 min-h-screen">
             {/* Admin Tabs */}
             {user?.role === 'admin' && activeTab === 'overview' && <OverviewTab stats={dashboardStats} announcements={announcements} />}
             {user?.role === 'admin' && activeTab === 'orders' && <OrdersTab orders={orders} loading={ordersLoading} checkFraud={checkFraud} fraudResults={fraudResults} fraudLoading={fraudLoading} setBookingOrder={setBookingOrder} setIsBookingModalOpen={setIsBookingModalOpen} />}
             {user?.role === 'admin' && activeTab === 'products' && <ProductsTab products={products} loading={productsLoading} setIsAddModalOpen={setIsAddModalOpen} setEditingProduct={setEditingProduct} setIsEditModalOpen={setIsEditModalOpen} deleteProduct={deleteProduct} units={units} fetchUnits={fetchUnits} lots={lots} fetchLots={fetchLots} categories={categories} />}
             {user?.role === 'admin' && activeTab === 'reviews' && <ReviewsTab reviews={reviews} toggleReview={toggleReview} deleteReview={deleteReview} setEditingReview={setEditingReview} setIsReviewModalOpen={setIsReviewModalOpen} setIsAddReviewModalOpen={setIsAddReviewModalOpen} />}
             {user?.role === 'admin' && activeTab === 'couriers' && <CouriersTab couriers={couriers} toggleCourier={toggleCourier} configureCourier={(c:any)=>{setEditingCourier(c); setIsCourierApiModalOpen(true);}} shippingConfigs={shippingConfigs} setEditingShippingConfig={setEditingShippingConfig} setIsShippingModalOpen={setIsShippingModalOpen} />}
             {user?.role === 'admin' && activeTab === 'settings' && <SettingsTab settings={settings} saveSetting={saveSetting} uploadImage={handleUpload} />}
             
             {/* Customer Tabs */}
             {user?.role === 'customer' && activeTab === 'overview' && <CustomerOverviewTab user={user} orders={orders} />}
             {user?.role === 'customer' && activeTab === 'my_orders' && <CustomerOrdersTab orders={orders} />}
             {user?.role === 'customer' && activeTab === 'contact' && <CustomerContactTab user={user} />}
        </div>

        {/* MODALS: Product Add/Edit (FULL FEATURED) */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl my-auto shadow-2xl animate-scale-up overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                 <h2 className="text-xl font-black text-primary uppercase tracking-tight">{isAddModalOpen ? 'Initialize New Product' : 'Modify Product Parameters'}</h2>
                 <button type="button" onClick={() => {setIsAddModalOpen(false); setIsEditModalOpen(false);}} className="material-symbols-outlined text-stone-300 hover:text-red-500 transition-colors">close</button>
              </div>
              
              <form onSubmit={isAddModalOpen ? handleAddProduct : handleEditProduct} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 {/* Basic Info Section */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                       <span className="w-8 h-px bg-primary/20"></span> Primary Attributes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="space-y-2 lg:col-span-1">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Product Title</label>
                          <input name="name" defaultValue={editingProduct?.name} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Regular Price (৳)</label>
                          <input name="regular_price" defaultValue={editingProduct?.regular_price} type="number" step="0.01" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">{isMangoCategory ? 'Price per KG (৳)' : 'Sales Price (৳)'}</label>
                          <input name="price_per_unit" defaultValue={editingProduct?.price_per_unit} type="number" step="0.01" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Stock Reservoir</label>
                          <input name="available_stock" defaultValue={editingProduct?.available_stock} type="number" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                       </div>
                    </div>
                 </div>

                 {/* Categorization Section */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                       <span className="w-8 h-px bg-primary/20"></span> Categorization & Units
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Category</label>
                          <select 
                            name="category_id" 
                            value={selectedCategoryId} 
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary appearance-none"
                          >
                             <option value="">Select Category</option>
                             {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Unit of Measure</label>
                          <select name="unit_id" defaultValue={editingProduct?.unit_id} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary appearance-none">
                             {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">{isMangoCategory ? 'Select Auto Lot' : 'Lot Size (Bundle)'}</label>
                          {isMangoCategory ? (
                             <select 
                                name="lot_id_selector" 
                                value={selectedLotId}
                                onChange={(e) => {
                                   const lotId = e.target.value;
                                   setSelectedLotId(lotId);
                                   const lot = filteredLots.find(l => l.id == lotId);
                                   if (lot) {
                                      const lotSizeInput = document.querySelector('input[name="lot_size"]') as HTMLInputElement;
                                      const pkgInput = document.querySelector('input[name="packaging_charge"]') as HTMLInputElement;
                                      if (lotSizeInput) lotSizeInput.value = lot.size;
                                      if (pkgInput) pkgInput.value = lot.packaging_charge;
                                   }
                                }}
                                className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-black text-emerald-600 outline-none focus:border-emerald-500 appearance-none"
                             >
                                <option value="">Select Lot Preset</option>
                                {filteredLots.map(l => <option key={l.id} value={l.id}>{l.name} ({Number(l.size)}kg - ৳{l.packaging_charge})</option>)}
                             </select>
                          ) : (
                             <input name="lot_size" defaultValue={editingProduct?.lot_size || 1} type="number" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                          )}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Packaging Fee (৳)</label>
                          <input name="packaging_charge" defaultValue={editingProduct?.packaging_charge || 0} type="number" step="0.01" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary" />
                       </div>
                    </div>
                    {isMangoCategory && <input type="hidden" name="lot_size" defaultValue={editingProduct?.lot_size || 5} />}
                 </div>

                 {/* Payment & Logistics */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                          <span className="w-8 h-px bg-primary/20"></span> Transaction Policy
                       </h3>
                       <div className="space-y-4">
                          <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Payment Protocol</label>
                          <select name="payment_policy" defaultValue={editingProduct?.payment_policy || 'cod'} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary appearance-none">
                             <option value="cod">Cash on Delivery (COD)</option>
                             <option value="partial_advance">Partial Advance Required</option>
                             <option value="full_advance">Full Advance Payment</option>
                          </select>
                          <div className="flex items-center gap-2 px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl">
                             <span className="text-[9px] font-bold text-stone-400 uppercase">Advance Value (৳):</span>
                             <input name="partial_advance_val" defaultValue={editingProduct?.partial_advance_val} type="number" className="bg-transparent text-[11px] font-black outline-none w-full" placeholder="0.00" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                          <span className="w-8 h-px bg-primary/20"></span> Fulfillment Channels
                       </h3>
                       <div className="flex flex-wrap gap-3">
                          <label className="flex items-center gap-3 px-5 py-4 bg-stone-50 rounded-2xl border border-stone-100 cursor-pointer hover:border-primary transition-all">
                             <input type="checkbox" name="allow_home_delivery" defaultChecked={editingProduct?.allow_home_delivery !== false} className="w-4 h-4 rounded-lg accent-primary" />
                             <span className="text-[9px] font-black uppercase text-stone-600">Home Delivery</span>
                          </label>
                          <label className="flex items-center gap-3 px-5 py-4 bg-stone-50 rounded-2xl border border-stone-100 cursor-pointer hover:border-primary transition-all">
                             <input type="checkbox" name="allow_point_delivery" defaultChecked={editingProduct?.allow_point_delivery !== false} className="w-4 h-4 rounded-lg accent-primary" />
                             <span className="text-[9px] font-black uppercase text-stone-600">Office Pickup</span>
                          </label>
                          <label className="flex items-center gap-3 px-5 py-4 bg-stone-50 rounded-2xl border border-stone-100 cursor-pointer hover:border-primary transition-all">
                             <input type="checkbox" name="is_preorder" defaultChecked={editingProduct?.is_preorder} className="w-4 h-4 rounded-lg accent-orange-500" />
                             <span className="text-[9px] font-black uppercase text-orange-600">Pre-Order Logic</span>
                          </label>
                       </div>
                       <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                          <span className="material-symbols-outlined text-stone-300">calendar_month</span>
                          <input type="date" name="harvest_date" defaultValue={editingProduct?.harvest_date ? new Date(editingProduct.harvest_date).toISOString().split('T')[0] : ''} className="bg-transparent text-[10px] font-bold outline-none w-full" />
                       </div>
                    </div>
                 </div>

                 {/* Description Section */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                       <span className="w-8 h-px bg-primary/20"></span> Narrative & Assets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <textarea name="short_description" defaultValue={editingProduct?.short_description} placeholder="Short teaser description (shown in cards)" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-3xl text-[11px] font-bold min-h-[100px] outline-none focus:border-primary" />
                       <textarea name="detailed_description" defaultValue={editingProduct?.detailed_description} placeholder="Full product specifications and story..." className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-3xl text-[11px] font-bold min-h-[100px] outline-none focus:border-primary" />
                    </div>
                    <div className="flex items-center gap-6 p-8 bg-stone-50 rounded-[2.5rem] border border-dashed border-stone-200">
                       <div className="w-24 h-24 rounded-3xl bg-white border border-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                          {editingProduct?.image_url ? <img src={editingProduct.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl text-stone-200">image</span>}
                       </div>
                       <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black uppercase text-primary tracking-widest">Main Product Visual</label>
                          <input type="file" name="file" className="text-[10px] text-stone-400 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[9px] file:font-black file:bg-primary file:text-white hover:file:bg-primary/80" />
                       </div>
                    </div>
                 </div>

                 {/* Logistics Partners */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                       <span className="w-8 h-px bg-primary/20"></span> Logistics Permissions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                       {couriers.filter((c:any)=>c.is_active).map((c:any) => (
                          <label key={c.id} className="flex items-center gap-3 px-6 py-4 bg-stone-50 rounded-2xl border border-stone-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all">
                             <input type="checkbox" name={`courier_id_${c.id}`} defaultChecked={editingProduct?.available_couriers?.includes(c.name)} className="w-4 h-4 rounded accent-primary" />
                             <span className="text-[10px] font-black uppercase text-stone-600">{c.name}</span>
                          </label>
                       ))}
                    </div>
                 </div>

                 <div className="pt-6">
                    <button type="submit" className="w-full py-6 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                       Deploy Product to Catalog
                    </button>
                 </div>
              </form>
            </div>
          </div>
        )}

        {isReviewModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
               <form onSubmit={handleEditReview} className="p-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Edit Review</h2>
                    <button type="button" onClick={() => setIsReviewModalOpen(false)} className="material-symbols-outlined text-stone-300">close</button>
                  </div>
                  <div className="space-y-6">
                     <input name="user_name" defaultValue={editingReview?.user_name} placeholder="Name" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                     <textarea name="comment" defaultValue={editingReview?.comment} placeholder="Review Text" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold min-h-[100px]" />
                     <input type="file" name="file" className="text-[10px] text-stone-400" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-primary/20">Update Review</button>
               </form>
            </div>
          </div>
        )}

        {isShippingModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
               <form onSubmit={saveShippingConfig} className="p-10 space-y-8">
                  <h2 className="text-xl font-black text-primary uppercase tracking-tight">{editingShippingConfig ? 'Edit Rate Rule' : 'Add Rate Rule'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <select name="category_id" defaultValue={editingShippingConfig?.category_id} className="px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold">
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                     <select name="courier_id" defaultValue={editingShippingConfig?.courier_id} className="px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold">
                        <option value="">Any Courier</option>
                        {couriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[8px] font-black uppercase text-stone-400 mb-2">Dhaka Office / Home</label>
                        <div className="flex gap-2">
                           <input name="dhaka_office_rate" defaultValue={editingShippingConfig?.dhaka_office_rate} placeholder="Off" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold" />
                           <input name="dhaka_home_rate" defaultValue={editingShippingConfig?.dhaka_home_rate} placeholder="Home" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[8px] font-black uppercase text-stone-400 mb-2">Outside Office / Home</label>
                        <div className="flex gap-2">
                           <input name="outside_office_rate" defaultValue={editingShippingConfig?.outside_office_rate} placeholder="Off" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold" />
                           <input name="outside_home_rate" defaultValue={editingShippingConfig?.outside_home_rate} placeholder="Home" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold" />
                        </div>
                     </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">Confirm Rate Settings</button>
               </form>
            </div>
          </div>
        )}

        {isAddReviewModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
               <form onSubmit={handleAddReview} className="p-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Post New Review</h2>
                    <button type="button" onClick={() => setIsAddReviewModalOpen(false)} className="material-symbols-outlined text-stone-300">close</button>
                  </div>
                  <div className="space-y-6">
                     <input name="user_name" required placeholder="Customer Name" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                     <select name="rating" required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                     </select>
                     <textarea name="comment" required placeholder="What did they say about the harvest?" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold min-h-[100px]" />
                     <input type="file" name="file" className="text-[10px] text-stone-400" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-primary/20">Publish Testimonial</button>
               </form>
            </div>
          </div>
        )}

        {isCourierApiModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="p-10 space-y-8">
                  <h2 className="text-xl font-black text-primary uppercase tracking-tight">{editingCourier?.name} API Config</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const config = Object.fromEntries(fd.entries());
                    await fetch("/api/admin/couriers", { method: "PUT", body: JSON.stringify({ id: editingCourier.id, api_config: JSON.stringify(config) }) });
                    setIsCourierApiModalOpen(false);
                    fetchCouriers();
                  }} className="space-y-6">
                     {editingCourier?.name === 'Steadfast' && (
                        <>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-stone-400 ml-1">API Key</label>
                              <input name="api_key" defaultValue={editingCourier.api_config?.api_key} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Secret Key</label>
                              <input name="secret_key" defaultValue={editingCourier.api_config?.secret_key} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                           </div>
                        </>
                     )}
                     {editingCourier?.name === 'Pathao' && (
                        <>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Client ID</label>
                                 <input name="client_id" defaultValue={editingCourier.api_config?.client_id} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Client Secret</label>
                                 <input name="client_secret" defaultValue={editingCourier.api_config?.client_secret} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Store ID</label>
                              <input name="store_id" defaultValue={editingCourier.api_config?.store_id} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Username</label>
                                 <input name="username" defaultValue={editingCourier.api_config?.username} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Password</label>
                                 <input name="password" type="password" defaultValue={editingCourier.api_config?.password} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                           </div>
                        </>
                     )}
                     {editingCourier?.name === 'RedX' && (
                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase text-stone-400 ml-1">API Token</label>
                           <input name="token" defaultValue={editingCourier.api_config?.token} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                        </div>
                     )}
                     {editingCourier?.name === 'Paperfly' && (
                        <>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-stone-400 ml-1">API Key</label>
                              <input name="api_key" defaultValue={editingCourier.api_config?.api_key} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Username</label>
                                 <input name="username" defaultValue={editingCourier.api_config?.username} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black uppercase text-stone-400 ml-1">Password</label>
                                 <input name="password" type="password" defaultValue={editingCourier.api_config?.password} required className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold" />
                              </div>
                           </div>
                        </>
                     )}
                     <button type="submit" className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg mt-4">Save Credentials</button>
                  </form>
               </div>
            </div>
          </div>
        )}

        {/* MODAL: Book Courier */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="p-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Select Logistics Partner</h2>
                    <button onClick={() => setIsBookingModalOpen(false)} className="material-symbols-outlined text-stone-300">close</button>
                  </div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Order ID: <span className="text-primary font-black">#{bookingOrder?.id}</span></p>
                  <div className="grid grid-cols-1 gap-4">
                    {couriers.filter((c:any) => c.is_active && c.type === 'online').map((c:any) => (
                      <button 
                        key={c.id} 
                        onClick={() => handleBookCourier(c.id)}
                        disabled={bookingLoading}
                        className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100 hover:border-primary group transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary border border-stone-100 group-hover:scale-110 transition-transform">
                               <span className="material-symbols-outlined">local_shipping</span>
                            </div>
                            <div className="text-left">
                               <p className="text-[11px] font-black text-primary uppercase tracking-widest">{c.name}</p>
                               <p className="text-[8px] font-bold text-stone-400 uppercase">Express Booking</p>
                            </div>
                         </div>
                         <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                      </button>
                    ))}
                    {couriers.filter((c:any) => c.is_active && c.type === 'online').length === 0 && (
                      <p className="text-[10px] text-stone-400 text-center py-10 italic">No online courier partners activated.</p>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50">Loading Root...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
