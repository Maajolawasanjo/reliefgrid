'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FullLogo } from '@/components/ui/logo';
import { Icon } from '@/components/ui/icons';

export function LandingNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Workflow', href: '#workflow' },
    { label: 'Agents', href: '#agents' },
    { label: 'Memory', href: '#memory' },
    { label: 'GIS Matrix', href: '#gis' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Stack', href: '#stack' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-transparent border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Brand */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#9AF376] rounded-xl p-1">
          <FullLogo iconSize="h-8 w-8" textClass="text-lg text-slate-100 font-extrabold tracking-tight" subtitle={false} />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-slate-100 transition-colors focus:outline-none focus:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/docs"
            className="hover:text-[#9AF376] transition-colors focus:outline-none focus:text-white flex items-center gap-1"
          >
            <span>API Docs</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">v1.0</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 focus:outline-none"
            aria-label="View Source Code on GitHub"
          >
            <svg className="h-4 w-4 fill-current text-slate-300" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-mono text-[11px] text-slate-400">GitHub</span>
          </a>

          <Link
            href="/login"
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus:outline-none"
          >
            Sign In
          </Link>

          <button
            onClick={() => router.push('/incidents')}
            className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38bdf8] px-4 py-2 text-xs font-extrabold text-slate-950 hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] flex items-center gap-2 focus:outline-none"
          >
            <Icon name="incident" size={14} className="text-slate-950" />
            <span>Command Center</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/incidents');
              }}
              className="w-full text-center rounded-xl bg-[#00D2FF] py-2.5 text-xs font-extrabold text-slate-950"
            >
              Launch Emergency Command Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
