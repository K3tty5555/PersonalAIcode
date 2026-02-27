'use client';

import { Newspaper, Github, Twitter, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: '关于我们', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '联系我们', href: '#' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@dailypush.app', label: 'Email' },
  ];

  return (
    <footer className="py-12 bg-zinc-100 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold">Daily Push</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {currentYear} Daily Push. 每日精选资讯，为你呈现。</p>
          <p className="mt-2 text-xs">
            汇率数据仅供参考，实际以交易时为准。
          </p>
        </div>
      </div>
    </footer>
  );
}
