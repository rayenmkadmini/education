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
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, StudioTab } from '@/lib/types';

interface SidebarProps {
  currentTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  language: Language;
  resourceCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  language,
  resourceCount = 71,
  isOpenMobile,
  onCloseMobile
}) => {
  const isAr = language === 'ar';

  interface NavItem {
    id: StudioTab;
    label: { fr: string; ar: string; en: string };
    icon: React.ReactNode;
    badge?: string;
  }

  interface NavGroup {
    groupTitle: { fr: string; ar: string; en: string };
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      groupTitle: { fr: 'Studio de Création', ar: 'استوديو الإنتاج', en: 'Creation Studio' },
      items: [
        { 
          id: 'dashboard', 
          label: { fr: 'Tableau de bord', ar: 'لوحة القيادة', en: 'Dashboard' }, 
          icon: <LayoutDashboard className="w-4 h-4" /> 
        },
        { 
          id: 'generator', 
          label: { fr: 'Générateur de tâches', ar: 'توليد المهام', en: 'Task Generator' }, 
          icon: <Sparkles className="w-4 h-4 text-[#3478B8]" /> 
        },
        { 
          id: 'editor', 
          label: { fr: 'Éditeur de cours', ar: 'محرر الدروس', en: 'Content Editor' }, 
          icon: <FileEdit className="w-4 h-4" /> 
        }
      ]
    },
    {
      groupTitle: { fr: 'Knowledge & Sources', ar: 'المصادر والبرنامج', en: 'Knowledge & Sources' },
      items: [
        { 
          id: 'knowledge', 
          label: { fr: 'Bibliothèque sources', ar: 'مكتبة المراجع', en: 'Knowledge Library' }, 
          icon: <BookOpen className="w-4 h-4" />,
          badge: `${resourceCount}`
        },
        { 
          id: 'curriculum', 
          label: { fr: 'Programme officiel Bac SI', ar: 'البرنامج الرسمي', en: 'Official Curriculum' }, 
          icon: <GraduationCap className="w-4 h-4" /> 
        }
      ]
    },
    {
      groupTitle: { fr: 'Qualité & Publication', ar: 'المراجعة والنشر', en: 'Quality & Delivery' },
      items: [
        { 
          id: 'review', 
          label: { fr: 'Centre de révision', ar: 'مكتب التدقيق', en: 'Review Center' }, 
          icon: <CheckCircle2 className="w-4 h-4" /> 
        },
        { 
          id: 'export', 
          label: { fr: 'Centre d\'exportation', ar: 'مركز التصدير', en: 'Export Center' }, 
          icon: <Download className="w-4 h-4" /> 
        }
      ]
    },
    {
      groupTitle: { fr: 'Espace Apprenant', ar: 'فضاء التلميذ', en: 'Learner Experience' },
      items: [
        { 
          id: 'student', 
          label: { fr: 'Plateforme Élèves', ar: 'فضاء التلميذ', en: 'Student Platform' }, 
          icon: <Users className="w-4 h-4 text-[#27835C]" /> 
        }
      ]
    }
  ];

  const handleSelectTab = (tab: StudioTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#14243A]/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E5E9EF] flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${isAr ? 'right-0 border-l border-r-0' : 'left-0'}
        ${isOpenMobile ? 'translate-x-0' : (isAr ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
      `}>
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center px-5 border-b border-[#E5E9EF] gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14243A] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
              BAC
            </div>
            <div>
              <div className="text-sm font-bold text-[#14243A] tracking-tight leading-none">
                BAC AI <span className="text-[#3478B8]">TUNISIA</span>
              </div>
              <div className="text-[11px] text-[#718096] mt-0.5 font-medium">
                Sciences de l&apos;Informatique
              </div>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                  {group.groupTitle[language]}
                </div>
                {group.items.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-start
                        ${isActive 
                          ? 'bg-[#EBF2F9] text-[#14243A] font-semibold' 
                          : 'text-[#4A5568] hover:bg-[#F6F7F9] hover:text-[#14243A]'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#3478B8]' : 'text-[#718096]'}>
                          {item.icon}
                        </span>
                        <span>{item.label[language]}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDF2F7] text-[#4A5568] font-semibold">
                          {item.badge}
                        </span>
                      ) : isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#3478B8] opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer info: Closed knowledge base badge */}
        <div className="p-3 border-t border-[#E5E9EF] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-[#FFFFFF] border border-[#E5E9EF] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27835C] shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-[#202B38] block leading-tight">Base Fermée D:</span>
              <span className="text-[#718096] text-[10px]">Strictement Lecture Seule</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
