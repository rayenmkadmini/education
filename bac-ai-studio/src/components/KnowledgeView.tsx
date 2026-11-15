'use client';

import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  FileText, 
  FileCode, 
  Archive, 
  Database, 
  CheckCircle2, 
  Eye, 
  ShieldCheck, 
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileSearch,
  Hash,
  History,
  AlertTriangle,
  X
} from 'lucide-react';
import { DocumentRecord, Language, IngestionRunRecord } from '@/lib/types';

interface ExtractedDetail {
  documentId: string;
  filename: string;
  sha256: string;
  extractedAt: string;
  pageCount: number;
  textSnippet: string;
  fullText: string;
  pages?: Array<{ pageNumber: number; text: string }>;
  zipEntries?: Array<{ name: string; sizeBytes: number; isDirectory: boolean }>;
}

interface KnowledgeViewProps {
  language: Language;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [docDetail, setDocDetail] = useState<ExtractedDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyRuns, setHistoryRuns] = useState<IngestionRunRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [, startTransition] = useTransition();

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/knowledge?history=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setHistoryRuns(data.history);
      }
    } catch (err) {
      console.warn('Could not load ingestion history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    fetchHistory();
  };

  const handleRetryFailed = async () => {
    try {
      setIsRetrying(true);
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry' })
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(data.message || 'Tentative de récupération terminée.');
        fetchCatalog();
        fetchHistory();
        setTimeout(() => setSyncMessage(null), 6000);
      }
    } catch (err) {
      console.error('Failed to retry extractions:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  // Load knowledge catalog on mount
  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      if (data.success && data.catalog?.documents) {
        setDocuments(data.catalog.documents);
        if (data.catalog.documents.length > 0 && !selectedDoc) {
          setSelectedDoc(data.catalog.documents[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load knowledge catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDoc]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Fetch document full extracted content when selected
  useEffect(() => {
    if (!selectedDoc) {
      setDocDetail(null);
      return;
    }
    let isCancelled = false;
    setDetailLoading(true);
    setCurrentPage(1);

    fetch(`/api/knowledge/${selectedDoc.id}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data.success) {
          setDocDetail(data.extracted);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          console.error('Error fetching doc detail:', err);
        }
      })
      .finally(() => {
        if (!isCancelled) setDetailLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDoc]);

  // Synchronize / Rescan repository
  const handleSync = async (force: boolean = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force })
      });
      const data = await res.json();
      if (data.success && data.catalog?.documents) {
        setDocuments(data.catalog.documents);
        setSyncMessage(
          isAr 
            ? `تم تحديث الفهرس: ${data.catalog.totalDocuments} وثيقة مفهرسة ومتحقق منها.`
            : `Synchronisation réussie: ${data.catalog.totalDocuments} documents indexés avec succès.`
        );
        setTimeout(() => setSyncMessage(null), 6000);
      }
    } catch (err) {
      console.error('Failed to sync catalog:', err);
      setSyncMessage(isAr ? 'فشلت عملية المزامنة' : 'Échec de synchronisation du répertoire.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Get distinct subjects for filter
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    documents.forEach(d => {
      if (d.subject) subs.add(d.subject);
    });
    return Array.from(subs).sort();
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.extractedTextSnippet && doc.extractedTextSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedSubject !== 'ALL' && doc.subject !== selectedSubject) {
        return false;
      }

      if (selectedFilter === 'ALL') return true;
      if (selectedFilter === 'OFFICIAL_EXAM') return doc.classification === 'OFFICIAL_EXAM';
      if (selectedFilter === 'OFFICIAL_TEXTBOOK') return doc.classification === 'OFFICIAL_TEXTBOOK';
      if (selectedFilter === 'EXERCISE_RESOURCE') return doc.classification === 'EXERCISE_RESOURCE';
      if (selectedFilter === 'TEACHER_MATERIAL') return doc.classification === 'TEACHER_MATERIAL';
      if (selectedFilter === 'DUPLICATES') return doc.extractionStatus === 'DUPLICATE';

      return true;
    });
  }, [documents, searchQuery, selectedFilter, selectedSubject]);

  const getDocIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return <FileText className="w-4 h-4 text-rose-600" />;
    if (filename.endsWith('.sql')) return <Database className="w-4 h-4 text-amber-600" />;
    if (filename.endsWith('.zip')) return <Archive className="w-4 h-4 text-purple-600" />;
    if (filename.endsWith('.php') || filename.endsWith('.py')) return <FileCode className="w-4 h-4 text-emerald-600" />;
    return <FileText className="w-4 h-4 text-[#3478B8]" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#14243A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#3478B8]" />
              {isAr ? 'مكتبة المصادر والوثائق التربوية المعتمدة' : 'Bibliothèque des Ressources Éducatives Authentiques'}
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#3478B8] font-mono font-semibold">
              {documents.length} Documents Indexés
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <FolderOpen className="w-3.5 h-3.5 text-[#64748B]" />
            <code className="text-[#14243A] bg-[#F6F7F9] px-1.5 py-0.5 rounded border border-[#E5E9EF] font-mono text-[11px]">
              D:\EDUCATION RAYEN\bac info cours exam resourse
            </code>
            <span className="text-emerald-700 font-medium">• Ancrage Réel & Lecture Seule Sécurisée</span>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleSync(false)}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#14243A] hover:bg-[#203751] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Scan incrémental rapide des nouveaux fichiers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? (isAr ? 'جار التحديث...' : 'Synchronisation...') : (isAr ? 'مزامنة سريعة' : 'Synchroniser')}
          </button>
          <button
            onClick={() => handleSync(true)}
            disabled={isSyncing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Réanalyser et extraire à nouveau l'intégralité des documents"
          >
            <Layers className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Réextraction complète</span>
          </button>
          <button
            onClick={handleOpenHistory}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6F7F9] hover:bg-[#EEF1F5] border border-[#E5E9EF] text-[#202B38] font-medium text-xs transition-colors cursor-pointer"
            title="Consulter l'historique des opérations de découverte"
          >
            <History className="w-3.5 h-3.5 text-[#3478B8]" />
            <span>Historique</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{syncMessage}</span>
        </div>
      )}

      {/* Search & Multi-Filters Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder={isAr ? 'بحث في أسماء الملفات، المحتوى، والمواضيع...' : 'Recherche par nom, énoncé extrait, mot-clé Python/SQL...'}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                startTransition(() => {
                  setSearchQuery(val);
                });
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#E5E9EF] focus:border-[#3478B8] focus:ring-1 focus:ring-[#3478B8] text-xs text-[#202B38] placeholder-[#94A3B8] focus:outline-none transition-colors shadow-xs"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="Filtrer par matière"
              className="w-full sm:w-52 px-3 py-2 rounded-lg bg-white border border-[#E5E9EF] focus:border-[#3478B8] text-xs text-[#202B38] focus:outline-none shadow-xs"
            >
              <option value="ALL">Toutes les matières ({documents.length})</option>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Classification Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `Tous (${documents.length})` },
            { id: 'OFFICIAL_EXAM', label: 'Examens Nationaux' },
            { id: 'OFFICIAL_TEXTBOOK', label: 'Manuels CNP' },
            { id: 'EXERCISE_RESOURCE', label: 'Exercices & TPs' },
            { id: 'TEACHER_MATERIAL', label: 'Fiches Enseignants' },
            { id: 'DUPLICATES', label: 'Doublons' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === tab.id 
                  ? 'bg-[#14243A] text-white shadow-xs' 
                  : 'bg-white text-[#64748B] hover:text-[#202B38] hover:bg-[#F8FAFC] border border-[#E5E9EF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Document List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Documents List (7 cols) */}
        <div className="lg:col-span-7 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {loading ? (
            <div className="p-12 text-center text-[#64748B] text-xs flex flex-col items-center gap-2 bg-white rounded-xl border border-[#E5E9EF]">
              <RefreshCw className="w-5 h-5 text-[#3478B8] animate-spin" />
              <span>Chargement du catalogue des ressources...</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-[#64748B] text-xs bg-white rounded-xl border border-[#E5E9EF]">
              Aucun document ne correspond à vos critères de recherche.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                    isSelected 
                      ? 'bg-[#F1F5F9] border-[#3478B8] shadow-xs' 
                      : 'bg-white border-[#E5E9EF] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF] shrink-0">
                      {getDocIcon(doc.filename)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-[#14243A] truncate">{doc.filename}</div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span className="text-[#3478B8] font-medium">{doc.subject}</span>
                        {doc.academicYear && <span>• {doc.academicYear}</span>}
                        {doc.session && doc.session !== 'NON_APPLICABLE' && (
                          <span>• {doc.session}</span>
                        )}
                        {doc.pageCount && doc.pageCount > 1 && (
                          <span className="font-mono">• {doc.pageCount} p.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      doc.classification === 'OFFICIAL_EXAM' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : doc.classification === 'OFFICIAL_TEXTBOOK'
                        ? 'bg-blue-50 text-[#3478B8] border-blue-200'
                        : doc.classification === 'EXERCISE_RESOURCE'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {doc.classification}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Extracted Preview & Document Inspector (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-[#E5E9EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E9EF] pb-3">
            <h2 className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#3478B8]" />
              {isAr ? 'فاحص النصوص والمحتوى المستخرج' : 'Contenu Extrait & Source Officielle'}
            </h2>
            {selectedDoc?.isOfficial && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Officiel Agréé
              </span>
            )}
          </div>

          {selectedDoc ? (
            <div className="space-y-4 text-xs flex-1 flex flex-col">
              {/* Filename & SHA Header */}
              <div>
                <span className="text-[#64748B] text-[11px] block">Fichier Source :</span>
                <span className="font-semibold text-[#14243A] break-all text-xs">{selectedDoc.filename}</span>
                {selectedDoc.sha256 && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#64748B] mt-1 break-all">
                    <Hash className="w-3 h-3 text-[#94A3B8] shrink-0" />
                    <span>SHA-256: {selectedDoc.sha256}</span>
                  </div>
                )}
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-[#F6F7F9] border border-[#E5E9EF]">
                <div>
                  <span className="text-[#64748B] text-[10px] block">Matière :</span>
                  <span className="font-semibold text-[#3478B8]">{selectedDoc.subject}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] block">Classification :</span>
                  <span className="font-semibold text-[#14243A]">{selectedDoc.classification}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] block">Taille & Pages :</span>
                  <span className="text-[#475569]">
                    {(selectedDoc.sizeBytes / 1024).toFixed(1)} Ko {selectedDoc.pageCount ? `• ${selectedDoc.pageCount} page(s)` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] block">Statut Index :</span>
                  <span className="text-emerald-700 font-medium">{selectedDoc.extractionStatus}</span>
                </div>
              </div>

              {/* Extracted Content Viewer */}
              <div className="flex-1 flex flex-col border border-[#E5E9EF] rounded-lg bg-[#F8FAFC] overflow-hidden">
                <div className="px-3 py-2 bg-[#F1F5F9] border-b border-[#E5E9EF] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#14243A]">
                    <FileSearch className="w-3.5 h-3.5 text-[#3478B8]" />
                    <span>Aperçu Pédagogique Intégral</span>
                  </div>

                  {/* Page Navigation Controls if multi-page */}
                  {docDetail?.pages && docDetail.pages.length > 1 && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="p-1 rounded bg-white hover:bg-[#E5E9EF] border border-[#E5E9EF] disabled:opacity-40 text-[#475569] cursor-pointer"
                        title="Page précédente"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[#64748B] font-mono text-[10px]">
                        Page {currentPage} / {docDetail.pages.length}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(docDetail.pages!.length, p + 1))}
                        disabled={currentPage >= docDetail.pages.length}
                        className="p-1 rounded bg-white hover:bg-[#E5E9EF] border border-[#E5E9EF] disabled:opacity-40 text-[#475569] cursor-pointer"
                        title="Page suivante"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-3.5 flex-1 max-h-[360px] overflow-y-auto text-[11px] text-[#334155] font-mono leading-relaxed whitespace-pre-wrap select-text">
                  {detailLoading ? (
                    <div className="py-12 text-center text-[#64748B] flex flex-col items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#3478B8] animate-spin" />
                      <span>Extraction du texte en cours...</span>
                    </div>
                  ) : docDetail?.zipEntries && docDetail.zipEntries.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-[#3478B8] font-semibold mb-2">Contenu de l&apos;archive ZIP protégée :</div>
                      {docDetail.zipEntries.map((e, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-[#E5E9EF]">
                          <span className="text-[#334155]">{e.name}</span>
                          <span className="text-[#64748B] text-[10px]">{(e.sizeBytes / 1024).toFixed(1)} Ko</span>
                        </div>
                      ))}
                      {docDetail.fullText && (
                        <div className="mt-4 pt-3 border-t border-[#E5E9EF] text-[#475569]">
                          {docDetail.fullText}
                        </div>
                      )}
                    </div>
                  ) : docDetail?.pages && docDetail.pages[currentPage - 1] ? (
                    docDetail.pages[currentPage - 1].text || (
                      <span className="text-[#94A3B8] italic">Page sans texte extractible (graphique ou numérisation protégée).</span>
                    )
                  ) : docDetail?.fullText ? (
                    docDetail.fullText
                  ) : (
                    <span className="text-[#94A3B8] italic">Aucun texte extrait disponible.</span>
                  )}
                </div>
              </div>

              {/* Educational Citation Footer */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-[#1E3A8A]">
                <span className="font-bold block mb-0.5">Ancrage Pédagogique Garanti :</span>
                Ce document authentique est référencé par son identifiant unique pour nourrir les consignes de génération d&apos;exercices conformes aux épreuves nationales.
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#64748B] text-center py-12">Sélectionnez un document pour consulter ses extraits authentiques.</p>
          )}
        </div>

      </div>

      {/* Ingestion History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E9EF] rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-[#E5E9EF] flex items-center justify-between bg-[#F6F7F9]">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#3478B8]" />
                <div>
                  <h3 className="text-sm font-bold text-[#14243A]">Historique d&apos;Ingestion &amp; Découverte de Fichiers</h3>
                  <p className="text-[11px] text-[#64748B]">Journal des synchronisations automatiques et incrémentales du Drive D:</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetryFailed}
                  disabled={isRetrying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-medium cursor-pointer transition-colors"
                  title="Tenter d'extraire à nouveau les fichiers en échec"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Récupération...' : 'Réessayer échecs'}</span>
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-lg hover:bg-[#E5E9EF] text-[#64748B] hover:text-[#14243A] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {historyLoading ? (
                <div className="py-12 text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#3478B8]" />
                  <span>Chargement de l&apos;historique...</span>
                </div>
              ) : historyRuns.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#64748B]">
                  Aucune opération d&apos;ingestion enregistrée pour le moment.
                </div>
              ) : (
                historyRuns.map((run) => (
                  <div key={run.runId} className="p-4 rounded-xl bg-white border border-[#E5E9EF] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                          run.status === 'SUCCESS' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                          {run.status}
                        </span>
                        <span className="text-xs font-mono font-semibold text-[#14243A]">{run.runId}</span>
                        <span className="text-[11px] text-[#64748B] font-mono">({run.trigger})</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-3">
                        <span>{new Date(run.startedAt).toLocaleString('fr-FR')}</span>
                        <span className="text-[#3478B8] font-mono font-semibold">{run.durationMs}ms</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 border-t border-[#E5E9EF] text-center text-[10px]">
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Découverts</span>
                        <span className="text-[#14243A] font-mono font-bold text-xs">{run.stats.discoveredFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Réutilisés</span>
                        <span className="text-emerald-700 font-mono font-bold text-xs">{run.stats.reusedFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Ajoutés</span>
                        <span className="text-[#3478B8] font-mono font-bold text-xs">{run.stats.addedFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Modifiés</span>
                        <span className="text-indigo-700 font-mono font-bold text-xs">{run.stats.modifiedFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Doublons</span>
                        <span className="text-[#475569] font-mono font-bold text-xs">{run.stats.duplicateFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">OCR Requis</span>
                        <span className="text-amber-700 font-mono font-bold text-xs">{run.stats.ocrRequiredFiles}</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#F6F7F9] border border-[#E5E9EF]">
                        <span className="text-[#64748B] block">Échecs</span>
                        <span className="text-rose-700 font-mono font-bold text-xs">{run.stats.failedFiles}</span>
                      </div>
                    </div>

                    {/* Added files details */}
                    {run.addedDocuments && run.addedDocuments.length > 0 && (
                      <div className="mt-2 text-[11px] bg-[#F6F7F9] p-2.5 rounded-lg border border-[#E5E9EF]">
                        <span className="font-semibold text-[#14243A] block mb-1">
                          Nouveaux fichiers intégrés ({run.addedDocuments.length}) :
                        </span>
                        <ul className="space-y-1 max-h-24 overflow-y-auto font-mono text-[10px] text-[#475569]">
                          {run.addedDocuments.map((doc, idx) => (
                            <li key={idx} className="truncate">
                              • <span className="text-[#3478B8]">{doc.id}</span> : {doc.filename} ({doc.subject})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Errors */}
                    {run.errors && run.errors.length > 0 && (
                      <div className="mt-2 text-[11px] bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-rose-800">
                        <span className="font-semibold block mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Erreurs relevées ({run.errors.length}) :
                        </span>
                        <ul className="space-y-1 font-mono text-[10px] text-rose-700">
                          {run.errors.map((err, idx) => (
                            <li key={idx}>• {err.filename}: {err.error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};