import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/studio', label: 'Home' },
  { to: '/studio/podcast', label: 'Podcast' },
  { to: '/studio/mindmap', label: 'Mindmaps' },
  { to: '/studio/logo-2d', label: 'Logo 2D' },
  { to: '/studio/logo-3d', label: 'Logo 3D' },
  { to: '/studio/habits', label: 'Habit Tracker' },
  { to: '/studio/film', label: 'Film Maker' },
  { to: '/studio/print/signs', label: 'Signs' },
  { to: '/studio/print/checklists', label: 'Checklists' },
  { to: '/studio/print/maps', label: 'Maps' },
  { to: '/studio/print/coupons', label: 'Coupons' },
  { to: '/studio/print/worksheets', label: 'Worksheets' },
  { to: '/studio/print/flashcards', label: 'Flashcards' },
  { to: '/studio/print/bookmarks', label: 'Bookmarks' },
];

export const StudioLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-slate-800/40 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Studio</h2>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-600/20 text-cyan-300' : 'hover:bg-slate-700/40'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <section className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 md:p-6">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

