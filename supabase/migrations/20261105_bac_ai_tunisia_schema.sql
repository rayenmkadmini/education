-- ==============================================================================
-- BAC AI TUNISIA — PRODUCTION SUPABASE DATABASE SCHEMA MIGRATION PLAN
-- Section: Sciences de l'Informatique (Baccalauréat Tunisien)
-- Safety: Requires explicit authorization before applying to remote Supabase
-- Status: BLOCKED_PENDING_APPROVAL (Local Development Mode Active)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Curriculum Subjects Table
CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    coeff NUMERIC(3, 1) NOT NULL,
    duration_minutes INT NOT NULL,
    exam_type TEXT NOT NULL,
    calculator_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    official_reference TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED_OFFICIAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Published Educational Content Table (Decoupled from authoring computer)
CREATE TABLE IF NOT EXISTS public.published_content (
    id TEXT PRIMARY KEY,
    publication_id TEXT UNIQUE NOT NULL,
    source_draft_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    content_type TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2026-2027',
    total_points NUMERIC(4, 1) NOT NULL DEFAULT 20.0,
    language TEXT NOT NULL DEFAULT 'fr_tn_derja',
    header JSONB NOT NULL,
    exercises JSONB NOT NULL,
    provenance JSONB NOT NULL,
    approval_metadata JSONB NOT NULL,
    is_official BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_content ENABLE ROW LEVEL SECURITY;

-- 5. Public Read-Only Access for Students (Zero Authentication Required)
CREATE POLICY "Public Read Access for Curriculum"
    ON public.curriculum_subjects
    FOR SELECT
    USING (true);

CREATE POLICY "Public Read Access for Published Content"
    ON public.published_content
    FOR SELECT
    USING (true);

-- 6. Teacher / Admin Write Barrier
CREATE POLICY "Restricted Write Access"
    ON public.published_content
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'teacher_admin');
