'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight,
  AlertTriangle,
  History
} from 'lucide-react';
import { EducationalDraft, Language, ReviewRecord } from '@/lib/types';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';

interface ReviewViewProps {
  language: Language;
  onNavigateToExport: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ language, onNavigateToExport }) => {
  const isAr = language === 'ar';
  const [drafts, setDrafts] = useState<EducationalDraft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string>('');
  const [draft, setDraft] = useState<EducationalDraft | null>(null);
  const [reviewsHistory, setReviewsHistory] = useState<ReviewRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 10 Quality Assurance Checks
  const [checklist, setChecklist] = useState({
    curriculumRelevance: true,
    sourceAccuracy: true,
    mathematicalCorrectness: true,
    algorithmicCorrectness: true,
    codeCorrectness: true,
    languageQuality: true,
    educationalClarity: true,
    baremeConsistency: true,
    examinationFormatting: true,
    citationValidation: true
  });

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      if (data.success && Array.isArray(data.drafts) && data.drafts.length > 0) {
        setDrafts(data.drafts);
        const initial = data.drafts[0];
        setSelectedDraftId(initial.draftId);
        setDraft(initial);
      }
    } catch (err) {
      console.error('Error fetching drafts for review:', err);
    }
  }, []);

  const loadReviews = useCallback(async (draftId: string) => {
    try {
      const res = await fetch(`/api/reviews?draftId=${draftId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviewsHistory(data.reviews);
      }
    } catch (err) {
      console.warn('Could not load reviews history:', err);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  useEffect(() => {
    if (selectedDraftId) {
      loadReviews(selectedDraftId);
    }
  }, [selectedDraftId, loadReviews]);

  const handleSelectDraft = async (id: string) => {
    setSelectedDraftId(id);
    try {
      const res = await fetch(`/api/drafts/${id}`);
      const data = await res.json();
      if (data.success && data.draft) {
        setDraft(data.draft);
        setActionMessage(null);
        setErrorMessage(null);
      }
    } catch (err) {
      console.error('Error loading selected draft:', err);
    }
  };

  const handleApprove = async () => {
    if (!draft) return;
    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        draftId: draft.draftId,
        reviewer: 'Super Admin (Rayen)',
        status: 'APPROVED',
        checklist: {
          baremeValid: checklist.baremeConsistency,
          syntaxValid: checklist.codeCorrectness,
          curriculumCompliant: checklist.curriculumRelevance,
          noHallucination: checklist.sourceAccuracy
        },
        reviewerNotes: 'Brouillon vérifié conforme au programme officiel du Bac SI tunisien.'
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement de la validation.');
      }

      setDraft({ ...draft, status: 'APPROVED' });
      setActionMessage(`Brouillon ${draft.draftId} formellement APPROUVÉ et enregistré dans content/reviews/`);
      loadReviews(draft.draftId);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!draft) return;
    if (!rejectionReason.trim()) {
      setErrorMessage('Un motif de rejet explicite est obligatoire.');
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        draftId: draft.draftId,
        reviewer: 'Super Admin (Rayen)',
        status: 'REJECTED',
        checklist: {
          baremeValid: checklist.baremeConsistency,
          syntaxValid: checklist.codeCorrectness,
          curriculumCompliant: checklist.curriculumRelevance,
          noHallucination: checklist.sourceAccuracy
        },
        reviewerNotes: 'Brouillon rejeté pour non-conformité.',
        rejectionReason: rejectionReason.trim()
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement du rejet.');
      }

      setDraft({ ...draft, status: 'REJECTED' });
      setShowRejectModal(false);
      setActionMessage(`Brouillon ${draft.draftId} REJETÉ avec motif enregistré.`);
      loadReviews(draft.draftId);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const allChecksPassed = Object.values(checklist).every(Boolean);

  if (!draft) {
    return (
      <div className="p-12 text-center text-[#64748B] text-xs bg-white rounded-xl border border-[#E5E9EF]">
        Chargement des brouillons en attente de validation...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#14243A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#3478B8]" />
              {isAr ? 'مكتب التدقيق والمصادقة الإدارية الرسمية' : 'Bureau de Validation & Approbation Pédagogique'}
            </h1>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-semibold border ${
              draft.status === 'APPROVED' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : draft.status === 'REJECTED'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              Statut : {draft.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {isAr
              ? 'لا ينشر أي محتوى ولا يصدر نحو المنصة دون مصادقة صريحة من المشرف العام وفق معايير الجودة العشرة.'
              : 'Garantie de non-hallucination : Chaque exercice subit un contrôle humain avant autorisation d\'export.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {drafts.length > 1 && (
            <select
              value={selectedDraftId}
              onChange={(e) => handleSelectDraft(e.target.value)}
              aria-label="Sélectionner le brouillon à relire"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] shadow-xs"
            >
              {drafts.map(d => (
                <option key={d.draftId} value={d.draftId}>
                  {d.draftId} ({d.status}) — {d.chapter}
                </option>
              ))}
            </select>
          )}

          {draft.status === 'APPROVED' ? (
            <button
              onClick={onNavigateToExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Prêt pour l&apos;Exportation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-medium transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Rejeter</span>
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting || !allChecksPassed}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#14243A] hover:bg-[#203751] disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title={!allChecksPassed ? 'Tous les 10 critères doivent être cochés pour approuver' : ''}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Approuver le Brouillon</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Draft Exercises Inspection */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
            <div>
              <span className="text-[11px] text-[#3478B8] font-semibold uppercase tracking-wider block">Document Révisé</span>
              <h2 className="text-base font-bold text-[#14243A] mt-0.5">{draft.subject} — {draft.chapter}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#14243A]">Barème Total : {draft.totalPoints} pts</span>
              <span className="text-[10px] text-[#64748B] block font-mono">ID: {draft.draftId} (v{draft.version})</span>
            </div>
          </div>

          {/* List of Exercises */}
          <div className="space-y-4">
            {draft.exercises.map((ex) => (
              <div key={ex.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E9EF] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#14243A]">Exercice {ex.number} : {ex.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3478B8]">{ex.points} pts</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E5E9EF]">
                  <span className="text-[10px] text-[#3478B8] font-semibold uppercase block mb-1">Énoncé Pédagogique :</span>
                  <MathMarkdownRenderer content={ex.statementMarkdown} />
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E5E9EF]">
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase block mb-1">Corrigé Officiel & Code :</span>
                  <MathMarkdownRenderer content={ex.solutionMarkdown} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): 10 Quality Assurance Criteria Checklist */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
              <h3 className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3478B8]" />
                <span>Grille des 10 Critères QA</span>
              </h3>
              <span className="text-[10px] font-mono text-[#3478B8] font-bold">
                {Object.values(checklist).filter(Boolean).length} / 10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'curriculumRelevance', label: '1. Conformité au Programme Officiel SI' },
                { key: 'sourceAccuracy', label: '2. Traçabilité Source Fermée (Drive D: uniquement)' },
                { key: 'mathematicalCorrectness', label: '3. Rigueur Mathématique / KaTeX' },
                { key: 'algorithmicCorrectness', label: '4. Justesse Algorithmique' },
                { key: 'codeCorrectness', label: '5. Compatibilité Python (Thonny)' },
                { key: 'languageQuality', label: '6. Qualité de la Langue (Fr/Derja)' },
                { key: 'educationalClarity', label: '7. Clarté Pédagogique des Énoncés' },
                { key: 'baremeConsistency', label: '8. Cohérence du Barème (20/20)' },
                { key: 'examinationFormatting', label: '9. Présentation Conforme Bac' },
                { key: 'citationValidation', label: '10. Zéro Source Externe & Zéro Hallucination' }
              ].map(item => {
                const k = item.key as keyof typeof checklist;
                const checked = checklist[k];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(k)}
                    className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                      checked 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-[#F8FAFC] border-[#E5E9EF] text-[#64748B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${checked ? 'text-emerald-600' : 'text-[#CBD5E1]'}`} />
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-[#1E3A8A]">
              <span className="font-bold block mb-0.5">Règle de Sécurité Institutionnelle :</span>
              L&apos;approbation est un acte humain formel consigné avec horodatage cryptographique.
            </div>
          </div>

          {/* Historical Reviews Audits */}
          {reviewsHistory.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#3478B8]" />
                <span>Historique des Révisions</span>
              </div>
              <div className="space-y-2 text-xs">
                {reviewsHistory.map(r => (
                  <div key={r.reviewId} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#3478B8] font-medium">{r.reviewId}</span>
                      <span className={`font-semibold ${r.status === 'APPROVED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B]">{r.reviewer} • {new Date(r.timestamp).toLocaleDateString()}</div>
                    {r.rejectionReason && (
                      <div className="text-[10px] text-rose-700 italic pt-1 border-t border-[#E5E9EF]">
                        Motif : {r.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E9EF] rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-[#14243A] flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Motif Obligatoire de Rejet</span>
            </h3>
            <p className="text-xs text-[#475569]">
              Veuillez préciser la non-conformité pédagogique, mathématique ou syntaxique ayant motivé le rejet de ce brouillon.
            </p>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Exemple : Le barème de l'exercice 2 totalise 6.5 pts au lieu de 6.0 pts..."
              className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] font-mono"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#F6F7F9] text-[#475569] text-xs cursor-pointer hover:bg-[#EEF1F5]"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer disabled:opacity-40"
              >
                Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};