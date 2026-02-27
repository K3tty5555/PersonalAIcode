'use client';

import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              scrolled
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20'
                : 'bg-gradient-to-br from-gray-900 to-gray-700'
            } shadow-lg group-hover:scale-105`}>
              <Newspaper className="w-4 h-4 text-white" />
            </div>
            <span className={`font-semibold text-sm tracking-tight transition-colors ${
              scrolled ? 'text-gray-900' : 'text-gray-900'
            }`}>
              Daily Push
            </span>
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {['AI 热点', '收藏模型', '游戏折扣'].map((item, index) => {
              const href = ['#ai', '#toys', '#games'][index];
              return (
                <a
                  key={item}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    scrolled
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
