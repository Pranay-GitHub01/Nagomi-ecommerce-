import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
    <footer className="bg-[#f7f7fa] border-t-2 border-blue-100 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 md:gap-0 items-start justify-between">
        {/* Left: Logo and About */}
        <div className="flex-1 min-w-[240px] flex flex-col items-start md:pr-8 mb-8 md:mb-0">
          <div className="flex items-center mb-3">
            <img src="/logo.png" alt="Nagomi Logo" className="w-14 h-14 object-contain mr-2" />
            <span className="text-[2rem] font-seasons text-[#1428a0] font-semibold leading-none tracking-tight">Nagomi</span>
          </div>
          <p className="text-[#1428a0] font-light text-base leading-relaxed mt-1 max-w-xs md:max-w-sm font-lora">
            Nagomi is India's first brand offering bespoke, integrated wall decor solutions designed to bring peace and tranquility into your home. Our enchanting wall designs combine high-quality wallpapers, wall art, panels, and mouldings, all customizable to reflect your unique style. We also offer exquisite details like hand embroidery, gold foiling, and embossing, along with skilled muralists who can paint live on your walls. With expert installation teams across India and a track record of delighted clients, Nagomi is known for transforming ordinary walls into soulful statements.
          </p>
        </div>
        {/* Center: Resources */}
        <div className="flex-1 min-w-[180px] flex flex-col items-start md:items-center mb-8 md:mb-0">
          <div className="mb-2 text-[#1428a0] font-bold text-lg font-lora tracking-wide">Resources</div>
          <ul className="text-[#1428a0] font-medium font-lora text-base space-y-1">
            <li><a href="/" className="hover:underline hover:text-blue-700 transition">Home Page</a></li>
            <li><a href="/wallpapers" className="hover:underline hover:text-blue-700 transition">Wallpapers</a></li>
            <li><a href="/wallart" className="hover:underline hover:text-blue-700 transition">Wall Art</a></li>
            <li><a href="/custom-design" className="hover:underline hover:text-blue-700 transition">Custom Design</a></li>
            <li><a href="/about" className="hover:underline hover:text-blue-700 transition">About Us</a></li>
          </ul>
        </div>
        {/* Right: Policies and Instagram */}
        <div className="flex-1 min-w-[200px] flex flex-col items-start md:items-end">
          <div className="mb-2 text-[#1428a0] font-bold text-lg font-lora tracking-wide">Policies</div>
          <ul className="text-[#1428a0] font-medium font-lora text-base space-y-1 mb-3 md:text-right">
            <li><a href="/privacy" className="hover:underline hover:text-blue-700 transition">Privacy Policy</a></li>
            <li><a href="/returns" className="hover:underline hover:text-blue-700 transition">Return &amp; Exchange Policy</a></li>
            <li><a href="/shipping" className="hover:underline hover:text-blue-700 transition">Shipping Policy</a></li>
            <li><a href="/terms" className="hover:underline hover:text-blue-700 transition">Terms of Service</a></li>
          </ul>
          <div className="flex items-center mt-2 md:justify-end justify-center w-full">
            <span className="inline-flex items-center justify-center w-7 h-7 mr-2 drop-shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <defs>
                  <radialGradient id="ig-gradient" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#f9ce34"/>
                    <stop offset="45%" stopColor="#ee2a7b"/>
                    <stop offset="100%" stopColor="#6228d7"/>
                  </radialGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-gradient)"/>
                <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="17" cy="7" r="1.2" fill="#fff"/>
              </svg>
            </span>
            <a href="https://www.instagram.com/nagomi.walls/" target="_blank" rel="noopener noreferrer" className="text-[#1428a0] font-bold font-lora text-base hover:underline hover:text-blue-700 transition">@nagomi.walls</a>
          </div>
        </div>
      </div>
      </footer>
      <div className="w-full text-center text-sm font-semibold font-serif py-3 bg-[#1a2236] text-white shadow-inner border-t-2 border-blue-900 tracking-wide">
        <span className="inline-block px-2 rounded-md bg-[#232b47] shadow text-white">Nagomi is a brand fully owned by Piyush Interiors</span>
      </div>
  </>  
  );
  
};

export default Footer;