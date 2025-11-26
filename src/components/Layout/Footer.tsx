import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-[#f7f7fa] text-[#1428a0] font-lora border-t-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row lg:gap-16">
            
            {/* Left: Logo and About */}
            <div className="flex-1 lg:max-w-md">
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="Nagomi Logo" className="w-14 h-14 object-contain mr-2" />
                <span className="text-[2rem] font-seasons text-[#1428a0] font-semibold leading-none tracking-tight">Nagomi</span>
              </div>
              <p className="font-light text-base leading-relaxed mt-1">
                India's first brand for bespoke wall decor, transforming walls into soulful statements with wallpapers, art, panels, and custom murals.
              </p>
              {/* Optional: Full original description 
              <p className="font-light text-base leading-relaxed mt-1">
                Nagomi is India's first brand offering bespoke, integrated wall decor solutions designed to bring peace and tranquility into your home...
              </p> 
              */}
            </div>

            {/* Right: Link Grid with Separation Lines */}
            {/* - On mobile (flex-col): Adds a top border and padding (border-t, pt-12, mt-12)
              - On large screens (flex-row): Resets mobile styles (lg:border-t-0, lg:pt-0, lg:mt-0)
              - On large screens: Adds a left border and padding (lg:border-l, lg:pl-16)
            */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 mt-12 border-t border-blue-200 pt-12 lg:mt-0 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-16">
              
              {/* Resources */}
              <div>
                <h3 className="mb-3 font-bold text-lg tracking-wide">Resources</h3>
                <ul className="space-y-2 font-medium">
                  <li><a href="/" className="hover:text-blue-700 hover:underline transition">Home Page</a></li>
                  <li><a href="/wallpapers" className="hover:text-blue-700 hover:underline transition">Wallpapers</a></li>
                  {/* <li><a href="/wallart" className="hover:text-blue-700 hover:underline transition">Wall Art</a></li> */}
                   <li><a href="/peelnstick" className="hover:text-blue-700 hover:underline transition">Peel-n-Stick</a></li>
                  <li><a href="/luxe" className="hover:text-blue-700 hover:underline transition">Luxe </a></li>
                  <li><a href="/custom-design" className="hover:text-blue-700 hover:underline transition">Custom Design</a></li>
                  <li><a href="/about" className="hover:text-blue-700 hover:underline transition">About Us</a></li>
                </ul>
              </div>

              {/* Policies */}
              <div>
                <h3 className="mb-3 font-bold text-lg tracking-wide">Policies</h3>
                <ul className="space-y-2 font-medium">
                  <li><a href="/privacy" className="hover:text-blue-700 hover:underline transition">Privacy Policy</a></li>
                  <li><a href="/returns" className="hover:text-blue-700 hover:underline transition">Return Policy</a></li>
                  <li><a href="/shipping" className="hover:text-blue-700 hover:underline transition">Shipping Policy</a></li>
                  <li><a href="/terms" className="hover:text-blue-700 hover:underline transition">Terms of Service</a></li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="mb-3 font-bold text-lg tracking-wide">Follow Us</h3>
                <a 
                  href="https://www.instagram.com/nagomi.walls/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center group transition"
                >
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
                  <span className="font-medium group-hover:text-blue-700 group-hover:underline">
                    @nagomi.walls
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sub-Footer (Unchanged from your original) */}
        <div className="w-full text-center text-sm font-semibold font-serif py-3 bg-[#1a2236] text-white shadow-inner border-t-2 border-blue-900 tracking-wide">
          <span className="inline-block px-2 rounded-md bg-[#232b47] shadow text-white">Nagomi is a brand fully owned by Piyush Interiors</span>
        </div>
      </footer>
    </>
  );
};

export default Footer;