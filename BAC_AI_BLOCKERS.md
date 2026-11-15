# BAC AI TUNISIA — REGISTRE DES TÂCHES ET AUTORISATIONS EN ATTENTE

**Dernière révision :** 2026-11-06T06:26:00+01:00

---

## 1. Statut du Développement Autonome Local
**AUCUN BLOCAGE LOCAL.**  
L'ensemble des phases de développement local autorisées (Phases 1.2 à 8, ainsi que le lecteur local de la Plateforme Étudiante Phase 9) sont 100% implémentées, testées, stables et vérifiées.

---

## 2. Tâches Externes Marquées BLOCKED_PENDING_APPROVAL

Conformément aux Frontières Non-Négociables de Sécurité définies par l'utilisateur, les actions suivantes ont été préparées sous forme de code et de scripts autonomes mais **ne seront pas exécutées sans autorisation explicite** :

| Identifiant | Domaine | Description | Statut Actuel | Prérequis pour Exécution |
| :--- | :--- | :--- | :--- | :--- |
| **CLOUD-001** | Base de données Supabase | Migration du schéma de production `supabase/migrations/20261105_bac_ai_tunisia_schema.sql` vers une instance distante | **BLOCKED_PENDING_APPROVAL** | Fourniture de l'URL Supabase et de la clé de rôle de service (`SUPABASE_SERVICE_ROLE_KEY`), avec confirmation explicite de l'utilisateur. |
| **CLOUD-002** | Déploiement Vercel | Déploiement en production de l'application Next.js (`vercel --prod`) | **BLOCKED_PENDING_APPROVAL** | Confirmation explicite de l'utilisateur pour lancer la mise en ligne publique. |
| **CLOUD-003** | Git Remote Push | Envoi des modifications locales vers le dépôt distant GitHub (`git push origin main`) | **BLOCKED_PENDING_APPROVAL** | Confirmation explicite de l'utilisateur pour effectuer le push sur `https://github.com/rayenmkadmini/education.git`. |
| **OCR-001** | Extraction OCR Tesseract/Cloud | Traitement OCR des 2 documents scannés identifiés (`Mathematiques_..._2026_Correction.pdf` et `Annexes html css...`) | **BLOCKED_PENDING_APPROVAL** | Confirmation de l'utilisateur pour l'installation locale de packages OCR système (ex. Tesseract) ou conservation de l'état actuel `OCR_REQUIRED`. |
