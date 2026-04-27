"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAnnouncements(data.announcements);
          
          // Initial fetch for system lookups
          fetchCategories();
          fetchUnits();
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) { console.error(err); }
  }

  async function fetchUnits() {
    try {
      const res = await fetch("/api/admin/units");
      if (res.ok) {
        const data = await res.json();
        setUnits(data.units || []);
      }
    } catch (err) { console.error(err); }
  }

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      router.push("/");
    }
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [settings, setSettings] = useState<any[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [fraudResults, setFraudResults] = useState<Record<string, any>>({});
  const [fraudLoading, setFraudLoading] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [shippingConfigs, setShippingConfigs] = useState<any[]>([]);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [editingShippingConfig, setEditingShippingConfig] = useState<any>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [lots, setLots] = useState<any[]>([]);

  const checkFraud = async (mobile: string) => {
    setFraudLoading(prev => ({ ...prev, [mobile]: true }));
    try {
      const res = await fetch("/api/admin/fraud-check", {
        method: "POST",
        body: JSON.stringify({ phone: mobile })
      });
      if (res.ok) {
        const data = await res.json();
        setFraudResults(prev => ({ ...prev, [mobile]: data.data }));
      } else {
        const err = await res.json();
        alert(err.error || "Fraud check failed. Ensure credentials are set in settings.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFraudLoading(prev => ({ ...prev, [mobile]: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'reports') {
      fetchStats();
    }
    if (activeTab === 'orders') {
      fetchOrders();
    }
    if (activeTab === 'products') {
      fetchProducts();
      fetchLots();
    }
    if (activeTab === 'settings') {
      fetchSettings();
    }
    if (activeTab === 'reviews') {
      fetchReviews();
    }
    if (activeTab === 'couriers') {
      fetchPackages();
      fetchShippingConfigs();
    }
  }, [activeTab]);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchShippingConfigs() {
    try {
      const res = await fetch("/api/admin/shipping-configs");
      if (res.ok) {
        const data = await res.json();
        setShippingConfigs(data.configs || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPackages() {
    setPackagesLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPackagesLoading(false);
    }
  }

  async function fetchReviews() {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function fetchSettings() {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  }

  async function fetchLots() {
    try {
      const res = await fetch("/api/admin/lots");
      if (res.ok) {
        const data = await res.json();
        setLots(data.lots || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProducts() {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data);
      } else {
        setProductsError("Could not retrieve products from the server.");
      }
    } catch (err) {
      console.error(err);
      setProductsError("Network error while fetching products.");
    } finally {
      setProductsLoading(false);
    }
  }

  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    const name = p.name || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const cat = p.categories || {};
    const categoryName = cat.name || p.category || "Unassigned";
    const catMatch = categoryFilter === "All Categories" || 
                    categoryName.toLowerCase() === categoryFilter.toLowerCase() ||
                    (categoryFilter === "Unassigned" && (categoryName === "Unassigned" || !p.category_id));
    return matchesSearch && catMatch;
  });

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const res = await fetch("/api/admin/products", { method: "POST", body: JSON.stringify(data) });
    if (res.ok) { setIsAddModalOpen(false); fetchProducts(); }
    else { alert("Failed to add product"); }
  }

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Synchronizing System...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf9] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed h-full z-40 transition-all duration-300">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white uppercase">TK Solution</span>
              <span className="text-[7px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-1">Make Your Life Easier</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', icon: 'dashboard', label: 'Overview' },
            { id: 'orders', icon: 'shopping_cart', label: 'Orders' },
            { id: 'products', icon: 'inventory_2', label: 'Products' },
            { id: 'reviews', icon: 'rate_review', label: 'Reviews' },
            { id: 'couriers', icon: 'local_shipping', label: 'Couriers' },
            { id: 'settings', icon: 'settings', label: 'Site Settings' },
            { id: 'reports', icon: 'analytics', label: 'Reports' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-white/10 text-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 text-red-300 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary tracking-tighter">
              {activeTab === 'overview' && "Administrator Overview"}
              {activeTab === 'orders' && "Order Management"}
              {activeTab === 'products' && "Inventory Control"}
              {activeTab === 'reviews' && "Customer Diaries"}
              {activeTab === 'couriers' && "Logistics & Shipping"}
              {activeTab === 'settings' && "Global Site Settings"}
              {activeTab === 'reports' && "Analytical Reports"}
            </h1>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[9px] mt-2">
              System Governance • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-stone-100 shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-primary border border-stone-100">
               <span className="material-symbols-outlined">person_pin</span>
             </div>
             <div>
               <p className="text-[10px] font-black text-primary uppercase tracking-tight">{user?.full_name || 'System Root'}</p>
               <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest">Master Admin Access</p>
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fade-in">
            {/* System Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Sales', val: `৳ ${dashboardStats?.totalSales || 0}`, icon: 'payments', color: 'text-emerald-500' },
                { label: 'Active Orders', val: dashboardStats?.activeOrders || 0, icon: 'shopping_bag', color: 'text-amber-500' },
                { label: 'Total Customers', val: dashboardStats?.totalCustomers || 0, icon: 'group', color: 'text-blue-500' },
                { label: 'Avg Rating', val: Number(dashboardStats?.avgRating || 0).toFixed(1), icon: 'star', color: 'text-accent' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-2">
                  <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-primary">{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Recent Activity</h2>
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-stone-200 text-3xl">inbox</span>
                  </div>
                  <p className="text-stone-300 italic text-sm">Waiting for the harvest season to begin...</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Site Updates</h2>
                  <button className="text-[9px] font-bold text-accent bg-primary px-3 py-1.5 rounded-lg">+ NEW</button>
                </div>
                <div className="space-y-4">
                  {announcements.map((msg: any) => (
                    <div key={msg.id} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <p className="text-[10px] font-medium text-stone-500 leading-tight mb-2">{msg.message}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-[7px] font-bold text-white ${msg.is_active ? 'bg-emerald-500' : 'bg-stone-300'} px-2 py-0.5 rounded-full uppercase tracking-widest`}>
                          {msg.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-[7px] font-bold text-red-300 uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-stone-50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">All Customer Orders</h2>
              <div className="flex gap-2">
                <input type="text" placeholder="Search orders..." className="px-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] outline-none focus:border-primary font-bold" />
                <button onClick={fetchOrders} className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">refresh</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">ID</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Items</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Total</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Payment</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {ordersLoading ? (
                    <tr><td colSpan={7} className="text-center py-20 text-stone-300 italic">Fetching secure order data...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-20 text-stone-300 italic">No orders found in the system.</td></tr>
                  ) : orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-6 text-[10px] font-bold text-primary">#{order.id}</td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-bold text-primary">{order.users?.mobile_number}</p>
                        <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">{order.addresses?.districts?.name}</p>
                        
                        {/* Fraud Check Result */}
                        <div className="mt-2 flex flex-col gap-1">
                          {fraudResults[order.users?.mobile_number] ? (
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest ${
                                (fraudResults[order.users?.mobile_number].success / (fraudResults[order.users?.mobile_number].total || 1)) > 0.8 ? 'bg-emerald-100 text-emerald-600' : 
                                (fraudResults[order.users?.mobile_number].success / (fraudResults[order.users?.mobile_number].total || 1)) > 0.6 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {Math.round((fraudResults[order.users?.mobile_number].success / (fraudResults[order.users?.mobile_number].total || 1)) * 100)}% Success
                              </span>
                              <span className="text-[7px] text-stone-400 font-bold">
                                {fraudResults[order.users?.mobile_number].success}/{fraudResults[order.users?.mobile_number].total} Deliv.
                              </span>
                              {fraudResults[order.users?.mobile_number].frauds?.length > 0 && (
                                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[6px] font-black uppercase animate-pulse">
                                  {fraudResults[order.users?.mobile_number].frauds.length} Reported Frauds
                                </span>
                              )}
                            </div>
                          ) : (
                            <button 
                              onClick={() => checkFraud(order.users?.mobile_number)}
                              disabled={fraudLoading[order.users?.mobile_number]}
                              className="text-[7px] font-bold text-stone-400 hover:text-primary uppercase tracking-widest flex items-center gap-1 transition-all"
                            >
                              {fraudLoading[order.users?.mobile_number] ? 'Checking...' : (
                                <>
                                  <span className="material-symbols-outlined text-[10px]">verified_user</span>
                                  Check Fraud History
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-medium text-stone-500">
                        {order.order_items.length} Product(s)
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-primary">৳{Number(order.grand_total).toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${order.order_status === 'delivered' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right flex justify-end gap-3">
                        <button 
                          onClick={async () => {
                            if (!confirm('Are you sure you want to book this order with Steadfast?')) return;
                            const res = await fetch("/api/courier/steadfast", {
                              method: "POST",
                              body: JSON.stringify({ order_id: order.id })
                            });
                            if (res.ok) {
                              alert('Successfully booked with Steadfast!');
                              fetchOrders();
                            } else {
                              alert('Booking failed. Please check credentials in settings.');
                            }
                          }}
                          className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest border border-emerald-100 px-3 py-1 rounded-lg"
                        >
                          Book Steadfast
                        </button>
                        <button className="text-[9px] font-bold text-primary hover:text-accent uppercase tracking-widest underline underline-offset-4">View Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in pb-20">
            {/* Quick Actions Bar - Premium Button Row */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex flex-col gap-1">
                 <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Product Inventory</h2>
                 <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{products.length} Items cataloged</p>
               </div>
               <div className="flex flex-wrap justify-center gap-3">
                 <button 
                   onClick={() => setIsCategoryModalOpen(true)}
                   className="px-6 py-3 bg-stone-50 text-stone-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-stone-100 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">category</span>
                   Category Management (ক্যাটাগরি ম্যানেজমেন্ট)
                 </button>
                 <button 
                   onClick={() => setIsUnitModalOpen(true)}
                   className="px-6 py-3 bg-stone-50 text-stone-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-stone-100 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">straighten</span>
                   Unit Management (ইউনিট ম্যানেজমেন্ট)
                 </button>
                 <button 
                   onClick={() => setIsLotModalOpen(true)}
                   className="px-6 py-3 bg-stone-50 text-stone-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-stone-100 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">package_2</span>
                   Lot Management (লট ম্যনাজেমেন্ট)
                 </button>
                 <button 
                   onClick={() => setIsAddModalOpen(true)} 
                   className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] hover:bg-primary-light transition-all flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">add_circle</span>
                   Add New Product (এ্যাড নিউ প্রডাক্ট)
                 </button>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
               {/* Search & Filter Header */}
               <div className="p-8 bg-stone-50/50 border-b border-stone-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl font-light">search</span>
                    <input 
                      type="text" 
                      placeholder="Search catalog by name, SKU..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] outline-none focus:border-primary transition-all font-bold placeholder:text-stone-300" 
                    />
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="flex-1 md:w-56 px-6 py-4 bg-white border border-stone-100 rounded-2xl text-[9px] font-black uppercase tracking-widest outline-none focus:border-primary cursor-pointer transition-all appearance-none"
                    >
                      <option>All Categories</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <button onClick={fetchProducts} className="p-4 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-primary transition-all">
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80">
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-left">Harvest Item</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-left">Classification</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Unit Valuation</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Lot Config</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Logistics</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center">Stock Level</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {productsLoading ? (
                      <tr><td colSpan={7} className="text-center py-32 text-stone-300 italic animate-pulse">Synchronizing inventory logs...</td></tr>
                    ) : productsError ? (
                      <tr>
                        <td colSpan={7} className="text-center py-32">
                           <div className="flex flex-col items-center gap-4 text-red-300">
                             <span className="material-symbols-outlined text-5xl font-light">error</span>
                             <p className="italic text-sm">{productsError}</p>
                             <button onClick={fetchProducts} className="text-xs font-black uppercase tracking-widest underline">Retry</button>
                           </div>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-32">
                           <div className="flex flex-col items-center gap-4 text-stone-300">
                             <span className="material-symbols-outlined text-5xl font-light">inventory_2</span>
                             <p className="italic text-sm">No produce matches your current filters.</p>
                             <div className="text-[10px] text-stone-200 mt-2">
                               Raw Products: {products.length} | Category Filter: {categoryFilter}
                             </div>
                           </div>
                        </td>
                      </tr>
                    ) : filteredProducts.map((product: any) => (
                      <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden border border-stone-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                               <img src={product.image_url || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div>
                               <p className="text-[12px] font-black text-primary leading-tight uppercase tracking-tight">{product.name}</p>
                               <p className="text-[7px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                                 <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                                 UID: #PRD-{product.id}
                               </p>
                             </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="px-3 py-1.5 bg-stone-50 text-stone-500 text-[8px] font-black uppercase tracking-[0.15em] rounded-lg border border-stone-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                             {product.categories?.name || product.category || 'Unassigned'}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <p className="text-[11px] font-black text-primary">৳{Number(product.price_per_unit).toLocaleString()}</p>
                           <p className="text-[7px] text-stone-400 uppercase font-black tracking-widest mt-1">per {product.units?.name || 'Unit'}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <div className="inline-flex flex-col gap-1 items-center">
                             <p className="text-[11px] font-black text-stone-600">{product.lot_size} {product.units?.name || 'Unit'}</p>
                             <span className="text-[7px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10">৳{((Number(product.price_per_unit) * Number(product.lot_size)) + Number(product.packaging_charge || 0)).toLocaleString()} Total</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <div className="flex flex-col gap-1">
                             <p className="text-[10px] font-bold text-secondary">৳{Number(product.packaging_charge || 0).toLocaleString()}</p>
                             <p className="text-[6px] text-stone-400 uppercase font-black tracking-widest">Pkg Charge</p>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <div className="flex flex-col items-center gap-2">
                             <p className="text-[11px] font-black text-primary">{Number(product.available_stock).toLocaleString()} Units</p>
                             <span className={`px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border ${product.available_stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {product.available_stock > 0 ? 'Live in Stock' : 'Out of Stock'}
                             </span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-3">
                             <button onClick={() => alert(`Editing not implemented yet`)} title="Modify Item" className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-primary hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all">
                               <span className="material-symbols-outlined text-xl">edit_note</span>
                             </button>
                             <button 
                                onClick={async () => {
                                  if(confirm(`Remove ${product.name} from catalog?`)) {
                                    await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
                                    fetchProducts();
                                  }
                                }}
                                title="Remove Item" className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
                               <span className="material-symbols-outlined text-xl">delete</span>
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Management Modal */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[70] flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-10 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-primary uppercase tracking-widest">Category Governance</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Classify your harvest produce</p>
                    </div>
                    <button onClick={() => setIsCategoryModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-10 space-y-8">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      const res = await fetch("/api/admin/categories", { method: "POST", body: JSON.stringify(data) });
                      if (res.ok) { fetchCategories(); (e.target as HTMLFormElement).reset(); }
                    }} className="flex gap-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                      <div className="flex-1 space-y-4">
                        <input name="name" required placeholder="Category Title (e.g. Organic Honey)" className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                        <input name="slug" required placeholder="Identifier (slug)" className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                      </div>
                      <button type="submit" className="px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-light transition-all">Add</button>
                    </form>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-4">
                       <div className="grid grid-cols-2 gap-3">
                         {categories.map(cat => (
                           <div key={cat.id} className="group flex items-center justify-between px-5 py-3 bg-white border border-stone-100 rounded-2xl hover:border-primary transition-all shadow-sm">
                             <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{cat.name}</span>
                             <button onClick={async () => { if (confirm(`Delete ${cat.name}?`)) { await fetch(`/api/admin/categories?id=${cat.id}`, { method: 'DELETE' }); fetchCategories(); } }} className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-stone-300 hover:text-red-500 transition-all text-lg">delete_forever</button>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Unit Management Modal */}
            {isUnitModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[70] flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-10 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-primary uppercase tracking-widest">Metric Standards</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Define measurement units for your catalog</p>
                    </div>
                    <button onClick={() => setIsUnitModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-10 space-y-8">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      const res = await fetch("/api/admin/units", { method: "POST", body: JSON.stringify(data) });
                      if (res.ok) { fetchUnits(); (e.target as HTMLFormElement).reset(); }
                    }} className="flex gap-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                      <input name="name" required placeholder="Metric Title (e.g. Kilograms)" className="flex-1 px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                      <button type="submit" className="px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-light transition-all">Create</button>
                    </form>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-4">
                       <div className="grid grid-cols-2 gap-3">
                         {units.map(unit => (
                           <div key={unit.id} className="group flex items-center justify-between px-5 py-3 bg-white border border-stone-100 rounded-2xl hover:border-primary transition-all shadow-sm">
                             <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{unit.name}</span>
                             <button onClick={async () => { if (confirm(`Delete ${unit.name}?`)) { await fetch(`/api/admin/units?id=${unit.id}`, { method: 'DELETE' }); fetchUnits(); } }} className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-stone-300 hover:text-red-500 transition-all text-lg">delete_forever</button>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lot Management Modal */}
            {isLotModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[70] flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-10 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-primary uppercase tracking-widest">Lot & Packaging Config</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Define standard lot sizes for specific categories</p>
                    </div>
                    <button onClick={() => setIsLotModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-10 space-y-8">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      const res = await fetch("/api/admin/lots", { method: "POST", body: JSON.stringify(data) });
                      if (res.ok) { fetchLots(); (e.target as HTMLFormElement).reset(); }
                    }} className="grid grid-cols-2 gap-4 p-8 bg-stone-50 rounded-3xl border border-stone-100">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Category Assignment</label>
                        <select name="category_id" required className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all">
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Lot Name (e.g. 12KG Premium)</label>
                        <input name="name" required placeholder="Lot Template Name" className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Size (Units)</label>
                        <input name="size" type="number" required placeholder="12" className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Packaging Charge (৳)</label>
                        <input name="packaging_charge" type="number" required placeholder="150" className="w-full px-5 py-4 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                      </div>
                      <button type="submit" className="col-span-2 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-light transition-all mt-2">Create Lot Template</button>
                    </form>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                       <div className="grid grid-cols-1 gap-3">
                         {lots.map(lot => (
                           <div key={lot.id} className="group flex items-center justify-between px-6 py-4 bg-white border border-stone-100 rounded-2xl hover:border-primary transition-all shadow-sm">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{lot.name}</span>
                               <span className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">{lot.categories?.name} • {lot.size} Unit • ৳{lot.packaging_charge} Pkg</span>
                             </div>
                             <button onClick={async () => { if (confirm(`Delete ${lot.name}?`)) { await fetch(`/api/admin/lots?id=${lot.id}`, { method: 'DELETE' }); fetchLots(); } }} className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-stone-300 hover:text-red-500 transition-all text-xl">delete_sweep</button>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-in my-8">
                  <div className="p-10 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-primary uppercase tracking-widest">Add New Product (এ্যাড নিউ প্রডাক্ট)</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1.5">Configure premium produce with logistics & payment policies</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <form onSubmit={handleAddProduct} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Basic Information</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Product Title</label>
                          <input name="name" required type="text" placeholder="e.g. Premium Rajshahi Himsagar" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Short Description</label>
                          <input name="short_description" type="text" placeholder="Brief catchphrase for the product..." className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Long Description</label>
                          <textarea name="detailed_description" rows={4} placeholder="Tell the story of this harvest..." className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold resize-none"></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Pricing & Inventory</h4>
                        </div>
                        {/* Lot Template Selector */}
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Use Template:</span>
                           <select 
                              className="px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[9px] font-bold outline-none focus:border-primary"
                              onChange={(e) => {
                                const selectedLot = lots.find(l => l.id === Number(e.target.value));
                                if (selectedLot) {
                                  const form = e.target.closest('form');
                                  if (form) {
                                    (form.elements.namedItem('lot_size') as HTMLInputElement).value = selectedLot.size;
                                    (form.elements.namedItem('packaging_charge') as HTMLInputElement).value = selectedLot.packaging_charge;
                                    (form.elements.namedItem('category_id') as HTMLSelectElement).value = selectedLot.category_id;
                                  }
                                }
                              }}
                           >
                              <option value="">Manual Entry</option>
                              {lots.map(l => <option key={l.id} value={l.id}>{l.name} ({l.categories?.name})</option>)}
                           </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Unit Type</label>
                          <select name="unit_id" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold">
                            {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Price per Unit (৳)</label>
                          <input name="price_per_unit" required type="number" placeholder="1200" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Lot Size (Min Order)</label>
                          <input name="lot_size" required type="number" defaultValue={1} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Initial Stock</label>
                          <input name="available_stock" required type="number" placeholder="500" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Packaging Charge (৳)</label>
                          <input name="packaging_charge" type="number" defaultValue={0} placeholder="e.g. 150" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Category</label>
                          <select name="category_id" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Logistics & Delivery */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Logistics & Delivery</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Home Delivery</span>
                          <input name="allow_home_delivery" type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Point Pickup</span>
                          <input name="allow_point_delivery" type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Available Couriers */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Available Couriers</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {['Steadfast', 'Sundarban', 'Pathao', 'RedX', 'Paperfly', 'SA Paribahan', 'Korotoa', 'Janani', 'Metropolitan', 'eCourier', 'Delivery Tiger'].map(courier => (
                          <div key={courier} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{courier}</span>
                            <input name={`courier_${courier.toLowerCase().replace(' ', '_')}`} type="checkbox" className="w-3 h-3 accent-primary" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Policies */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Payment Policies</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Primary Policy</label>
                          <select name="payment_policy" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold">
                            <option value="cod">Cash On Delivery</option>
                            <option value="partial_advance">Partial Advance Payment</option>
                            <option value="full_advance">Full Advance Payment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Partial Amount (৳ / %)</label>
                          <input name="partial_advance_val" type="number" placeholder="e.g. 500" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                        </div>
                      </div>
                    </div>

                    {/* Media Assets */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Media Assets</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Main Display Image</label>
                          <div className="flex gap-2">
                             <input name="image_url" required type="text" placeholder="https://..." className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none focus:border-primary font-bold" />
                             <label className="cursor-pointer bg-primary text-white p-3 rounded-xl flex items-center justify-center">
                               <span className="material-symbols-outlined text-sm">upload</span>
                               <input type="file" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const formData = new FormData();
                                   formData.append('file', file);
                                   const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                                   const data = await res.json();
                                   if (data.success) {
                                     (document.getElementsByName('image_url')[0] as HTMLInputElement).value = data.url;
                                   }
                                 }
                               }} />
                             </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                   <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Gallery {i}</label>
                                   <label className="cursor-pointer text-primary hover:scale-110 transition-transform">
                                      <span className="material-symbols-outlined text-[10px]">add_a_photo</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                                            const data = await res.json();
                                            if (data.success) {
                                              const input = document.getElementsByName(`gallery_${i}`)[0] as HTMLInputElement;
                                              if (input) input.value = data.url;
                                            }
                                          }
                                        }}
                                      />
                                   </label>
                                </div>
                                <input name={`gallery_${i}`} type="text" placeholder="URL..." className="w-full px-3 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] outline-none focus:border-primary font-bold" />
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t border-stone-100">
                      <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-primary transition-colors">Cancel</button>
                      <button type="submit" className="px-12 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all">Add Product (এ্যাড প্রডাক্ট)</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in pb-20">
            {/* Quick Actions Bar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
               <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Global Configurations</h2>
               <p className="text-[10px] text-stone-400 italic">Settings are applied instantly across the entire platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Gateways */}
              <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Payment Gateways</h3>
                </div>
                
                <div className="space-y-6">
                  {/* bKash Section */}
                  <div className="pt-4 border-t border-stone-50">
                    <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em]">bKash Configuration</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'bKash App Key', key: 'bkash_app_key' },
                        { label: 'bKash App Secret', key: 'bkash_app_secret', type: 'password' },
                        { label: 'bKash Username', key: 'bkash_username' },
                        { label: 'bKash Password', key: 'bkash_password', type: 'password' },
                      ].map((field) => (
                        <div key={field.key} className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">{field.label}</label>
                            <input 
                              type={field.type || 'text'} 
                              defaultValue={settings.find(s => s.key === field.key)?.value || ''}
                              id={field.key}
                              className="w-full px-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] outline-none focus:border-primary font-bold" 
                            />
                          </div>
                          <button 
                            onClick={async () => {
                              const val = (document.getElementById(field.key) as HTMLInputElement).value;
                              await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key: field.key, value: val }) });
                              alert('Saved!');
                            }}
                            className="self-end px-3 py-2 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nagad Section */}
                  <div className="pt-4 border-t border-stone-50">
                    <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em]">Nagad Configuration</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Nagad Merchant ID', key: 'nagad_merchant_id' },
                        { label: 'Nagad Public Key', key: 'nagad_public_key', type: 'password' },
                        { label: 'Nagad Private Key', key: 'nagad_private_key', type: 'password' },
                      ].map((field) => (
                        <div key={field.key} className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">{field.label}</label>
                            <input 
                              type={field.type || 'text'} 
                              defaultValue={settings.find(s => s.key === field.key)?.value || ''}
                              id={field.key}
                              className="w-full px-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] outline-none focus:border-primary font-bold" 
                            />
                          </div>
                          <button 
                            onClick={async () => {
                              const val = (document.getElementById(field.key) as HTMLInputElement).value;
                              await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key: field.key, value: val }) });
                              alert('Saved!');
                            }}
                            className="self-end px-3 py-2 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics & Couriers */}
              <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Courier API Integration</h3>
                </div>

                <div className="space-y-6">
                   {/* Steadfast Section */}
                   <div className="pt-4 border-t border-stone-50">
                    <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em]">Steadfast API</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'API Key', key: 'steadfast_api_key' },
                        { label: 'Secret Key', key: 'steadfast_secret_key', type: 'password' },
                      ].map((field) => (
                        <div key={field.key} className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">{field.label}</label>
                            <input 
                              type={field.type || 'text'} 
                              defaultValue={settings.find(s => s.key === field.key)?.value || ''}
                              id={field.key}
                              className="w-full px-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] outline-none focus:border-primary font-bold" 
                            />
                          </div>
                          <button 
                            onClick={async () => {
                              const val = (document.getElementById(field.key) as HTMLInputElement).value;
                              await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key: field.key, value: val }) });
                              alert('Saved!');
                            }}
                            className="self-end px-3 py-2 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pathao/RedX/Others */}
                  <div className="pt-4 border-t border-stone-50">
                    <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em]">Other Couriers (Coming Soon)</h4>
                    <p className="text-[9px] text-stone-400 italic">Configure keys for Pathao, RedX, and Paperfly for automatic booking.</p>
                  </div>
                </div>
              </div>

              {/* Shipping Rate Management */}
              <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm space-y-6 col-span-1 lg:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary">currency_exchange</span>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Shipping & Logistics Rates</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Steadfast Rates */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">Steadfast Logistics</h4>
                    {[
                      { label: 'Dhaka Office Delivery (per KG)', key: 'shipping_steadfast_dhaka_office' },
                      { label: 'Countrywide Office Delivery (per KG)', key: 'shipping_steadfast_country_office' },
                      { label: 'Dhaka Home Delivery (per KG)', key: 'shipping_steadfast_dhaka_home' },
                      { label: 'Countrywide Home Delivery (per KG)', key: 'shipping_steadfast_country_home' },
                    ].map(field => (
                      <div key={field.key} className="space-y-1">
                        <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">{field.label}</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            id={field.key}
                            defaultValue={settings.find(s => s.key === field.key)?.value || '0'}
                            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold outline-none focus:border-primary"
                          />
                          <button 
                            onClick={async () => {
                              const val = (document.getElementById(field.key) as HTMLInputElement).value;
                              await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key: field.key, value: val }) });
                              alert('Saved!');
                            }}
                            className="px-3 py-2 bg-stone-50 text-primary text-[8px] font-black uppercase rounded-lg hover:bg-primary hover:text-white transition-all"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General Shipping */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">General / Weight-Based</h4>
                    {[
                      { label: 'Base Rate per KG (General)', key: 'shipping_general_kg' },
                      { label: 'Base Rate per Liter (General)', key: 'shipping_general_liter' },
                      { label: 'Packaging Material Charge (Base)', key: 'shipping_base_packaging' },
                    ].map(field => (
                      <div key={field.key} className="space-y-1">
                        <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">{field.label}</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            id={field.key}
                            defaultValue={settings.find(s => s.key === field.key)?.value || '0'}
                            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold outline-none focus:border-primary"
                          />
                          <button 
                            onClick={async () => {
                              const val = (document.getElementById(field.key) as HTMLInputElement).value;
                              await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify({ key: field.key, value: val }) });
                              alert('Saved!');
                            }}
                            className="px-3 py-2 bg-stone-50 text-primary text-[8px] font-black uppercase rounded-lg hover:bg-primary hover:text-white transition-all"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-fade-in pb-20">
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
               <div>
                 <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Testimonial Management</h2>
                 <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Manage what customers say about your harvest</p>
               </div>
               <button 
                 onClick={() => setIsReviewModalOpen(true)}
                 className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-2"
               >
                 <span className="material-symbols-outlined text-sm">add_comment</span>
                 Add New Review (নতুন রিভিউ)
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviewsLoading ? (
                <div className="col-span-full py-32 text-center text-stone-300 italic animate-pulse">Accessing the diaries of satisfaction...</div>
              ) : reviews.length === 0 ? (
                <div className="col-span-full py-32 text-center text-stone-300 italic">No testimonials found. Add your first one above!</div>
              ) : reviews.map((review: any) => (
                <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
                   {/* Top Center Round Image */}
                   <div className="flex justify-center mb-6">
                     <div className="w-20 h-20 rounded-full border-4 border-stone-50 overflow-hidden bg-stone-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                       <img src={review.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user_name}`} className="w-full h-full object-cover" alt="" />
                     </div>
                   </div>

                   <div className="text-center space-y-4">
                     <div className="flex justify-center gap-0.5">
                       {[...Array(5)].map((_, i) => (
                         <span key={i} className={`material-symbols-outlined text-xs ${i < review.rating ? 'text-accent' : 'text-stone-200'}`} style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                       ))}
                     </div>
                     <p className="text-[11px] text-stone-500 font-medium leading-relaxed italic line-clamp-4">"{review.comment}"</p>
                     <div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">{review.user_name || review.users?.full_name || 'Verified Buyer'}</p>
                       <p className="text-[7px] text-stone-300 font-bold uppercase tracking-widest mt-1">Verified Experience • {new Date(review.created_at).toLocaleDateString('bn-BD')}</p>
                     </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                     <button 
                       onClick={() => {
                         setEditingReview(review);
                         setIsReviewModalOpen(true);
                       }}
                       className="w-8 h-8 rounded-full bg-white border border-stone-50 flex items-center justify-center text-stone-300 hover:text-primary hover:border-primary/20 transition-all"
                     >
                       <span className="material-symbols-outlined text-sm">edit</span>
                     </button>
                     <button 
                       onClick={async () => {
                         if (confirm('Delete this testimonial permanently?')) {
                           await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'DELETE' });
                           fetchReviews();
                         }
                       }}
                       className="w-8 h-8 rounded-full bg-white border border-stone-50 flex items-center justify-center text-stone-300 hover:text-red-500 hover:border-red-100 transition-all"
                     >
                       <span className="material-symbols-outlined text-sm">delete_forever</span>
                     </button>
                   </div>
                </div>
              ))}
            </div>

            {/* Add Review Modal */}
            {isReviewModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[80] flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-10 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-primary uppercase tracking-widest">{editingReview ? 'Modify Testimonial' : 'New Testimonial'}</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">{editingReview ? 'Update existing feedback' : 'Add a review manually to the site'}</p>
                    </div>
                    <button onClick={() => { setIsReviewModalOpen(false); setEditingReview(null); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-10">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      if (editingReview) (data as any).id = editingReview.id;
                      
                      const res = await fetch("/api/admin/reviews", { 
                        method: editingReview ? "PUT" : "POST", 
                        body: JSON.stringify(data) 
                      });
                      if (res.ok) { setIsReviewModalOpen(false); setEditingReview(null); fetchReviews(); }
                    }} className="space-y-6">
                      <div className="flex justify-center mb-4">
                        <label className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-full bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                                  const data = await res.json();
                                  if (data.success) {
                                    (document.getElementById('review_image_url') as HTMLInputElement).value = data.url;
                                    (document.getElementById('review_preview') as HTMLImageElement).src = data.url;
                                    (document.getElementById('review_preview') as HTMLImageElement).classList.remove('opacity-0');
                                  }
                                }
                              }}
                            />
                            <img id="review_preview" src={editingReview?.image_url || ''} className={`absolute inset-0 w-full h-full object-cover ${editingReview?.image_url ? 'opacity-100' : 'opacity-0'}`} alt="" />
                            <span className="material-symbols-outlined text-stone-300 group-hover:text-primary">add_a_photo</span>
                            <span className="text-[7px] font-black text-stone-300 uppercase tracking-widest mt-1">Upload Photo</span>
                          </div>
                        </label>
                        <input name="image_url" id="review_image_url" type="hidden" defaultValue={editingReview?.image_url || ''} />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Customer Name</label>
                          <input name="user_name" required defaultValue={editingReview?.user_name || ''} placeholder="Full Name" className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Review Comment</label>
                          <textarea name="comment" required defaultValue={editingReview?.comment || ''} rows={3} placeholder="What they said..." className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all resize-none"></textarea>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Star Rating</label>
                          <select name="rating" defaultValue={editingReview?.rating || '5'} className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-bold outline-none focus:border-primary transition-all">
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                        </div>
                        <button type="submit" className="self-end py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20">{editingReview ? 'Update Testimonial' : 'Publish Testimonial'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'couriers' && (
          <div className="space-y-8 animate-fade-in pb-20">
            {/* Rate Configurations Section */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
              <div className="p-8 md:p-12 border-b border-stone-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-stone-50/50">
                <div>
                  <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Logistics Rate Matrix</h2>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Configure courier charges by category and zone</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingShippingConfig(null);
                    setIsShippingModalOpen(true);
                  }}
                  className="px-8 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  Configure New Rate
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Courier Service</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Category</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Dhaka (Off/Home)</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Outside (Off/Home)</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Pricing Model</th>
                      <th className="px-10 py-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {shippingConfigs.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-20 text-stone-300 italic text-[11px]">No custom shipping rates configured yet.</td></tr>
                    ) : shippingConfigs.map((config: any) => (
                      <tr key={config.id} className="group hover:bg-stone-50/50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                               <span className="material-symbols-outlined text-sm">conveyor_belt</span>
                             </div>
                             <span className="text-[11px] font-black text-primary uppercase tracking-tight">{config.courier_name}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-stone-200">
                             {config.categories?.name || 'All Categories'}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex flex-col gap-1">
                             <p className="text-[10px] font-black text-primary">৳{config.dhaka_office_rate} / ৳{config.dhaka_home_rate}</p>
                             <p className="text-[7px] text-stone-400 uppercase font-black tracking-widest">Office / Home</p>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex flex-col gap-1">
                             <p className="text-[10px] font-black text-primary">৳{config.outside_office_rate} / ৳{config.outside_home_rate}</p>
                             <p className="text-[7px] text-stone-400 uppercase font-black tracking-widest">Office / Home</p>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${config.is_weight_based ? 'text-blue-500' : 'text-emerald-500'}`}>
                             {config.is_weight_based ? 'Weight Based (Per KG)' : 'Fixed Amount'}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => {
                                 setEditingShippingConfig(config);
                                 setIsShippingModalOpen(true);
                               }}
                               className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-primary hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all"
                             >
                               <span className="material-symbols-outlined text-lg">edit</span>
                             </button>
                             <button 
                               onClick={async () => {
                                 if (confirm('Delete this shipping rate configuration?')) {
                                   await fetch(`/api/admin/shipping-configs?id=${config.id}`, { method: 'DELETE' });
                                   fetchShippingConfigs();
                                 }
                               }}
                               className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                             >
                               <span className="material-symbols-outlined text-lg">delete</span>
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tracking Logs Section */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
                <div>
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Real-time Shipping Logs</h2>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Track live package movement</p>
                </div>
                <button onClick={fetchPackages} className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">refresh</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50/50">
                    <tr>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Courier</th>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Tracking #</th>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Weight</th>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {packagesLoading ? (
                      <tr><td colSpan={6} className="text-center py-20 text-stone-300 italic">Accessing shipping logs...</td></tr>
                    ) : packages.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-20 text-stone-300 italic">No packages currently queued for shipment.</td></tr>
                    ) : packages.map((pkg: any) => (
                      <tr key={pkg.id} className="hover:bg-stone-50/30 transition-colors">
                        <td className="px-10 py-6 text-[10px] font-bold text-primary">#{pkg.order_id}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-primary uppercase">{pkg.courier_name}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-stone-400 tracking-wider">{pkg.tracking_number}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-stone-400">{pkg.weight} KG</td>
                        <td className="px-10 py-6">
                           <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">
                             {pkg.package_status}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button 
                            onClick={async () => {
                              const res = await fetch(`/api/courier/track?tracking_number=${pkg.tracking_number}&courier=${pkg.courier_name}`);
                              const data = await res.json();
                              if (data.success) {
                                alert(`Status: ${data.status}\nLocation: ${data.location || 'N/A'}`);
                                if (data.link) window.open(data.link, '_blank');
                              } else {
                                alert('Tracking failed. Please verify credentials.');
                              }
                            }}
                            className="px-4 py-2 bg-white border border-stone-100 rounded-lg text-[9px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
                          >
                            Live Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics Modal */}
            {isShippingModalOpen && (
              <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[80] flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-12 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-primary uppercase tracking-widest">{editingShippingConfig ? 'Modify Courier Rate' : 'Courier Rate Configuration'}</h3>
                      <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mt-1">Define zone-based delivery charges</p>
                    </div>
                    <button onClick={() => setIsShippingModalOpen(false)} className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-12">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      if (editingShippingConfig) (data as any).id = editingShippingConfig.id;
                      
                      const res = await fetch("/api/admin/shipping-configs", { 
                        method: editingShippingConfig ? "PUT" : "POST", 
                        body: JSON.stringify(data) 
                      });
                      if (res.ok) { setIsShippingModalOpen(false); fetchShippingConfigs(); }
                    }} className="space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Courier Partner</label>
                          <select name="courier_name" defaultValue={editingShippingConfig?.courier_name || 'Steadfast'} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[12px] font-bold outline-none focus:border-primary transition-all">
                            {['Steadfast', 'Sundarban', 'Pathao', 'RedX', 'SA Poribahan', 'Paperfly'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Target Category</label>
                          <select name="category_id" defaultValue={editingShippingConfig?.category_id || ''} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[12px] font-bold outline-none focus:border-primary transition-all">
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${editingShippingConfig?.is_weight_based ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                              <span className="material-symbols-outlined">scale</span>
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-primary uppercase tracking-widest">Pricing Model</p>
                              <p className="text-[10px] text-stone-400 font-medium">Switch between per-KG or Fixed amount</p>
                            </div>
                          </div>
                          <div className="flex bg-white p-1.5 rounded-xl border border-stone-100">
                             <label className="cursor-pointer">
                               <input type="radio" name="is_weight_based" value="false" defaultChecked={!editingShippingConfig?.is_weight_based} className="hidden peer" />
                               <span className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-300 peer-checked:bg-emerald-500 peer-checked:text-white transition-all block text-center">Fixed</span>
                             </label>
                             <label className="cursor-pointer">
                               <input type="radio" name="is_weight_based" value="true" defaultChecked={editingShippingConfig?.is_weight_based} className="hidden peer" />
                               <span className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-300 peer-checked:bg-blue-500 peer-checked:text-white transition-all block text-center">Per KG</span>
                             </label>
                          </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-stone-100 pb-2">Dhaka City Rates</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Office Delivery</label>
                                <input name="dhaka_office_rate" required defaultValue={editingShippingConfig ? Number(editingShippingConfig.dhaka_office_rate) : ''} placeholder="৳" className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:border-primary" />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Home Delivery</label>
                                <input name="dhaka_home_rate" required defaultValue={editingShippingConfig ? Number(editingShippingConfig.dhaka_home_rate) : ''} placeholder="৳" className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:border-primary" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-stone-100 pb-2">Outside Dhaka Rates</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Office Delivery</label>
                                <input name="outside_office_rate" required defaultValue={editingShippingConfig ? Number(editingShippingConfig.outside_office_rate) : ''} placeholder="৳" className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:border-primary" />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Home Delivery</label>
                                <input name="outside_home_rate" required defaultValue={editingShippingConfig ? Number(editingShippingConfig.outside_home_rate) : ''} placeholder="৳" className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:border-primary" />
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-6 pt-10 border-t border-stone-100">
                        <button type="button" onClick={() => setIsShippingModalOpen(false)} className="text-[11px] font-black text-stone-400 uppercase tracking-widest hover:text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-12 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 hover:translate-y-[-4px] active:translate-y-0 transition-all">Save Logistics Policy</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
               <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Business Intelligence Reports</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Total Revenue', val: `৳ ${dashboardStats?.totalSales || 0}`, growth: 'All Time' },
                   { label: 'Order Volume', val: dashboardStats?.totalOrders || 0, growth: 'All Time' },
                   { label: 'Return Rate', val: '0%', growth: 'Stable' },
                 ].map((report, i) => (
                   <div key={i} className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                     <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">{report.label}</p>
                     <p className="text-xl font-display font-bold text-primary">{report.val}</p>
                     <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-2">{report.growth} from last month</p>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-stone-50 flex justify-between items-center">
                 <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Sales Summary by Category</h3>
                 <button className="text-[10px] font-bold text-primary hover:text-accent uppercase tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">download</span>
                   Export CSV
                 </button>
               </div>
               <div className="p-8 text-center text-stone-300 italic py-20">
                 Generating live data insights... Please wait for the harvest transaction logs.
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
