'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  FileEdit, 
  CheckCircle2, 
  Download, 
  Languages, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { Language, StudioTab } from '@/lib/types';

interface NavbarProps {
  currentTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  resourceCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  resourceCount = 71
}) => {
  const navItems: Array<{ id: StudioTab; label: { fr: string; ar: string; en: string }; icon: React.ReactNode }> = [
    { id: 'dashboard', label: { fr: 'Tableau de Bord', ar: 'لوحة القيادة', en: 'Dashboard' }, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'knowledge', label: { fr: 'Bibliothèque Sources', ar: 'مكتبة المراجع', en: 'Knowledge Library' }, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'curriculum', label: { fr: 'Programme Bac SI', ar: 'البرنامج الرسمي', en: 'Curriculum' }, icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'generator', label: { fr: 'Générateur IA', ar: 'توليد المهام', en: 'AI Task Generator' }, icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
    { id: 'editor', label: { fr: 'Studio Auteur', ar: 'محرر الدروس', en: 'Educational Editor' }, icon: <FileEdit className="w-4 h-4" /> },
    { id: 'review', label: { fr: 'Validation & Diffs', ar: 'مراجعة المسودات', en: 'Draft Review' }, icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'export', label: { fr: 'Centre d\'Export', ar: 'مركز التصدير', en: 'Export Center' }, icon: <Download className="w-4 h-4" /> },
    { id: 'student', label: { fr: 'Plateforme Élèves', ar: 'فضاء التلميذ', en: 'Student Portal' }, icon: <Users className="w-4 h-4 text-emerald-400" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-md border-b border-[#1E2D4A] px-4 lg:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              BAC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">
                  BAC AI <span className="text-cyan-400">TUNISIA</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-semibold uppercase tracking-wider">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Section Sciences de l&apos;Informatique • 2026–2027
              </p>
            </div>
          </div>

          {/* Strict Closed Knowledge Base Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E1626] border border-emerald-800/60 text-[11px]" title="Règle Système : Source fermée exclusive D:\EDUCATION RAYEN\bac info cours exam resourse. Web et sources externes strictement bloqués.">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Base Fermée D:</span>
            <span className="font-semibold text-emerald-300 font-mono">{resourceCount} docs</span>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1626]'
                }`}
              >
                {item.icon}
                <span>{item.label[language]}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Language Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0E1626] border border-[#1E2D4A] rounded-lg p-0.5 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'fr' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'ar' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
