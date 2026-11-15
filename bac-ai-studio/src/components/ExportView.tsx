'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  FileText, 
  FolderCheck,
  AlertTriangle,
  Lock,
  FileCode
} from 'lucide-react';
import { EducationalDraft, Language, PublicationRecord } from '@/lib/types';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';

interface ExportViewProps {
  language: Language;
}

export const ExportView: React.FC<ExportViewProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [drafts, setDrafts] = useState<EducationalDraft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string>('');
  const [draft, setDraft] = useState<EducationalDraft | null>(null);
  const [publications, setPublications] = useState<PublicationRecord[]>([]);
  const [exportMode, setExportMode] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      if (data.success && Array.isArray(data.drafts) && data.drafts.length > 0) {
        setDrafts(data.drafts);
        const approved = data.drafts.find((d: EducationalDraft) => d.status === 'APPROVED' || d.status === 'EXPORTED') || data.drafts[0];
        setSelectedDraftId(approved.draftId);
        setDraft(approved);
      }
    } catch (err) {
      console.warn('Could not load drafts for export view:', err);
    }
  }, []);

  const loadPublications = useCallback(async () => {
    try {
      const res = await fetch('/api/publications');
      const data = await res.json();
      if (data.success && Array.isArray(data.publications)) {
        setPublications(data.publications);
      }
    } catch (err) {
      console.warn('Could not load publications:', err);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
    loadPublications();
  }, [loadDrafts, loadPublications]);

  const handleSelectDraft = async (id: string) => {
    setSelectedDraftId(id);
    try {
      const res = await fetch(`/api/drafts/${id}`);
      const data = await res.json();
      if (data.success && data.draft) {
        setDraft(data.draft);
        setPublishMessage(null);
        setErrorMessage(null);
      }
    } catch (err) {
      console.error('Error fetching draft:', err);
    }
  };

  const handlePublishToDisk = async () => {
    if (!draft) return;
    setIsPublishing(true);
    setPublishMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId: draft.draftId, publisher: 'Super Admin (Rayen)' })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la publication.');
      }

      setDraft({ ...draft, status: 'EXPORTED' });
      setPublishMessage(`Publication ${data.publication.publicationId} enregistrée avec succès dans content/published/`);
      loadPublications();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Échec de publication.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadJson = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.draftId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    if (!draft) return;
    let md = `# RÉPUBLIQUE TUNISIENNE — MINISTÈRE DE L'ÉDUCATION\n`;
    md += `## BACCALAURÉAT — SCIENCES DE L'INFORMATIQUE (${draft.academicYear})\n`;
    md += `**Matière :** ${draft.subject} | **Chapitre :** ${draft.chapter}\n`;
    md += `**Durée :** ${draft.header.duration} | **Coefficient :** ${draft.header.coefficient} | **Barème :** ${draft.totalPoints} pts\n\n---\n\n`;

    draft.exercises.forEach(ex => {
      md += `### Exercice ${ex.number} : ${ex.title} (${ex.points} points)\n\n`;
      md += `${ex.statementMarkdown}\n\n`;
      if (exportMode === 'TEACHER') {
        md += `#### Corrigé Officiel :\n\n${ex.solutionMarkdown}\n\n`;
        if (ex.gradingCriteria.length > 0) {
          md += `**Barème de correction détaillé :**\n`;
          ex.gradingCriteria.forEach(c => {
            md += `- ${c.description} : ${c.points} pts\n`;
          });
          md += `\n`;
        }
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.draftId}-${exportMode.toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isApproved = draft?.status === 'APPROVED' || draft?.status === 'EXPORTED';

  if (!draft) {
    return (
      <div className="p-12 text-center text-[#64748B] text-xs bg-white rounded-xl border border-[#E5E9EF]">
        Chargement des documents prêts à l&apos;exportation...
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
              <Download className="w-5 h-5 text-[#3478B8]" />
              {isAr ? 'مركز تصدير الوثائق والمحتوى المعتمد' : 'Centre d\'Exportation et Publication Officielle'}
            </h1>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-semibold border ${
              isApproved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {draft.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {isAr
              ? 'تصدير الوثيقة بتنسيق رسمي قابل للطباعة، أو حفظها مباشرة داخل مجلد النشر المخصص content/published/.'
              : 'Exportez au format Baccalauréat officiel prêt à l\'impression A4, ou publiez dans le catalogue immuable.'}
          </p>
        </div>

        {/* Export Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {drafts.length > 1 && (
            <select
              value={selectedDraftId}
              onChange={(e) => handleSelectDraft(e.target.value)}
              aria-label="Sélectionner le document à exporter"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E9EF] text-xs text-[#202B38] focus:outline-none focus:border-[#3478B8] shadow-xs"
            >
              {drafts.map(d => (
                <option key={d.draftId} value={d.draftId}>
                  {d.draftId} ({d.status}) — {d.chapter}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#3478B8]" />
            <span>Imprimer A4</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] text-xs font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] text-xs font-medium transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePublishToDisk}
            disabled={!isApproved || isPublishing || draft.status === 'EXPORTED'}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#14243A] hover:bg-[#203751] disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
            title={!isApproved ? 'Seuls les brouillons formellement approuvés peuvent être publiés' : ''}
          >
            <FolderCheck className="w-4 h-4 text-emerald-400" />
            <span>{draft.status === 'EXPORTED' ? 'Déjà Publié' : isPublishing ? 'Publication...' : 'Publier au Catalogue'}</span>
          </button>
        </div>
      </div>

      {publishMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-mono">{publishMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!isApproved && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Verrou de Sécurité : Ce brouillon a le statut <strong>{draft.status}</strong>. Pour être exporté dans le catalogue officiel <code>content/published/</code>, il doit d&apos;abord être validé par un humain dans l&apos;onglet Révision.
          </span>
        </div>
      )}

      {/* Mode Switcher: Student vs Teacher */}
      <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3 print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B]">Mode de Présentation du Document :</span>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF] text-xs">
            <button
              onClick={() => setExportMode('STUDENT')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                exportMode === 'STUDENT' ? 'bg-white text-[#14243A] shadow-xs border border-[#E5E9EF]' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              Épreuve Élève (Énoncé seul)
            </button>
            <button
              onClick={() => setExportMode('TEACHER')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                exportMode === 'TEACHER' ? 'bg-white text-[#14243A] shadow-xs border border-[#E5E9EF]' : 'text-[#64748B] hover:text-[#14243A]'
              }`}
            >
              Fiche Enseignant (Énoncé + Corrigé + Barème)
            </button>
          </div>
        </div>

        <span className="text-[11px] text-[#64748B] font-mono">Format A4 Prêt à l&apos;Impression</span>
      </div>

      {/* Official Printable Baccalauréat Paper Preview */}
      <div className="p-8 rounded-xl bg-white border border-[#CBD5E1] space-y-6 max-w-4xl mx-auto shadow-md print:shadow-none print:border-none print:p-0">
        
        {/* Official Header Banner */}
        <div className="border-b-2 border-[#14243A] pb-4 text-center space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#64748B] print:text-black">
            République Tunisienne — Ministère de l&apos;Éducation
          </div>
          <div className="text-base font-extrabold text-[#14243A] print:text-black tracking-wide uppercase">
            EXAMEN DU BACCALAURÉAT — SECTION SCIENCES DE L&apos;INFORMATIQUE
          </div>
          <div className="text-xs text-[#3478B8] print:text-black font-semibold">
            {exportMode === 'STUDENT' ? 'ÉPREUVE D\'ENTRAÎNEMENT OFFICIELLE' : 'CORRIGÉ OFFICIEL & BARÈME DE NOTATION'}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-[#E5E9EF] print:border-black mt-3 font-semibold text-[#334155] print:text-black">
            <div>Matière : {draft.subject}</div>
            <div>Durée : {draft.header.duration}</div>
            <div>Coefficient : {draft.header.coefficient} • Total : {draft.totalPoints} pts</div>
          </div>
        </div>

        {/* Exercises Content */}
        <div className="space-y-6 text-xs text-[#202B38] print:text-black">
          {draft.exercises.map((ex) => (
            <div key={ex.id} className="space-y-3 pb-4 border-b border-[#E5E9EF] print:border-black/30">
              <div className="flex items-center justify-between font-bold text-sm text-[#14243A] print:text-black border-b border-[#E5E9EF] pb-1">
                <span>Exercice {ex.number} : {ex.title}</span>
                <span className="font-mono text-xs">{ex.points} points</span>
              </div>

              {/* Statement */}
              <div className="leading-relaxed">
                <MathMarkdownRenderer content={ex.statementMarkdown} />
              </div>

              {/* Solution if Teacher Mode */}
              {exportMode === 'TEACHER' && (
                <div className="mt-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                  <div className="text-xs font-bold text-[#0F766E] print:text-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] print:text-black" />
                    <span>Corrigé Détaillé :</span>
                  </div>
                  <MathMarkdownRenderer content={ex.solutionMarkdown} />

                  {ex.gradingCriteria.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#E5E9EF] print:border-black/20 text-[11px]">
                      <span className="font-bold text-[#14243A] print:text-black block mb-1">Détail du Barème :</span>
                      {ex.gradingCriteria.map((crit, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between text-[#475569] print:text-black py-0.5">
                          <span>• {crit.description}</span>
                          <span className="font-mono font-semibold">{crit.points} pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paper Footer */}
        <div className="border-t border-[#E5E9EF] print:border-black pt-3 flex items-center justify-between text-[10px] text-[#64748B] print:text-black">
          <span>BAC AI TUNISIA — Section Sciences de l&apos;Informatique ({draft.academicYear})</span>
          <span>Document Pédagogique Conforme — Page 1/1</span>
        </div>

      </div>

      {/* Publications History */}
      {publications.length > 0 && (
        <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-[#14243A] uppercase tracking-wider">
              Publications Immobiles Enregistrées (content/published/)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {publications.map(pub => (
              <div key={pub.publicationId} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#14243A]">{pub.subject} — {pub.chapter}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                    ID : {pub.publicationId} • Publié le {new Date(pub.publishedAt).toLocaleString()} par {pub.approvalMetadata.reviewer}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold">
                  PUBLIÉ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};