#!/usr/bin/env python3
"""
REGRESSION AUDIT TEST HARNESS FOR V4 ACTIVE DRAFTS
Extracts code blocks verbatim from the 5 active drafts and executes regression tests.
Reflects purely the official exam specifications without enforcing extra canonical constraints.
"""

import json
import re
import os
import tempfile
import unittest

DRAFTS_DIR = 'content/drafts/active'

COURS_PATH = os.path.join(DRAFTS_DIR, 'DRAFT-COURS-BACSI-2026-409671.json')
SERIE_PATH = os.path.join(DRAFTS_DIR, 'DRAFT-SERIE-BACSI-2026-409671.json')
DEVOIR_PATH = os.path.join(DRAFTS_DIR, 'DRAFT-DEVOIR-BACSI-2026-409671.json')
CORR_DEV_PATH = os.path.join(DRAFTS_DIR, 'DRAFT-CORRIGE-BACSI-2026-409671.json')
CORR_SER_PATH = os.path.join(DRAFTS_DIR, 'DRAFT-CORRIGE-SERIE-BACSI-2026-409671.json')

py_regex = re.compile(r'```python\s*\n(.*?)```', re.DOTALL)

with open(COURS_PATH, 'r', encoding='utf-8') as f:
    cours_data = json.load(f)
with open(SERIE_PATH, 'r', encoding='utf-8') as f:
    serie_data = json.load(f)
with open(DEVOIR_PATH, 'r', encoding='utf-8') as f:
    devoir_data = json.load(f)
with open(CORR_DEV_PATH, 'r', encoding='utf-8') as f:
    corr_dev_data = json.load(f)
with open(CORR_SER_PATH, 'r', encoding='utf-8') as f:
    corr_ser_data = json.load(f)

# Extract Corrigé Devoir code
corr_dev_ns = {}
corr_dev_ex1_code = py_regex.findall(corr_dev_data['exercises'][0]['statementMarkdown'])[0]
exec(corr_dev_ex1_code, corr_dev_ns)
Valider = corr_dev_ns['Valider']
RomainToDecimal = corr_dev_ns['RomainToDecimal']

corr_dev_ex2_blocks = py_regex.findall(corr_dev_data['exercises'][1]['statementMarkdown'])
for b in corr_dev_ex2_blocks:
    exec(b, corr_dev_ns)
EnregistrerObjet = corr_dev_ns['EnregistrerObjet']
ChargerObjets = corr_dev_ns['ChargerObjets']

corr_dev_ex3_blocks = py_regex.findall(corr_dev_data['exercises'][2]['statementMarkdown'])
for b in corr_dev_ex3_blocks:
    exec(b, corr_dev_ns)
TriSelectionMultiCriteres = corr_dev_ns['TriSelectionMultiCriteres']
AfficherSelonSeuil = corr_dev_ns['AfficherSelonSeuil']
TrierParCode = corr_dev_ns['TrierParCode']
RechercheObjetParCode = corr_dev_ns['RechercheObjetParCode']

# Extract Corrigé Série code
corr_ser_ns = {}
corr_ser_ex1_blocks = py_regex.findall(corr_ser_data['exercises'][0]['statementMarkdown'])
for b in corr_ser_ex1_blocks:
    exec(b, corr_ser_ns)
valider_isbn = corr_ser_ns['valider_isbn']
creer_livre = corr_ser_ns['creer_livre']

corr_ser_ex2_blocks = py_regex.findall(corr_ser_data['exercises'][1]['statementMarkdown'])
for b in corr_ser_ex2_blocks:
    exec(b, corr_ser_ns)
ajouter_livre = corr_ser_ns['ajouter_livre']

corr_ser_ex3_blocks = py_regex.findall(corr_ser_data['exercises'][2]['statementMarkdown'])
for b in corr_ser_ex3_blocks:
    exec(b, corr_ser_ns)
charger_livres = corr_ser_ns['charger_livres']
prix_moyen = corr_ser_ns['prix_moyen']
extraire_disponibles = corr_ser_ns['extraire_disponibles']

corr_ser_ex4_blocks = py_regex.findall(corr_ser_data['exercises'][3]['statementMarkdown'])
for b in corr_ser_ex4_blocks:
    exec(b, corr_ser_ns)
tri_selection_livres = corr_ser_ns['tri_selection_livres']
rechercher_livre_isbn_sequentiel = corr_ser_ns['rechercher_livre_isbn_sequentiel']
generer_rapport_inventaire = corr_ser_ns['generer_rapport_inventaire']


