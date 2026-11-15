'use client';

import React from 'react';
import { 
  Menu, 
  Languages, 
  HardDrive,
  ChevronRight
} from 'lucide-react';
import { Language, StudioTab } from '@/lib/types';

interface TopbarProps {
  currentTab: StudioTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenMobile: () => void;
  resourceCount?: number;
}

const TAB_TITLES: Record<StudioTab, { fr: string; ar: string; en: string }> = {
  dashboard: { fr: 'Tableau de bord', ar: 'لوحة القيادة', en: 'Dashboard' },
  generator: { fr: 'Générateur de tâches', ar: 'توليد المهام', en: 'Task Generator' },
  editor: { fr: 'Éditeur de cours & devoirs', ar: 'محرر الدروس', en: 'Content Editor' },
  knowledge: { fr: 'Bibliothèque des sources', ar: 'مكتبة المراجع', en: 'Knowledge Library' },
  curriculum: { fr: 'Programme officiel Bac SI', ar: 'البرنامج الرسمي', en: 'Curriculum' },
  review: { fr: 'Centre de validation & révision', ar: 'مكتب التدقيق', en: 'Review Center' },
  export: { fr: 'Centre d\'exportation', ar: 'مركز التصدير', en: 'Export Center' },
  student: { fr: 'Espace Apprenant (Élèves)', ar: 'فضاء التلميذ', en: 'Student Platform' }
};

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  language,
  onLanguageChange,
  onOpenMobile,
  resourceCount = 71
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-[#E5E9EF] px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-1.5 rounded-md text-[#718096] hover:text-[#14243A] hover:bg-[#F6F7F9] lg:hidden cursor-pointer"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#718096]">
          <span className="font-medium text-[#14243A]">BAC AI Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0]" />
          <span className="font-semibold text-[#3478B8]">
            {TAB_TITLES[currentTab]?.[language] || 'Section'}
          </span>
        </div>
      </div>

      {/* Right: Knowledge pill & Language Switcher */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E5E9EF] text-xs text-[#718096]">
          <HardDrive className="w-3.5 h-3.5 text-[#3478B8]" />
          <span>Disque D:</span>
          <span className="font-semibold text-[#14243A] font-mono">{resourceCount} fichiers</span>
        </div>

        {/* Clean Language Selector Pill */}
        <div className="flex items-center bg-[#F8FAFC] border border-[#E5E9EF] rounded-md p-0.5 text-xs">
          <Languages className="w-3.5 h-3.5 text-[#718096] mx-1.5" />
          <button
            onClick={() => onLanguageChange('fr')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'fr' 
                ? 'bg-[#14243A] text-white shadow-xs' 
                : 'text-[#718096] hover:text-[#14243A]'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'ar' 
                ? 'bg-[#14243A] text-white shadow-xs' 
                : 'text-[#718096] hover:text-[#14243A]'
            }`}
          >
            عربي
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'en' 
                ? 'bg-[#14243A] text-white shadow-xs' 
                : 'text-[#718096] hover:text-[#14243A]'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};
