'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Award, 
  Terminal,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Code2,
  CheckSquare,
  AlertTriangle,
  Send
} from 'lucide-react';
import { Language, PublicationRecord } from '@/lib/types';
import { BAC_SI_CURRICULUM } from '@/lib/curriculum-data';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';
import { PythonPlaygroundModal } from './PythonPlaygroundModal';

interface StudentPlatformViewProps {
  language: Language;
}

export const StudentPlatformView: React.FC<StudentPlatformViewProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(BAC_SI_CURRICULUM[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [publications, setPublications] = useState<PublicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Interactive Python Playground State ---
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [playgroundInitialCode, setPlaygroundInitialCode] = useState<string | undefined>(undefined);

  // --- Exam Simulator Mode State (3h00) ---
  const [isExamMode, setIsExamMode] = useState(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(3 * 3600); // 3 hours = 10,800s
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [selfScores, setSelfScores] = useState<Record<string, number>>({});

  // Countdown timer hook for Exam Mode
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isExamMode && isExamRunning && examSecondsLeft > 0) {
      timer = setInterval(() => {
        setExamSecondsLeft(prev => {
          if (prev <= 1) {
            setIsExamRunning(false);
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamMode, isExamRunning, examSecondsLeft]);

  // Format seconds to HH:MM:SS
  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // STRICT PRIVACY: Load ONLY approved publications from /api/publications (NEVER drafts)
  useEffect(() => {
    fetch('/api/publications')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.publications)) {
          setPublications(data.publications);
        }
      })
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  const activeSubject = useMemo(() => {
    return BAC_SI_CURRICULUM.find(s => s.id === selectedSubjectId) || BAC_SI_CURRICULUM[0];
  }, [selectedSubjectId]);

  const toggleSolution = (exerciseId: string) => {
    if (isExamMode && !examSubmitted) return; // Strict: Locked during exam
    setRevealedSolutions(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  // Filter published items by current subject and search query
  const filteredPubs = useMemo(() => {
    return publications.filter(pub => {
      const matchSubject = pub.subject.toLowerCase().includes(activeSubject.name.toLowerCase()) ||
                           activeSubject.name.toLowerCase().includes(pub.subject.toLowerCase());
      const matchSearch = searchQuery === '' || 
                          pub.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.content.exercises.some(e => e.statementMarkdown.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSubject && matchSearch;
    });
  }, [publications, activeSubject, searchQuery]);

  // Compute total points evaluated in self-scores
  const totalSelfScore = useMemo(() => {
    return Object.values(selfScores).reduce((acc, pts) => acc + (pts || 0), 0);
  }, [selfScores]);

  return (
    <div className="space-y-6">
      
      {/* Student Portal Hero Banner - Editorial Navy */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#14243A] text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-cyan-200 font-semibold font-mono">
              <GraduationCap className="w-4 h-4 text-cyan-300" />
              {isAr ? 'فضاء المراجعة والتحضير لامتحان الباكالوريا' : 'Portail Étudiant — Baccalauréat Sciences de l\'Informatique'}
            </div>

            {/* Quick Actions in Banner */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPlaygroundInitialCode(undefined);
                  setIsPlaygroundOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'محرر بايثون التفاعلي' : 'Console Python 3'}</span>
              </button>

              <button
                onClick={() => {
                  const nextMode = !isExamMode;
                  setIsExamMode(nextMode);
                  if (nextMode) {
                    setIsExamRunning(true);
                    setExamSubmitted(false);
                    setExamSecondsLeft(3 * 3600);
                  } else {
                    setIsExamRunning(false);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  isExamMode
                    ? 'bg-amber-500 text-amber-950 font-bold border border-amber-400'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{isExamMode ? 'Quitter le Mode Examen' : 'Mode Examen Blanc Minuté (3h)'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isAr ? 'منصة النجاح والامتياز في الباكالوريا 2026–2027' : 'Révisez et Réussissez Votre Bac Informatique'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {isAr 
              ? 'فروض تأليفية، تمارين تطبيقية، امتحانات وطنية سابقة مع الإصلاح المفصل المعتمد خطوة بخطوة مع شروحات بالدارجة التونسية والمصطلحات التقنية الفرنسية.'
              : 'Épreuves officielles, séries d\'entraînement progressives, codes Python/SQL et corrigés détaillés avec explications accessibles et barème officiel.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Conforme au Programme Tunisien
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-200 font-medium">
              <Terminal className="w-3.5 h-3.5" /> Environnement Thonny & MariaDB
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-200 font-medium">
              <Award className="w-3.5 h-3.5" /> {publications.length} Ressources Homologuées
            </span>
          </div>
        </div>
      </div>

      {/* Exam Mode Interactive Status Bar (When Exam Mode is Active) */}
      {isExamMode && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${examSecondsLeft < 900 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-amber-950'}`}>
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Épreuve Blanche Sous Conditions d&apos;Examen (3h00)
                </span>
                {examSecondsLeft < 900 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" /> &lt; 15 min restantes !
                  </span>
                )}
              </div>
              <div className="text-2xl font-mono font-black text-amber-950 mt-0.5">
                {formatTimer(examSecondsLeft)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!examSubmitted ? (
              <>
                <button
                  onClick={() => setIsExamRunning(prev => !prev)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  {isExamRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isExamRunning ? 'Suspendre' : 'Reprendre'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsExamRunning(false);
                    setExamSubmitted(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Terminer & Révéler le Corrigé</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-emerald-600" /> Épreuve Terminée
                </span>
                <span className="text-sm px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono font-black">
                  Auto-Note : {totalSelfScore.toFixed(1)} / 20.0 pts
                </span>
                <button
                  onClick={() => {
                    setExamSecondsLeft(3 * 3600);
                    setExamSubmitted(false);
                    setIsExamRunning(true);
                    setSelfScores({});
                  }}
                  className="p-2 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors"
                  title="Recommencer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subject Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {BAC_SI_CURRICULUM.map(subj => {
          const isSelected = subj.id === selectedSubjectId;
          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                isSelected
                  ? 'bg-[#14243A] text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E5E9EF]'
              }`}
            >
              <span>{isAr ? subj.nameAr : subj.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F6F7F9] text-[#64748B]'}`}>
                Coeff {subj.coeff}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Subject Curriculum Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols): Chapters & Objectives of the subject */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="border-b border-[#E5E9EF] pb-3">
              <div className="text-[11px] font-semibold text-[#3478B8] uppercase tracking-wider">Programme Officiel</div>
              <h2 className="text-base font-bold text-[#14243A] mt-0.5">{isAr ? activeSubject.nameAr : activeSubject.name}</h2>
              <div className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
                <span>Coeff : {activeSubject.coeff}</span>
                <span>• {activeSubject.examType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-[#64748B] font-semibold block">Chapitres du Bac :</span>
              {activeSubject.chapters.map(ch => (
                <div key={ch.id} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] space-y-1">
                  <div className="text-xs font-bold text-[#14243A] flex items-center gap-1.5">
                    <span className="text-[#3478B8] font-mono text-[11px]">Ch {ch.number} :</span>
                    <span>{ch.title}</span>
                  </div>
                  {ch.titleAr && (
                    <div className="text-[11px] text-[#64748B] font-arabic">{ch.titleAr}</div>
                  )}
                  <div className="text-[10px] text-[#94A3B8] mt-1 pt-1 border-t border-[#E5E9EF]">
                    {ch.sections.length} section(s) • {ch.learningObjectives.length} objectif(s)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Derja Educational Tip */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A] space-y-2" dir="rtl">
            <div className="flex items-center gap-1.5 font-bold font-arabic text-[#14243A]">
              <Sparkles className="w-4 h-4 text-[#3478B8]" />
              <span>نصيحة المراجعة الذكية للباكالوريا :</span>
            </div>
            <p className="font-arabic leading-relaxed text-[#334155] text-xs">
              في مادة الخوارزميات (Algorithmique)، ركز جيدا على كتابة التمارين بطريقة معيارية (Modulaire) مع احترام الجدول TDO وتفادي المتغيرات العامة (Variables globales). كل تمرين يحتوي على الإصلاح المفصل وسلم التقييم (Barème).
            </p>
          </div>
        </div>

        {/* Right Column (8 cols): Published Exercises & Interactive Solutions */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث عن مسألة، دالة، تمرين، أو مفهوم...' : 'Rechercher un exercice, une fonction Python, une requête SQL...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-[#E5E9EF] focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] text-xs text-[#202B38] placeholder-[#94A3B8] focus:outline-none transition-colors shadow-xs"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#64748B] text-xs bg-white rounded-xl border border-[#E5E9EF]">
              Chargement des ressources homologuées...
            </div>
          ) : filteredPubs.length === 0 ? (
            <div className="p-8 rounded-xl bg-white border border-[#E5E9EF] text-center space-y-3 shadow-xs">
              <BookOpen className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <h3 className="text-sm font-bold text-[#14243A]">Aucune publication disponible</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
                Les documents révisés et formellement approuvés par l&apos;équipe pédagogique apparaîtront ici. Aucun brouillon non validé n&apos;est accessible aux apprenants.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPubs.map(pub => (
                <div key={pub.publicationId} className="p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E9EF] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#3478B8] font-semibold uppercase tracking-wider">
                          {pub.contentType} • Année {pub.content.academicYear}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> HOMOLOGUÉ OFFICIEL
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#14243A] mt-0.5">{pub.subject} — {pub.chapter}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-[#F6F7F9] border border-[#E5E9EF] text-[#475569] font-mono">
                        Durée : {pub.content.header.duration}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold">
                        {pub.content.totalPoints} / 20.0 pts
                      </span>
                    </div>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-5">
                    {pub.content.exercises.map(ex => {
                      const isRevealed = (revealedSolutions[ex.id] || (isExamMode && examSubmitted));
                      const isLockedByExam = isExamMode && !examSubmitted;

                      return (
                        <div key={ex.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E9EF] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#14243A]">Exercice {ex.number} : {ex.title}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setPlaygroundInitialCode(`# Code d'expérimentation pour : ${ex.title}\n\n`);
                                  setIsPlaygroundOpen(true);
                                }}
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[#3478B8] hover:bg-blue-50 font-medium transition-colors"
                                title="Tester du code Python pour cet exercice"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Tester en Python</span>
                              </button>
                              <span className="text-xs font-mono font-bold text-[#3478B8]">{ex.points} pts</span>
                            </div>
                          </div>

                          {/* Statement */}
                          <div className="p-3.5 rounded-lg bg-white border border-[#E5E9EF] leading-relaxed text-xs text-[#202B38]">
                            <MathMarkdownRenderer content={ex.statementMarkdown} />
                          </div>

                          {/* Student Answer Scratchpad (Active in Exam Mode) */}
                          {isExamMode && (
                            <div className="space-y-1.5 pt-1">
                              <label className="text-[11px] font-bold text-[#475569] flex items-center justify-between">
                                <span>Votre Réponse / Proposition d&apos;Algorithme :</span>
                                <span className="font-normal text-[#94A3B8]">Brouillon élève</span>
                              </label>
                              <textarea
                                value={studentAnswers[ex.id] || ''}
                                onChange={(e) => setStudentAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                disabled={examSubmitted}
                                rows={4}
                                placeholder="Rédigez ici votre réponse, algorithme en pseudocode officiel ou code Python..."
                                className="w-full p-3 rounded-lg border border-[#CBD5E1] bg-white font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] disabled:bg-slate-50 transition-colors shadow-2xs"
                              />
                            </div>
                          )}

                          {/* Toggle Solution Button */}
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              onClick={() => toggleSolution(ex.id)}
                              disabled={isLockedByExam}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                isLockedByExam
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : isRevealed
                                  ? 'bg-[#F6F7F9] text-[#475569] border border-[#E5E9EF]'
                                  : 'bg-white hover:bg-[#F8FAFC] text-[#3478B8] border border-blue-200'
                              }`}
                            >
                              {isLockedByExam ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Verrouillé pendant l&apos;examen (rendre d&apos;abord)</span>
                                </>
                              ) : isRevealed ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Masquer la Solution</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Afficher le Corrigé Détaillé</span>
                                </>
                              )}
                            </button>

                            <span className="text-[11px] text-[#64748B] font-mono">
                              {ex.gradingCriteria.length} critère(s) de notation
                            </span>
                          </div>

                          {/* Revealed Solution & Criteria */}
                          {isRevealed && (
                            <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] space-y-3 animate-fadeIn">
                              <div className="text-xs font-bold text-[#166534] flex items-center gap-1.5 border-b border-[#BBF7D0] pb-2">
                                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                                <span>Corrigé Officiel & Implémentation :</span>
                              </div>

                              <MathMarkdownRenderer content={ex.solutionMarkdown} />

                              {ex.gradingCriteria.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-[#BBF7D0] text-xs">
                                  <span className="text-[#166534] font-semibold block mb-1.5">Ventilation du Barème Officiel :</span>
                                  <div className="space-y-1">
                                    {ex.gradingCriteria.map(c => (
                                      <div key={c.id} className="flex items-center justify-between py-0.5 text-[#374151] text-[11px]">
                                        <span>• {c.description}</span>
                                        <span className="font-mono font-bold text-[#166534]">{c.points} pts</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Self-Assessment Scoring in Exam Mode */}
                              {isExamMode && examSubmitted && (
                                <div className="mt-3 pt-3 border-t border-[#BBF7D0] flex items-center justify-between bg-emerald-100/60 p-2.5 rounded-lg">
                                  <span className="text-xs font-bold text-emerald-900">
                                    Auto-évaluation de votre note (sur {ex.points} pts) :
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="0"
                                      max={ex.points}
                                      value={selfScores[ex.id] ?? ''}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        const clamped = isNaN(val) ? 0 : Math.min(ex.points, Math.max(0, val));
                                        setSelfScores(prev => ({ ...prev, [ex.id]: clamped }));
                                      }}
                                      className="w-16 px-2 py-1 rounded bg-white border border-emerald-300 font-mono font-bold text-xs text-center text-emerald-950 focus:outline-none"
                                      placeholder="0.0"
                                    />
                                    <span className="text-xs font-mono font-bold text-emerald-800">/ {ex.points}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Interactive Python Playground Modal */}
      <PythonPlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        initialCode={playgroundInitialCode}
      />

    </div>
  );
};
