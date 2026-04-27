"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <footer className="bg-stone-50 py-16 px-6 border-t border-stone-100 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-sm font-black italic">T</span>
            </div>
            <span className="text-xl font-black text-primary tracking-tighter">TKS.bd</span>
          </Link>
          <p className="text-stone-400 text-xs leading-relaxed">
            Your trusted source for authentic, premium, and chemical-free organic produce. Sourced directly from our heritage orchards.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Shop</h4>
          <ul className="space-y-2 text-stone-400 text-[10px] font-medium uppercase tracking-widest">
            <li><Link href="/#mangoes" className="hover:text-primary transition-colors">Mango Varieties</Link></li>
            <li><Link href="/#tea" className="hover:text-primary transition-colors">Organic Tea</Link></li>
            <li><Link href="/#gur" className="hover:text-primary transition-colors">Heritage Gur</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Company</h4>
          <ul className="space-y-2 text-stone-400 text-[10px] font-medium uppercase tracking-widest">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/#contact" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Purity Process</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Social</h4>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-stone-300 hover:text-primary cursor-pointer">facebook</span>
            <span className="material-symbols-outlined text-stone-300 hover:text-primary cursor-pointer">instagram</span>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-stone-100 text-center">
        <p className="text-[8px] text-stone-300 uppercase tracking-[0.4em] font-bold">© 2026 TKS.bd | Cultivating Transparency</p>
      </div>
    </footer>
  );
}
