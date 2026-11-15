'use client';

import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { Language, StudioTab } from '@/lib/types';

interface DashboardViewProps {
  onNavigate: (tab: StudioTab) => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, language }) => {
  const isAr = language === 'ar';

  const [knowledgeCount, setKnowledgeCount] = useState<number | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const [pubCount, setPubCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [tasksRes, draftsRes, pubsRes, knowRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/drafts'),
        fetch('/api/publications'),
        fetch('/api/knowledge')
      ]);

      if (knowRes.ok) {
        const data = await knowRes.json();
        setKnowledgeCount(data.catalog?.totalDocuments ?? 71);
      }
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTaskCount(data.count ?? 0);
      }
      if (draftsRes.ok) {
        const data = await draftsRes.json();
        setDraftCount(data.count ?? 0);
      }
      if (pubsRes.ok) {
        const data = await pubsRes.json();
        setPubCount(data.count ?? 0);
      }
    } catch {
      setKnowledgeCount(71);
      setTaskCount(0);
      setDraftCount(0);
      setPubCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    {
      title: { fr: 'Documents Sources Indexés', ar: 'المراجع والمصادر المفهرسة', en: 'Indexed Source Documents' },
      value: loading ? '...' : `${knowledgeCount ?? 71}`,
      desc: { fr: 'Répertoire D: protégé (SHA-256)', ar: 'المجلد الأصلي محمي مع SHA-256', en: 'Drive D: protected (SHA-256)' },
      icon: <BookOpen className="w-5 h-5 text-[#3478B8]" />,
      tag: { fr: 'Lecture Seule', ar: 'قراءة فقط', en: 'Read-Only' },
      tagColor: 'bg-blue-50 text-[#3478B8] border-blue-200'
    },
    {
      title: { fr: 'Matières du Bac SI', ar: 'المواد الرسمية لباكالوريا إعلامية', en: 'Bac SI Subjects' },
      value: '8 + Option',
      desc: { fr: 'Algo, STI, Maths, Physique...', ar: 'الخوارزميات، STI، الرياضيات، الفيزياء...', en: 'Algo, STI, Maths, Physics...' },
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      tag: { fr: 'Session 2026–2027', ar: 'برنامج 2026-2027', en: 'Session 2026–2027' },
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: { fr: 'Tâches en Attente', ar: 'المهام البيداغوجية بالانتظار', en: 'Pending Tasks' },
      value: loading ? '...' : `${taskCount ?? 0}`,
      desc: { fr: 'Fichiers JSON sous tasks/pending/', ar: 'ملفات المهام تحت tasks/pending/', en: 'JSON files in tasks/pending/' },
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      tag: { fr: 'Contrat Antigravity', ar: 'عقد مهام', en: 'Contract File' },
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: { fr: 'Brouillons & Validations', ar: 'المسودات والمصادقات', en: 'Drafts & Validations' },
      value: loading ? '...' : `${draftCount ?? 0} / ${pubCount ?? 0}`,
      desc: { fr: 'Persistance atomique locale', ar: 'حفظ محلي آمن للملفات', en: 'Local atomic persistence' },
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      tag: { fr: 'Qualité Homologuée', ar: 'جودة معتمدة', en: 'Certified Quality' },
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner - Editorial Education Card */}
      <div className="p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#3478B8] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? 'استوديو إنتاج المحتوى التعليمي الرسمي' : 'Studio de Création Pédagogique Assisté par Antigravity'}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] tracking-tight">
            {isAr ? 'مرحبا بك في استوديو BAC AI TUNISIA' : 'Bienvenue dans le Studio Pédagogique BAC AI Tunisia'}
          </h1>
          
          <p className="mt-2 text-sm text-[#475569] leading-relaxed">
            {isAr 
              ? 'بيئة العمل المتقدمة لإنتاج الدروس، السلاسل والفروض التأليفية استناداً إلى المراجع التونسية المعتمدة لباكالوريا 2026-2027 مع الحفظ المحلي الآمن.'
              : 'Générez des tâches contractuelles, importez vos brouillons Antigravity et préparez des épreuves conformes au programme officiel tunisien 2026–2027 avec persistance réelle sur Disque D:.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('generator')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14243A] hover:bg-[#203751] text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              {isAr ? 'إنشاء مهمة جديدة' : 'Créer une Tâche'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => onNavigate('editor')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] font-medium text-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#3478B8]" />
              {isAr ? 'فتح استوديو التحرير' : 'Ouvrir l\'Éditeur de Brouillons'}
            </button>

            <button
              onClick={fetchStats}
              title={isAr ? 'تحديث الإحصائيات' : 'Rafraîchir les compteurs réels'}
              className="p-2 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#64748B] hover:text-[#202B38] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white border border-[#E5E9EF] hover:border-[#CBD5E1] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
                {s.icon}
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${s.tagColor}`}>
                {s.tag[language]}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#14243A] tracking-tight">{s.value}</div>
            <div className="text-xs font-semibold text-[#202B38] mt-1">{s.title[language]}</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{s.desc[language]}</div>
          </div>
        ))}
      </div>

      {/* Workflow & Safety Assurance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Step-by-Step Task Pipeline Card */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
            <h2 className="text-sm font-bold text-[#14243A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3478B8]" />
              {isAr ? 'مسار العمل الفعلي (Studio -> Antigravity -> Relecture)' : 'Cycle de Production Persistant Validé'}
            </h2>
            <span className="text-[11px] text-[#3478B8] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
              Persistance Atomique Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
              <span className="font-bold text-[#14243A] block mb-1">1. Tâche Contractuelle</span>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Écriture atomique JSON dans <code className="text-[#3478B8] font-semibold">content/tasks/pending/</code> avec ID format BACSI-2026.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
              <span className="font-bold text-[#14243A] block mb-1">2. Exécution Antigravity</span>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                L&apos;agent lit la tâche et les sources fermées en lecture seule pour générer le brouillon structuré.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
              <span className="font-bold text-[#14243A] block mb-1">3. Édition & Sauvegarde</span>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Sauvegarde atomique dans <code className="text-[#3478B8] font-semibold">content/drafts/active/</code> avec backup automatique horodaté.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
              <span className="font-bold text-[#14243A] block mb-1">4. Relecture & Publication</span>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Contrôle qualité formel, signature d&apos;approbation et export verrouillé dans <code className="text-[#3478B8] font-semibold">content/published/</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Strict Isolation Card */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E5E9EF] pb-3">
            <FolderLock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#14243A]">
              {isAr ? 'ضمانات الأمان والأصالة' : 'Garanties d\'Intégrité et Sécurité'}
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs text-[#475569]">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fichiers sources intacts :</strong> Accès 100% en lecture seule sur <code className="text-[#14243A] bg-[#F6F7F9] px-1 py-0.5 rounded border border-[#E5E9EF]">bac info cours exam resourse</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Protection anti-traversal :</strong> Rejet strict de toute tentative d&apos;évasion de chemin.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Contrôle Git exclusif :</strong> Aucun commit ou push automatique sans validation explicite.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Cloisonnement Étudiant :</strong> Aucune fuite de brouillon vers l&apos;espace apprenant.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};