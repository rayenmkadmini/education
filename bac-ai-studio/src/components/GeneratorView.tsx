'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  FileCode, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { ContentType, GenerationMode, Language, DocumentRecord } from '@/lib/types';
import { BAC_SI_CURRICULUM } from '@/lib/curriculum-data';

interface GeneratorViewProps {
  language: Language;
  onNavigateToDraft: () => void;
}

type DifficultyLevel = 'APPLICATION_DIRECTE' | 'INTERMEDIAIRE' | 'BAC_OFFICIEL' | 'DEFI';

export const GeneratorView: React.FC<GeneratorViewProps> = ({ language, onNavigateToDraft }) => {
  const isAr = language === 'ar';

  const [availableDocs, setAvailableDocs] = useState<DocumentRecord[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(BAC_SI_CURRICULUM[0].id);
  const [selectedChapter, setSelectedChapter] = useState(BAC_SI_CURRICULUM[0].chapters[0].title);
  const [contentType, setContentType] = useState<ContentType>('DEVOIR_DE_CONTROLE');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('STRICT_SOURCE_GROUNDED');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('BAC_OFFICIEL');
  const [duration, setDuration] = useState('120');
  const [totalPoints, setTotalPoints] = useState('20.0');
  const [instructions, setInstructions] = useState('Concevoir des exercices conformes aux exigences du Baccalauréat tunisien (session 2026-2027). Code Python 3 compatible environnement Thonny, avec barème détaillé.');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTaskId, setGeneratedTaskId] = useState<string | null>(null);
  const [promptMarkdown, setPromptMarkdown] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load authentic catalog documents
  useEffect(() => {
    fetch('/api/knowledge')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.catalog?.documents) {
          setAvailableDocs(data.catalog.documents);
          // Preselect official documents
          const defaults = data.catalog.documents
            .filter((d: DocumentRecord) => d.classification === 'OFFICIAL_EXAM' || d.classification === 'OFFICIAL_TEXTBOOK')
            .slice(0, 3)
            .map((d: DocumentRecord) => d.filename);
          setSelectedSources(defaults);
        }
      })
      .catch(err => console.warn('Could not load knowledge catalog for generator:', err));
  }, []);

  const currentSubjectObj = useMemo(() => {
    return BAC_SI_CURRICULUM.find(s => s.id === selectedSubject) || BAC_SI_CURRICULUM[0];
  }, [selectedSubject]);

  const handleCreateTask = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        contentType,
        subject: currentSubjectObj.name,
        chapter: selectedChapter,
        academicYear: '2026-2027',
        level: '4ème Année Secondaire — Sciences de l\'Informatique',
        durationMinutes: parseInt(duration, 10) || 120,
        totalPoints: parseFloat(totalPoints) || 20.0,
        difficulty,
        language: 'fr_tn_derja',
        generationMode,
        sourceReferences: selectedSources.map(s => ({ fileName: s })),
        instructions
      };

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création de la tâche.');
      }

      setGeneratedTaskId(data.task.taskId);
      setPromptMarkdown(data.promptMarkdown);
      setSuccessMsg(`Tâche ${data.task.taskId} enregistrée avec succès dans content/tasks/pending/${data.task.taskId}.json`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!promptMarkdown) return;
    navigator.clipboard.writeText(promptMarkdown);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const toggleSource = (filename: string) => {
    if (selectedSources.includes(filename)) {
      setSelectedSources(selectedSources.filter(s => s !== filename));
    } else {
      setSelectedSources([...selectedSources, filename]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#14243A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3478B8]" />
              {isAr ? 'مركز توليد المهام البيداغوجية الموثقة' : 'Générateur de Tâches Pédagogiques Réelles'}
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#3478B8] font-semibold font-mono">
              Persistance content/tasks/pending/
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {isAr
              ? 'حدد المادة والفصل ومراجعك الموثقة، ثم اضغط لحفظ ملف المهمة على القرص وتوليد التعليمة الموجهة لمساعد Antigravity.'
              : 'Enregistre un fichier tâche JSON valide sur disque et génère la consigne contractuelle pour l\'agent Antigravity.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF] text-xs text-[#475569]">
          <ShieldAlert className="w-4 h-4 text-[#3478B8]" />
          <span>Écriture Atomique Sécurisée • Zéro Coût API</span>
        </div>
      </div>

      {/* Strict Closed Knowledge Policy Banner */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#3478B8] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-[#14243A] flex items-center gap-2">
            <span>Règle Permanente : Base de Connaissances Strictement Fermée</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono">
              Source Unique : Drive D: ({availableDocs.length} documents)
            </span>
          </div>
          <p className="text-[#334155] leading-relaxed text-[11px]">
            L&apos;IA est strictement restreinte aux fichiers internes de <code className="text-[#14243A] bg-white px-1 py-0.5 rounded border border-blue-200 font-mono">bac info cours exam resourse</code>. Web, Wikipédia, APIs externes et suppositions sans preuve sont interdits. Si une information fait défaut dans les sources, le système renvoie obligatoirement <code className="text-amber-800 font-mono">INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE</code>.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-mono">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Configuration */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
            1. Paramètres de l&apos;Épreuve ou du Cours
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Subject Selector */}
            <div>
              <label className="text-xs text-[#475569] block mb-1 font-medium">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const subj = BAC_SI_CURRICULUM.find(s => s.id === e.target.value);
                  if (subj) {
                    setSelectedChapter(subj.chapters[0].title);
                    setDuration(subj.durationMinutes.toString());
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] transition-colors shadow-xs"
              >
                {BAC_SI_CURRICULUM.map(s => (
                  <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.name}</option>
                ))}
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="text-xs text-[#475569] block mb-1 font-medium">Type de Contenu</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] transition-colors shadow-xs"
              >
                <option value="DEVOIR_DE_CONTROLE">Devoir de Contrôle (Écrit)</option>
                <option value="DEVOIR_DE_SYNTHESE">Devoir de Synthèse</option>
                <option value="EPREUVE_PRATIQUE">Épreuve Pratique (Algo/STI)</option>
                <option value="SERIE_EXERCICES">Série d&apos;exercices progressive</option>
                <option value="COURS">Cours structuré complet</option>
                <option value="EXAMEN_BLANC">Examen Blanc Type Bac</option>
                <option value="CORRIGE_DETAILLE">Corrigé Détaillé avec Barème</option>
                <option value="FICHE_REVISION">Fiche de Révision & Formules</option>
              </select>
            </div>

          </div>

          {/* Chapter Selector */}
          <div>
            <label className="text-xs text-[#475569] block mb-1 font-medium">Chapitre / Compétence Homologuée</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] transition-colors shadow-xs"
            >
              {currentSubjectObj.chapters.map((ch) => (
                <option key={ch.id} value={ch.title}>
                  Chapitre {ch.number} : {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Mode, Difficulty, Duration & Points */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-[#475569] block mb-1">Mode d&apos;Ancrage</label>
              <select
                value={generationMode}
                onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-[11px] text-[#202B38] focus:outline-none focus:border-[#3478B8]"
              >
                <option value="STRICT_SOURCE_GROUNDED">Strictement Ancré</option>
                <option value="SOURCE_WITH_PEDAGOGICAL_EXPANSION">Ancré + Synthèse</option>
                <option value="PRACTICE_SYNTHESIS">Épreuve Pratique</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">Difficulté</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-[11px] text-[#202B38] focus:outline-none focus:border-[#3478B8]"
              >
                <option value="APPLICATION_DIRECTE">Application Directe</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="BAC_OFFICIEL">Bac Officiel (Examen)</option>
                <option value="DEFI">Défi / Approfondissement</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">Durée (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-[11px] text-[#202B38] focus:outline-none text-center font-mono focus:border-[#3478B8]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#475569] block mb-1">Barème Total</label>
              <input
                type="number"
                step="0.5"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-[11px] text-[#14243A] font-mono font-bold focus:outline-none text-center focus:border-[#3478B8]"
              />
            </div>
          </div>

          {/* Specific Pedagogical Instructions */}
          <div>
            <label className="text-xs text-[#475569] block mb-1 font-medium">Consignes Pédagogiques Spécifiques</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] leading-relaxed font-mono shadow-xs"
            />
          </div>

          {/* Sources Selection */}
          <div>
            <label className="text-xs text-[#475569] block mb-1 font-medium flex items-center justify-between">
              <span>2. Sélectionner les Documents Sources à Citer ({selectedSources.length} sélectionnés)</span>
              <span className="text-[10px] text-[#3478B8] font-normal">Répertoire D:\... ({availableDocs.length} fichiers)</span>
            </label>
            
            <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF]">
              {availableDocs.map((doc) => {
                const isChecked = selectedSources.includes(doc.filename);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleSource(doc.filename)}
                    className={`px-3 py-1.5 rounded-md text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked ? 'bg-blue-50 text-[#14243A] border border-blue-200 font-medium' : 'text-[#475569] hover:bg-white'
                    }`}
                  >
                    <span className="truncate pr-2">{doc.filename}</span>
                    <span className="text-[10px] shrink-0 font-mono text-[#64748B]">{doc.classification}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleCreateTask}
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[#14243A] hover:bg-[#203751] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{isSubmitting ? 'Enregistrement de la Tâche...' : 'Créer & Enregistrer la Tâche Antigravity'}</span>
            </button>
          </div>
        </div>

        {/* Right Output: Antigravity Markdown Prompt & Contract */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#3478B8]" />
              <h2 className="text-xs font-bold text-[#14243A] uppercase tracking-wider">
                Consigne Contractuelle Antigravity
              </h2>
            </div>
            {generatedTaskId && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#3478B8] border border-blue-200 font-mono font-semibold">
                {generatedTaskId}
              </span>
            )}
          </div>

          {promptMarkdown ? (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">Copiez ce prompt dans l&apos;agent Antigravity :</span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-xs text-[#202B38] font-medium transition-colors cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#3478B8]" />}
                  <span>{copiedPrompt ? 'Copié dans le Presse-Papier !' : 'Copier le Prompt'}</span>
                </button>
              </div>

              <textarea
                rows={16}
                readOnly
                value={promptMarkdown}
                className="w-full flex-1 p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] text-[11px] font-mono text-[#334155] leading-relaxed select-all focus:outline-none"
              />

              <div className="pt-2">
                <button
                  onClick={onNavigateToDraft}
                  className="w-full py-2.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-xs text-[#14243A] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Passer à l&apos;Éditeur de Brouillons</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3478B8]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 text-[#64748B]">
              <BookOpen className="w-8 h-8 text-[#94A3B8]" />
              <p className="text-xs leading-relaxed max-w-xs">
                Configurez les paramètres de l&apos;épreuve à gauche puis cliquez sur <strong>Créer la Tâche</strong> pour générer le fichier JSON sur disque et le prompt contractuel.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};