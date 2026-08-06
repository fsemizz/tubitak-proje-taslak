import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Sparkles, User, GraduationCap, LogOut, Wifi, WifiOff } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-indigo-100 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
              CodeKids
            </h1>
            <p className="text-xs font-semibold text-indigo-900/60 dark:text-indigo-300">
              Bilgisayarsız Kodlama Macera Parkı
            </p>
          </div>
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Online/Offline PWA Badge */}
          <div 
            title={isOnline ? 'İnternet Bağlantısı Aktif' : 'Çevrimdışı Çalışma Modu (PWA)'}
            className={clsx(
              "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              isOnline 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Çevrimiçi' : 'Çevrimdışı (PWA)'}</span>
          </div>

          {/* Student Status */}
          {role === 'student' && student && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-indigo-950 dark:text-indigo-100">
                  {student.name} {student.surname}
                </p>
                <p className="text-[10px] text-indigo-800 dark:text-indigo-300 font-medium">Öğrenci Modu</p>
              </div>
            </div>
          )}

          {/* Teacher Badge */}
          {role === 'teacher' && isTeacherAuthenticated && (
            <button
              onClick={() => navigate('/teacher')}
              className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 px-3.5 py-1.5 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Öğretmen Paneli</span>
            </button>
          )}

          {/* Auth Button */}
          {role ? (
            <button
              onClick={handleLogout}
              title="Oturumu Kapat"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <LogOut className="w-5 h-5 text-gray-500 hover:text-red-600" />
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
