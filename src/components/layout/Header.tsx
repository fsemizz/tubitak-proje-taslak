import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Sparkles, User, GraduationCap, LogOut, Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { role, student, isTeacherAuthenticated, logout } = useAuthStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Institutional Title */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                CodeKids
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                TÜBİTAK Proje Portalı
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Bilgisayarsız Kodlama & Analitik Düşünme Platformu
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Online/Offline PWA Indicator */}
          <div
            title={isOnline ? 'İnternet Bağlantısı Aktif' : 'Çevrimdışı Çalışma Modu (PWA)'}
            className={clsx(
              'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              isOnline
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            )}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isOnline ? 'Çevrimiçi' : 'Çevrimdışı (PWA)'}</span>
          </div>

          {/* Student Badge */}
          {role === 'student' && student && (
            <div className="flex items-center gap-2.5 bg-indigo-950/80 border border-indigo-800/80 px-3.5 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white">
                  {student.name} {student.surname}
                </p>
                <p className="text-[10px] text-indigo-300 font-semibold">Öğrenci Modu</p>
              </div>
            </div>
          )}

          {/* Teacher Navigation Button */}
          {role === 'teacher' && isTeacherAuthenticated && (
            <button
              onClick={() => navigate('/teacher')}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-4 py-2 rounded-2xl text-amber-300 text-xs font-extrabold transition-all shadow-md"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Öğretmen Paneli</span>
            </button>
          )}

          {/* Auth Button */}
          {role ? (
            <button
              onClick={handleLogout}
              title="Oturumu Kapat"
              className="p-2.5 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              <User className="w-4 h-4 mr-1" />
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
