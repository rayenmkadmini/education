'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  Award,
  Clock,
  Calculator,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Language } from '@/lib/types';
import { BAC_SI_CURRICULUM, CurriculumSubject, CurriculumChapter } from '@/lib/curriculum-data';

interface CurriculumViewProps {
  language: Language;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [activeSubject, setActiveSubject] = useState<CurriculumSubject>(BAC_SI_CURRICULUM[0]);
  const [activeChapter, setActiveChapter] = useState<CurriculumChapter>(BAC_SI_CURRICULUM[0].chapters[0]);
  const [activeTab, setActiveTab] = useState<'SECTIONS' | 'OBJECTIVES' | 'ASSESSMENT' | 'REFERENCES'>('SECTIONS');

  const handleSubjectChange = (subject: CurriculumSubject) => {
    setActiveSubject(subject);
    setActiveChapter(subject.chapters[0]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#14243A] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#3478B8]" />
              {isAr ? 'البرنامج الرسمي لباكالوريا علوم الإعلامية (تونس)' : 'Référentiel Pédagogique Officiel — Baccalauréat Sciences de l\'Informatique'}
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#3478B8] font-semibold font-mono">
              Session 2026–2027
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {isAr 
              ? 'توزيع المعاملات والفصول الرسمية الصادرة عن وزارة التربية التونسية لجميع المواد.'
              : 'Coefficients, durées, formats d\'épreuves et référentiel de compétences validés par le Ministère de l\'Éducation.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Curriculum Homologué (VERIFIED_OFFICIAL)</span>
        </div>
      </div>

      {/* Main Grid: Subject Selector & Detailed Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Subjects (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {BAC_SI_CURRICULUM.map((subj) => {
            const isSelected = subj.id === activeSubject.id;
            return (
              <div
                key={subj.id}
                onClick={() => handleSubjectChange(subj)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                  isSelected
                    ? 'bg-[#F1F5F9] border-[#3478B8] text-[#14243A]'
                    : 'bg-white border-[#E5E9EF] hover:bg-[#F8FAFC]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#14243A] flex items-center gap-1.5">
                    <span>{isAr ? subj.nameAr : subj.name}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-1 flex items-center gap-2">
                    <span className="text-[#3478B8] font-semibold">Coeff : {subj.coeff}</span>
                    <span>• {subj.examType}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#3478B8]' : 'text-[#94A3B8]'}`} />
              </div>
            );
          })}

          {/* Verification Audit Note */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] text-[11px] text-[#64748B] space-y-1.5 mt-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-[#14243A] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantie de Traçabilité</span>
            </div>
            <p className="leading-relaxed">
              Chaque coefficient et libellé de chapitre est indexé sur les textes officiels du Ministère et les épreuves nationales du Baccalauréat. Aucune extrapolation non vérifiée n&apos;est tolérée.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Chapter & Modules Breakdown (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          
          {/* Active Subject Meta Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E9EF] pb-4">
            <div>
              <div className="text-[11px] text-[#3478B8] uppercase tracking-wider font-semibold">
                Matière Sélectionnée — Section SI
              </div>
              <h2 className="text-lg font-bold text-[#14243A] mt-0.5">
                {isAr ? activeSubject.nameAr : activeSubject.name}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-[#3478B8] border border-blue-200 font-mono font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Coeff : {activeSubject.coeff}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#F6F7F9] text-[#475569] border border-[#E5E9EF] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> {activeSubject.durationMinutes} min
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium flex items-center gap-1 ${
                activeSubject.calculatorAllowed 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Calculator className="w-3.5 h-3.5" /> 
                {activeSubject.calculatorAllowed ? 'Calculatrice Autorisée' : 'Calculatrice Interdite'}
              </span>
            </div>
          </div>

          {/* Chapter Selector Pills */}
          <div className="space-y-2">
            <span className="text-[#64748B] text-xs font-semibold block">Chapitres au Programme :</span>
            <div className="flex flex-wrap gap-2">
              {activeSubject.chapters.map((ch) => {
                const isSelected = ch.id === activeChapter.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapter(ch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#14243A] text-white shadow-sm'
                        : 'bg-[#F6F7F9] text-[#475569] hover:bg-[#EEF1F5] border border-[#E5E9EF]'
                    }`}
                  >
                    Chapitre {ch.number} : {ch.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Deep Dive Container */}
          <div className="p-5 rounded-xl bg-[#F6F7F9] border border-[#E5E9EF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
              <div>
                <span className="text-[10px] text-[#3478B8] font-mono font-semibold">Chapitre {activeChapter.number}</span>
                <h3 className="text-sm font-bold text-[#14243A]">{activeChapter.title}</h3>
                {activeChapter.titleAr && (
                  <div className="text-xs text-[#64748B] font-arabic mt-0.5">{activeChapter.titleAr}</div>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                {activeChapter.verificationStatus}
              </span>
            </div>

            {/* Sub-Tabs Selector */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E9EF] pb-2">
              {[
                { id: 'SECTIONS', label: 'Sections & Notions Clés' },
                { id: 'OBJECTIVES', label: 'Objectifs & Compétences' },
                { id: 'ASSESSMENT', label: 'Critères d\'Évaluation' },
                { id: 'REFERENCES', label: 'Sources Documentaires' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === t.id 
                      ? 'bg-white text-[#14243A] font-semibold shadow-xs border border-[#E5E9EF]' 
                      : 'text-[#64748B] hover:text-[#202B38]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Sections */}
            {activeTab === 'SECTIONS' && (
              <div className="space-y-3 text-xs">
                {activeChapter.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-3.5 rounded-lg bg-white border border-[#E5E9EF] space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="font-semibold text-[#14243A] flex items-center gap-2">
                      <span className="text-[#3478B8] font-mono text-[11px]">{activeChapter.number}.{idx + 1}</span>
                      <span>{sec.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sec.keyConcepts.map((k, kidx) => (
                        <span key={kidx} className="text-[10px] px-2 py-0.5 rounded bg-[#F6F7F9] text-[#475569] border border-[#E5E9EF]">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Objectives & Competencies */}
            {activeTab === 'OBJECTIVES' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <span className="font-semibold text-[#14243A] block">Objectifs Pédagogiques Opérationnels :</span>
                  {activeChapter.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#475569]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E5E9EF]">
                  <span className="font-semibold text-[#14243A] block">Compétences Terminales Visées :</span>
                  {activeChapter.competencies.map((comp, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#475569]">
                      <Layers className="w-3.5 h-3.5 text-[#3478B8] shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Assessment Criteria */}
            {activeTab === 'ASSESSMENT' && (
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-[#14243A] block">Critères de Notation & Exigences d&apos;Épreuve :</span>
                {activeChapter.assessmentCriteria.map((crit, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white border border-[#E5E9EF] flex items-start gap-2 text-[#475569]">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
                {activeChapter.prerequisites.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E5E9EF]">
                    <span className="text-[#64748B] text-[11px] block mb-1">Prérequis indispensables :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeChapter.prerequisites.map((p, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white text-[#64748B] border border-[#E5E9EF]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Official References */}
            {activeTab === 'REFERENCES' && (
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-[#14243A] block">Documents Sources Homologués :</span>
                {activeChapter.officialReferences.map((ref, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white border border-[#E5E9EF] flex items-center gap-2.5 text-[#475569]">
                    <FileText className="w-4 h-4 text-[#3478B8] shrink-0" />
                    <span className="font-mono text-[11px]">{ref}</span>
                  </div>
                ))}
                <div className="mt-3 p-3 rounded-lg bg-white border border-[#E5E9EF] text-[11px] text-[#64748B]">
                  <span className="text-[#14243A] font-semibold block">Référence Administrative Générale :</span>
                  {activeSubject.officialReference}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};