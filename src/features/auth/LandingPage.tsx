import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Sparkles, User, GraduationCap, ArrowRight, ShieldCheck, Gamepad2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, loginAsTeacher } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [studentGrade, setStudentGrade] = useState('1. Sınıf');
  const [teacherPasscode, setTeacherPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentSurname.trim()) {
      setErrorMessage('Lütfen adını ve soyadını gir!');
      return;
    }
    loginAsStudent(studentName, studentSurname, studentGrade);
    navigate('/catalog');
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsTeacher(teacherPasscode);
    if (success) {
      navigate('/teacher');
    } else {
      setErrorMessage('Öğretmen şifresi hatalı! (Varsayılan: 1234)');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-6">
      {/* Hero Banner Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Okul Öncesi & İlkokul Algoritmik Düşünme Platformu</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Oyna, Keşfet, <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Kodlamayı Bilgisayarsız Öğren!
          </span>
        </h1>

        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
          Sıralama, Örüntü, Hata Ayıklama, Döngü ve Koşullu Düşünme etkinlikleriyle eğlenceli kodlama dünyasına ilk adımını at.
        </p>
      </div>

      {/* Auth Card Shell */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            onClick={() => {
              setActiveTab('student');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Öğrenci Girişi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('teacher');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
              activeTab === 'teacher'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Öğretmen Modu</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-bold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Student Login Form */}
        {activeTab === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Adın
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Örn: Ali"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Soyadın
              </label>
              <input
                type="text"
                value={studentSurname}
                onChange={(e) => setStudentSurname(e.target.value)}
                placeholder="Örn: Yılmaz"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Sınıfın
              </label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Anasınıfı">Anasınıfı / Okul Öncesi</option>
                <option value="1. Sınıf">1. Sınıf</option>
                <option value="2. Sınıf">2. Sınıf</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Macaraya Başla!</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </form>
        ) : (
          /* Teacher Login Form */
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Öğretmen Giriş Şifresi
              </label>
              <input
                type="password"
                value={teacherPasscode}
                onChange={(e) => setTeacherPasscode(e.target.value)}
                placeholder="Örnek şifre: 1234"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                Varsayılan öğretmen şifresi: <code className="font-bold text-amber-600">1234</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Yönetim Paneline Giriş Yap</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
