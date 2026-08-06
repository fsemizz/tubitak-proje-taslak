import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">CodeKids — Bilgisayarsız Kodlama</h3>
            <p className="text-xs text-slate-400">Okul öncesi & İlkokul (1-2. Sınıf) Algoritma & Mantık Platformu</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex flex-col sm:items-end gap-1">
          <p className="flex items-center justify-center sm:justify-end gap-1">
            Geleceğin yazılımcıları için sevgiyle geliştirildi <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </p>
          <p>© 2026 CodeKids — Spring Boot & React WebSocket Uyumlu Altyapı</p>
        </div>
      </div>
    </footer>
  );
};
