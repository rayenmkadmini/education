'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileEdit, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  X 
} from 'lucide-react';
import { EducationalDraft, ExerciseItem, Language } from '@/lib/types';
import { SAMPLE_DRAFT } from '@/lib/mockData';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';

interface EditorViewProps {
  language: Language;
  onNavigateToReview: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({ onNavigateToReview }) => {
  const [draftsList, setDraftsList] = useState<EducationalDraft[]>([]);
  const [draft, setDraft] = useState<EducationalDraft>(SAMPLE_DRAFT);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'STATEMENT' | 'SOLUTION' | 'PREVIEW' | 'CRITERIA'>('STATEMENT');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importTargetId, setImportTargetId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleOpenImportModal = () => {
    setImportTargetId(draft.draftId);
    setImportJsonText('');
    setImportError(null);
    setShowImportModal(true);
  };

  const handleExecuteImport = async () => {
    if (!importJsonText.trim()) {
      setImportError('Veuillez coller le JSON du brouillon.');
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);
      let parsed: Record<string, unknown> & { draftId?: string };
      try {
        parsed = JSON.parse(importJsonText.trim());
      } catch {
        throw new Error('Format JSON invalide. Vérifiez la syntaxe du document collé.');
      }

      const targetId = (importTargetId.trim() || parsed.draftId || draft.draftId).trim();
      parsed.draftId = targetId;

      const res = await fetch(`/api/drafts/${targetId}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'importation du brouillon.');
      }

      setDraft(data.draft);
      setActiveExerciseIdx(0);
      setShowImportModal(false);
      setSavedMessage(`Brouillon ${data.draft.draftId} (v${data.draft.version}) importé avec succès ! Copie de sauvegarde créée.`);
      setTimeout(() => setSavedMessage(null), 6000);
      loadDrafts();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Erreur d\'importation.');
    } finally {
      setIsImporting(false);
    }
  };

  // Load active drafts from /api/drafts on mount
  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      if (data.success && Array.isArray(data.drafts) && data.drafts.length > 0) {
        setDraftsList(data.drafts);
        setDraft(data.drafts[0]);
      }
    } catch (err) {
      console.warn('Could not load remote drafts, falling back to sample draft:', err);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const activeExercise: ExerciseItem = draft.exercises[activeExerciseIdx] || draft.exercises[0] || {
    id: 'ex-new',
    number: 1,
    title: 'Nouvel Exercice',
    points: 4.0,
    statementMarkdown: 'Énoncé de l\'exercice...',
    solutionMarkdown: '```python\n# Solution Python\n```',
    gradingCriteria: []
  };

  const totalCalculatedPoints = draft.exercises.reduce((sum, ex) => sum + (Number(ex.points) || 0), 0);
  const isBarèmeValid = Math.abs(totalCalculatedPoints - 20.0) < 0.01;

  const handleSelectDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/drafts/${draftId}`);
      const data = await res.json();
      if (data.success && data.draft) {
        setDraft(data.draft);
        setActiveExerciseIdx(0);
        setSavedMessage(null);
        setErrorMessage(null);
      }
    } catch (err) {
      console.error('Error fetching draft:', err);
    }
  };

  const handleUpdateActiveStatement = (newText: string) => {
    const updated = [...draft.exercises];
    updated[activeExerciseIdx] = {
      ...updated[activeExerciseIdx],
      statementMarkdown: newText
    };
    setDraft({ ...draft, exercises: updated });
  };

  const handleUpdateActiveSolution = (newText: string) => {
    const updated = [...draft.exercises];
    updated[activeExerciseIdx] = {
      ...updated[activeExerciseIdx],
      solutionMarkdown: newText
    };
    setDraft({ ...draft, exercises: updated });
  };

  const handleUpdateActivePoints = (pts: number) => {
    const updated = [...draft.exercises];
    updated[activeExerciseIdx] = {
      ...updated[activeExerciseIdx],
      points: pts
    };
    setDraft({ ...draft, exercises: updated });
  };

  const handleAddExercise = () => {
    const nextNumber = draft.exercises.length + 1;
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}`,
      number: nextNumber,
      title: `Exercice ${nextNumber} — Nouvelle question`,
      points: 4.0,
      statementMarkdown: `### Exercice ${nextNumber} (${4.0} points)\n\nÉcrire un algorithme modulaire en pseudocode conventionnel puis son implémentation en **Python 3**.`,
      solutionMarkdown: `\`\`\`python\ndef solution_ex_${nextNumber}():\n    pass\n\`\`\``,
      gradingCriteria: [
        { id: `crit-${Date.now()}-1`, description: 'Conformité de l\'algorithme', points: 2.0 },
        { id: `crit-${Date.now()}-2`, description: 'Syntaxe et exécution Python', points: 2.0 }
      ]
    };
    const updated = [...draft.exercises, newEx];
    setDraft({ ...draft, exercises: updated });
    setActiveExerciseIdx(updated.length - 1);
  };

