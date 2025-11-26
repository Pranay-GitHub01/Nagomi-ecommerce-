import React from 'react';
import { MessageCircle, Image, Monitor, Layers, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomDesign = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="text-blue-700 text-sm mb-12">
          <span className="hover:underline cursor-pointer"><Link to="/">Home</Link></span> &gt; <span className="text-blue-900/80">Custom Design</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-serif text-[#1e2e8c] mb-6">
            Let your walls echo your imagination.
          </h1>

          {/* Sub-headline */}
          <p className="text-gray-700 text-lg italic mb-6 font-seasons">
            If your heart is set on something beyond our collection:
          </p>

          {/* Bullet Points */}
          <ul className="text-gray-600 text-base md:text-lg mb-8 space-y-2 font-lora">
            <li className="flex items-center justify-center gap-2 font-lora">
              <span className="text-gray-400">•</span>
              Share a Google/Pinterest image you love - customisation is complimentary
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-gray-400">•</span>
              Have an idea of your own? We can design it from scratch for a small fee
            </li>
          </ul>

          {/* CTA Description */}
          <p className="text-gray-600 font-serif text-lg md:text-xl mb-8 leading-relaxed">
            Simply WhatsApp us, and we'll share suggestions so you find the design that feels just right.
          </p>

          {/* WhatsApp Button */}
          <button className="bg-[#6cc070] hover:bg-[#5ab060] text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-sm mb-16">
            <MessageCircle className="w-6 h-6 fill-current" />
            <span className="text-lg shadow-text"><a href="https://wa.me/918588825148">Share Your Vision</a></span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-4xl mx-auto">
          {/* Feature 1 */}
          <FeatureItem 
            icon={<Image className="w-8 h-8 text-white" />}
            title="Unlimited"
            subtitle="Designs"
          />
          
          {/* Feature 2 */}
          <FeatureItem 
            icon={<Monitor className="w-8 h-8 text-white" />}
            title="Free"
            subtitle="Customization"
          />

          {/* Feature 3 */}
          <FeatureItem 
            icon={<Layers className="w-8 h-8 text-white" />}
            title="14 Premium"
            subtitle="Finishes"
          />

          {/* Feature 4 */}
          <FeatureItem 
            icon={<Headset className="w-8 h-8 text-white" />}
            title="End-to-end"
            subtitle="Service"
          />
        </div>
      </div>
    </div>
  );
};

// Helper component for the feature icons to keep code clean
const FeatureItem = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="w-16 h-16 bg-[#1e2e8c] rounded-full flex items-center justify-center shadow-md">
      {icon}
    </div>
    <div className="text-[#1e2e8c] text-center font-serif font-medium leading-tight">
      <div>{title}</div>
      <div>{subtitle}</div>
    </div>
  </div>
);

export default CustomDesign;