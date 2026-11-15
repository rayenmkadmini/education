'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { DashboardView } from '@/components/DashboardView';
import { KnowledgeView } from '@/components/KnowledgeView';
import { CurriculumView } from '@/components/CurriculumView';
import { GeneratorView } from '@/components/GeneratorView';
import { EditorView } from '@/components/EditorView';
import { ReviewView } from '@/components/ReviewView';
import { ExportView } from '@/components/ExportView';
import { StudentPlatformView } from '@/components/StudentPlatformView';
import { Language, StudioTab } from '@/lib/types';

export default function StudioHome() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('dashboard');
  const [language, setLanguage] = useState<Language>('fr');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [liveDocCount, setLiveDocCount] = useState<number>(71);

  useEffect(() => {
    fetch('/api/source-policy')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.policy?.totalAuthorizedDocuments) {
          setLiveDocCount(data.policy.totalAuthorizedDocuments);
        }
      })
      .catch(() => {});
  }, []);

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#202B38] flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Redesigned Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        resourceCount={liveDocCount}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className={`flex-1 flex flex-col min-w-0 ${isRTL ? 'lg:mr-64' : 'lg:ml-64'}`}>
        {/* Contextual Topbar */}
        <Topbar
          currentTab={currentTab}
          language={language}
          onLanguageChange={setLanguage}
          onOpenMobile={() => setIsMobileNavOpen(true)}
          resourceCount={liveDocCount}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView onNavigate={setCurrentTab} language={language} />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeView language={language} />
          )}

          {currentTab === 'curriculum' && (
            <CurriculumView language={language} />
          )}

          {currentTab === 'generator' && (
            <GeneratorView 
              language={language} 
              onNavigateToDraft={() => setCurrentTab('editor')} 
            />
          )}

          {currentTab === 'editor' && (
            <EditorView 
              language={language} 
              onNavigateToReview={() => setCurrentTab('review')} 
            />
          )}

          {currentTab === 'review' && (
            <ReviewView 
              language={language} 
              onNavigateToExport={() => setCurrentTab('export')} 
            />
          )}

          {currentTab === 'export' && (
            <ExportView language={language} />
          )}

          {currentTab === 'student' && (
            <StudentPlatformView language={language} />
          )}
        </main>

        {/* Editorial Subdued Footer */}
        <footer className="border-t border-[#E5E9EF] bg-[#FFFFFF] py-4 px-6 text-center text-xs text-[#718096]">
          BAC AI TUNISIA • Studio Pédagogique Officiel • Section Sciences de l&apos;Informatique 2026–2027 • Données Locales
        </footer>
      </div>
    </div>
  );
}
