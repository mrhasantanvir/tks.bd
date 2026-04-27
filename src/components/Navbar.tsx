"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide Navbar in Admin Dashboard
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-stone-100 px-6 md:px-20 py-2 md:py-2.5">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-xl font-black italic">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-primary group-hover:text-emerald-700 transition-colors">TKS.bd</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-600/60 leading-none">Premium Orchard Harvest</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/#mangoes" className="hover:text-primary transition-colors">Mangoes</Link>
          <Link href="/#tea" className="hover:text-primary transition-colors">Tea</Link>
          <Link href="/#gur" className="hover:text-primary transition-colors">Organic Gur</Link>
          <Link href="/#reviews" className="hover:text-primary transition-colors">Reviews</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/checkout" className="material-symbols-outlined text-primary hover:text-accent transition-colors text-2xl">local_mall</Link>
          <Link href="/dashboard" className="hidden md:block material-symbols-outlined text-primary hover:text-accent transition-colors text-2xl">person_outline</Link>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden material-symbols-outlined text-primary text-3xl"
          >
            {isOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl p-8 flex flex-col gap-6 animate-fade-in-down">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold text-primary uppercase tracking-widest border-b border-stone-50 pb-2">Home</Link>
          <Link href="/#mangoes" onClick={() => setIsOpen(false)} className="text-sm font-bold text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">Mangoes</Link>
          <Link href="/#tea" onClick={() => setIsOpen(false)} className="text-sm font-bold text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">Tea</Link>
          <Link href="/#gur" onClick={() => setIsOpen(false)} className="text-sm font-bold text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">Organic Gur</Link>
          <Link href="/#reviews" onClick={() => setIsOpen(false)} className="text-sm font-bold text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">Reviews</Link>
          <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-sm font-bold text-stone-500 uppercase tracking-widest border-b border-stone-50 pb-2">About Us</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-bold text-accent uppercase tracking-widest">My Account</Link>
        </div>
      )}
    </nav>
  );
}
