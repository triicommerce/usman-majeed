import React from 'react';
import { Link } from 'react-router-dom';

export const StudioHome: React.FC = () => {
  const tiles = [
    { to: '/studio/podcast', title: 'Audio/Video Podcast' },
    { to: '/studio/mindmap', title: 'Mindmaps' },
    { to: '/studio/logo-2d', title: '2D Logo' },
    { to: '/studio/logo-3d', title: '3D Logo' },
    { to: '/studio/habits', title: 'Habit Tracker' },
    { to: '/studio/film', title: 'Film Maker' },
    { to: '/studio/print/signs', title: 'Printable Signs' },
    { to: '/studio/print/checklists', title: 'Printable Checklists' },
    { to: '/studio/print/maps', title: 'Printable Maps' },
    { to: '/studio/print/coupons', title: 'Printable Coupons' },
    { to: '/studio/print/worksheets', title: 'Worksheets' },
    { to: '/studio/print/flashcards', title: 'Flashcards' },
    { to: '/studio/print/bookmarks', title: 'Bookmarks' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Creative Studio</h1>
      <p className="text-slate-400 mb-6">Generate unlimited media and printables.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles.map(tile => (
          <Link key={tile.to} to={tile.to} className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 hover:bg-slate-700/40">
            <div className="text-white font-semibold">{tile.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