class TestV4Compliance(unittest.TestCase):

    def test_01_valider_official_exam_constraints(self):
        """Vérifie Valider() selon la consigne exacte du Bac 2026."""
        # Exemples du sujet officiel (valides)
        self.assertTrue(Valider("CXCII"))
        self.assertTrue(Valider("XLVI"))
        self.assertTrue(Valider("MDCCL"))
        self.assertTrue(Valider("I"))
        self.assertTrue(Valider("III"))
        self.assertTrue(Valider("MMXXVI"))

        # Invalides selon la contrainte officielle : > 3 répétitions identiques
        self.assertFalse(Valider("IIII"))
        self.assertFalse(Valider("XXXX"))
        self.assertFalse(Valider("CCCC"))
        self.assertFalse(Valider("MMMM"))
        
        # Invalides selon alphabet officiel
        self.assertFalse(Valider(""))
        self.assertFalse(Valider("ABC"))
        self.assertFalse(Valider("IX5"))
        self.assertFalse(Valider("cxcii")) # minuscules

    def test_02_romain_to_decimal_official_rules(self):
        """Vérifie RomainToDecimal() sur les valeurs officielles."""
        self.assertEqual(RomainToDecimal("CXCII"), 192)
        self.assertEqual(RomainToDecimal("XLVI"), 46)
        self.assertEqual(RomainToDecimal("MDCCL"), 1750)
        self.assertEqual(RomainToDecimal("I"), 1)
        self.assertEqual(RomainToDecimal("III"), 3)
        self.assertEqual(RomainToDecimal("IV"), 4)
        self.assertEqual(RomainToDecimal("IX"), 9)
        self.assertEqual(RomainToDecimal("XL"), 40)
        self.assertEqual(RomainToDecimal("XC"), 90)
        self.assertEqual(RomainToDecimal("CD"), 400)
        self.assertEqual(RomainToDecimal("CM"), 900)
        self.assertEqual(RomainToDecimal("MMXXVI"), 2026)

    def test_03_binary_persistence_pickle(self):
        """Vérifie la persistance binaire avec gestion de 0-octet et ajouts successifs."""
        with tempfile.TemporaryDirectory() as tmpdir:
            fpath = os.path.join(tmpdir, "objets.dat")
            # 1. Non-existent file
            self.assertEqual(ChargerObjets(os.path.join(tmpdir, "absent.dat")), [])
            # 2. 0-byte file
            open(fpath, "wb").close()
            self.assertEqual(ChargerObjets(fpath), [])
            # 3. Add and load
            o1 = {'code': 'OBJ1', 'designation': 'Stèle', 'qte_decimal': 10, 'qte_romain': 'X'}
            o2 = {'code': 'OBJ2', 'designation': 'Vase', 'qte_decimal': 20, 'qte_romain': 'XX'}
            EnregistrerObjet(fpath, o1)
            EnregistrerObjet(fpath, o2)
            loaded = ChargerObjets(fpath)
            self.assertEqual(len(loaded), 2)
            self.assertEqual(loaded[0]['code'], 'OBJ1')
            self.assertEqual(loaded[1]['code'], 'OBJ2')

    def test_04_multi_criteria_selection_sort(self):
        """Vérifie le tri sélection multi-critères et l'échange global."""
        objets = [
            {'code': 'OBJ003', 'designation': 'Stèle B', 'qte_decimal': 46, 'qte_romain': 'XLVI'},
            {'code': 'OBJ001', 'designation': 'Amphore', 'qte_decimal': 192, 'qte_romain': 'CXCII'},
            {'code': 'OBJ002', 'designation': 'Stèle A', 'qte_decimal': 46, 'qte_romain': 'XLVI'}
        ]
        TriSelectionMultiCriteres(objets)
        self.assertEqual(objets[0]['code'], 'OBJ001') # 192
        self.assertEqual(objets[1]['code'], 'OBJ002') # 46, Stèle A
        self.assertEqual(objets[2]['code'], 'OBJ003') # 46, Stèle B

    def test_05_search_algorithms(self):
        """Vérifie la recherche dichotomique (après tri par code) et séquentielle."""
        objets = [
            {'code': 'OBJ500', 'designation': 'Aigle', 'qte_decimal': 10},
            {'code': 'OBJ100', 'designation': 'Bague', 'qte_decimal': 500},
            {'code': 'OBJ900', 'designation': 'Collier', 'qte_decimal': 50}
        ]
        TrierParCode(objets)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ100'), 0)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ500'), 1)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ900'), 2)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ999'), -1)

    def test_06_serie_corrige_algorithms(self):
        """Vérifie les algorithmes de la Série (Livre, ISBN, Tri par prix)."""
        self.assertTrue(valider_isbn("9789973123456"))
        self.assertFalse(valider_isbn("978997312345"))
        self.assertFalse(valider_isbn("978997312345A"))
        
        livre1 = creer_livre("9789973123456", "Informatique 4ème SI", 15.5)
        self.assertEqual(livre1['prix'], 15.5)
        self.assertTrue(livre1['disponible'])
        
        livres = [
            {'isbn': '1111111111111', 'titre': 'L1', 'prix': 10.0, 'disponible': True},
            {'isbn': '2222222222222', 'titre': 'L2', 'prix': 30.0, 'disponible': False},
            {'isbn': '3333333333333', 'titre': 'L3', 'prix': 20.0, 'disponible': True}
        ]
        self.assertEqual(prix_moyen(livres), 20.0)
        self.assertEqual(len(extraire_disponibles(livres)), 2)
        
        tri_selection_livres(livres)
        self.assertEqual(livres[0]['prix'], 30.0)
        self.assertEqual(livres[1]['prix'], 20.0)
        self.assertEqual(livres[2]['prix'], 10.0)
        
        self.assertEqual(rechercher_livre_isbn_sequentiel(livres, '2222222222222'), 0)
        self.assertEqual(rechercher_livre_isbn_sequentiel(livres, '9999999999999'), -1)

if __name__ == '__main__':
    unittest.main()