  const handleDeleteExercise = (idx: number) => {
    if (draft.exercises.length <= 1) return;
    const updated = draft.exercises.filter((_, i) => i !== idx);
    updated.forEach((ex, i) => { ex.number = i + 1; });
    setDraft({ ...draft, exercises: updated });
    setActiveExerciseIdx(Math.max(0, idx - 1));
  };

  const handleMoveExercise = (idx: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && idx === 0) return;
    if (direction === 'DOWN' && idx === draft.exercises.length - 1) return;
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    const updated = [...draft.exercises];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((ex, i) => { ex.number = i + 1; });
    setDraft({ ...draft, exercises: updated });
    setActiveExerciseIdx(targetIdx);
  };

  const insertFormula = (formula: string) => {
    handleUpdateActiveStatement(activeExercise.statementMarkdown + ` ${formula} `);
  };

  // Real persistence to /api/drafts/[id]
  const handleSave = async () => {
    setIsSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/drafts/${draft.draftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde du brouillon.');
      }
      setDraft(data.draft);
      setSavedMessage(`Brouillon v${data.draft.version} sauvegardé ! Copie de sauvegarde créée dans content/drafts/backups/`);
      setTimeout(() => setSavedMessage(null), 5000);
      loadDrafts();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur de sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#14243A] flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-[#3478B8]" />
              {draft.subject} — {draft.chapter}
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono font-semibold">
              BROUILLON ACTIF v{draft.version}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${
              isBarèmeValid 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              Barème : {totalCalculatedPoints.toFixed(1)} / 20.0 pts
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Durée : {draft.header.duration} • Coefficient : {draft.header.coefficient} • {draft.exercises.length} Exercice(s)
          </p>
        </div>

        {/* Draft Selection & Save Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {draftsList.length > 1 && (
            <select
              value={draft.draftId}
              onChange={(e) => handleSelectDraft(e.target.value)}
              aria-label="Sélectionner un brouillon"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] shadow-xs"
            >
              {draftsList.map(d => (
                <option key={d.draftId} value={d.draftId}>
                  {d.draftId} (v{d.version}) — {d.chapter}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-xs text-[#202B38] font-medium transition-colors cursor-pointer"
            title="Importer un brouillon JSON généré par Antigravity"
          >
            <Upload className="w-3.5 h-3.5 text-[#3478B8]" />
            <span>Importer JSON</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-xs text-[#14243A] font-semibold transition-colors cursor-pointer"
          >
            <Save className={`w-3.5 h-3.5 text-[#3478B8] ${isSaving ? 'animate-spin' : ''}`} />
            <span>Sauvegarder</span>
          </button>

          <button
            onClick={onNavigateToReview}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14243A] hover:bg-[#203751] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span>Passer à la Relecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main 3-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 cols): Exercise List & Reordering */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#14243A] uppercase tracking-wider px-1">
            <span>Structure de l&apos;Épreuve</span>
            <span className="text-[#3478B8] font-mono">{draft.exercises.length} Exos</span>
          </div>

          <div className="space-y-2">
            {draft.exercises.map((ex, idx) => {
              const isActive = idx === activeExerciseIdx;
              return (
                <div
                  key={ex.id}
                  onClick={() => setActiveExerciseIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                    isActive
                      ? 'bg-[#F1F5F9] border-[#3478B8] text-[#14243A]'
                      : 'bg-white border-[#E5E9EF] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#14243A]">Exercice {ex.number}</span>
                    <span className="text-xs font-mono font-bold text-[#3478B8]">{ex.points} pts</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate mt-1">{ex.title}</div>

                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#E5E9EF]">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveExercise(idx, 'UP'); }}
                      disabled={idx === 0}
                      className="p-1 rounded bg-[#F6F7F9] hover:bg-[#EEF1F5] text-[#475569] disabled:opacity-30 cursor-pointer"
                      title="Monter"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveExercise(idx, 'DOWN'); }}
                      disabled={idx === draft.exercises.length - 1}
                      className="p-1 rounded bg-[#F6F7F9] hover:bg-[#EEF1F5] text-[#475569] disabled:opacity-30 cursor-pointer"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteExercise(idx); }}
                      disabled={draft.exercises.length <= 1}
                      className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-30 cursor-pointer ml-1"
                      title="Supprimer cet exercice"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-[#94A3B8] ml-auto font-mono">#{idx + 1}</span>
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleAddExercise}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#3478B8] bg-white text-[#475569] hover:text-[#14243A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Exercice</span>
            </button>
          </div>
        </div>

        {/* Center Column (6 cols): WYSIWYG & Code Editor */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Quick Formula Toolbar */}
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E9EF] shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] text-[#64748B] font-semibold px-2 shrink-0">Math/LaTeX :</span>
            {[
              { label: 'U_n', val: '$U_n$' },
              { label: 'Frac', val: '$\\frac{a}{b}$' },
              { label: 'Somme', val: '$\\sum_{i=1}^n$' },
              { label: 'Intégrale', val: '$\\int_a^b$' },
              { label: 'Racine', val: '$\\sqrt{x}$' },
              { label: 'in N', val: '$n \\in \\mathbb{N}$' },
              { label: '<=', val: '$\\le$' },
              { label: 'O(n)', val: '$\\mathcal{O}(n)$' }
            ].map((f, i) => (
              <button
                key={i}
                onClick={() => insertFormula(f.val)}
                className="px-2 py-1 rounded bg-[#F6F7F9] hover:bg-[#EEF1F5] text-[#334155] border border-[#E5E9EF] text-[11px] font-mono cursor-pointer shrink-0 font-medium"
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tab Switcher: Statement / Solution / Preview / Criteria */}
          <div className="p-1 rounded-xl bg-white border border-[#E5E9EF] shadow-xs flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('STATEMENT')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'STATEMENT' ? 'bg-[#14243A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              Énoncé de l&apos;Exercice
            </button>
            <button
              onClick={() => setActiveTab('SOLUTION')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'SOLUTION' ? 'bg-[#14243A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              Solution & Code Python
            </button>
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'PREVIEW' ? 'bg-[#14243A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu KaTeX</span>
            </button>
            <button
              onClick={() => setActiveTab('CRITERIA')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'CRITERIA' ? 'bg-[#14243A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              Barème & Critères
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#14243A]">
                Exercice {activeExercise.number} : {activeExercise.title}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#64748B]">Points :</span>
                <input
                  type="number"
                  step="0.5"
                  value={activeExercise.points}
                  onChange={(e) => handleUpdateActivePoints(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-0.5 rounded bg-white border border-[#E5E9EF] text-xs font-mono font-bold text-[#3478B8] text-center focus:outline-none focus:border-[#3478B8]"
                />
              </div>
            </div>

            {activeTab === 'STATEMENT' && (
              <div className="space-y-2">
                <textarea
                  rows={14}
                  value={activeExercise.statementMarkdown}
                  onChange={(e) => handleUpdateActiveStatement(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] focus:bg-white focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] text-xs font-mono text-[#1E293B] leading-relaxed focus:outline-none transition-colors"
                />
                <div className="text-[11px] text-[#64748B] flex items-center justify-between">
                  <span>Supporte les formules LaTeX ($\dots$), le code Markdown, et les énoncés en Français/Derja.</span>
                  <span>{activeExercise.statementMarkdown.length} caractères</span>
                </div>
              </div>
            )}

            {activeTab === 'SOLUTION' && (
              <div className="space-y-2">
                <textarea
                  rows={14}
                  value={activeExercise.solutionMarkdown}
                  onChange={(e) => handleUpdateActiveSolution(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] focus:bg-white focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] text-xs font-mono text-[#0F766E] leading-relaxed focus:outline-none transition-colors font-semibold"
                />
                <div className="text-[11px] text-[#64748B] flex items-center justify-between">
                  <span>Code Python / SQL certifié conforme environnement d&apos;examen Baccalauréat.</span>
                  <span>{activeExercise.solutionMarkdown.length} caractères</span>
                </div>
              </div>
            )}

            {activeTab === 'PREVIEW' && (
              <div className="space-y-3 p-4 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] max-h-[400px] overflow-y-auto">
                <div className="text-xs font-bold text-[#14243A] border-b border-[#E5E9EF] pb-2">
                  Aperçu de l&apos;Énoncé avec KaTeX :
                </div>
                <MathMarkdownRenderer content={activeExercise.statementMarkdown} />
                <div className="text-xs font-bold text-[#14243A] border-b border-[#E5E9EF] pt-4 pb-2">
                  Aperçu de la Solution :
                </div>
                <MathMarkdownRenderer content={activeExercise.solutionMarkdown} />
              </div>
            )}

            {activeTab === 'CRITERIA' && (
              <div className="space-y-2 text-xs">
                <div className="text-[#64748B] text-[11px]">Critères de notation spécifiques à l&apos;exercice :</div>
                {activeExercise.gradingCriteria.map((c, i) => (
                  <div key={c.id || i} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] flex items-center justify-between gap-2">
                    <span className="text-[#334155]">{c.description}</span>
                    <span className="font-mono font-bold text-[#3478B8] shrink-0">{c.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (3 cols): Document Provenance & Barème Audit */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Barème Card */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#3478B8]" />
                <span>Contrôle Barème</span>
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                isBarèmeValid ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
              }`}>
                {totalCalculatedPoints.toFixed(1)} / 20.0
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {draft.exercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between text-[#64748B] text-[11px]">
                  <span>Ex {ex.number} :</span>
                  <span className="font-mono font-medium text-[#14243A]">{ex.points} pts</span>
                </div>
              ))}
            </div>

            {!isBarèmeValid && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>Attention : Le total du barème doit être exactement de 20.0 points pour être conforme aux épreuves officielles.</span>
              </div>
            )}
          </div>

          {/* Sources Cited */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sources Authentiques Citées</span>
            </div>

            <div className="space-y-2 text-xs">
              {draft.provenance.sourcesCited.map((src, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] space-y-1">
                  <div className="font-semibold text-[#14243A] break-all text-[11px]">{src.document}</div>
                  <div className="text-[10px] text-[#64748B]">
                    {src.page ? `Page ${src.page}` : ''} {src.section ? `• ${src.section}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Import Draft JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E9EF] rounded-xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#E5E9EF] flex items-center justify-between bg-[#F6F7F9]">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#3478B8]" />
                <h3 className="text-sm font-bold text-[#14243A]">Importer un Brouillon JSON (Antigravity)</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-[#64748B] hover:text-[#14243A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <p className="text-xs text-[#475569]">
                Collez ci-dessous le document JSON complet généré par Antigravity. Le système validera sa structure (matière, chapitres, exercices, barème sur 20.0 pts) et archivera automatiquement la version précédente dans <code>content/drafts/backups/</code>.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Identifiant Cible (Draft ID) :
                </label>
                <input
                  type="text"
                  value={importTargetId}
                  onChange={(e) => setImportTargetId(e.target.value)}
                  placeholder="ex: DRAFT-COURS-BACSI-2026-409671"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-xs font-mono text-[#202B38] focus:outline-none focus:border-[#3478B8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Contenu JSON du Brouillon :
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  rows={14}
                  placeholder={`{\n  "draftId": "DRAFT-COURS-BACSI-2026-409671",\n  "subject": "Algorithmique et Programmation",\n  "chapter": "...",\n  "exercises": [...]\n}`}
                  className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] text-xs font-mono text-[#0F766E] focus:outline-none focus:border-[#3478B8]"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E5E9EF] flex items-center justify-end gap-2 bg-[#F6F7F9]">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E9EF] text-xs text-[#475569] hover:bg-white transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={isImporting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#14243A] hover:bg-[#203751] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Importation en cours...' : 'Valider & Importer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};