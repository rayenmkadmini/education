#!/usr/bin/env python3
"""
PILOT 01 ALGORITHM VALIDATION TEST SUITE
Conforme 100% au Programme Officiel du Ministère de l'Éducation Tunisienne
Section : 4ème Année Secondaire — Sciences de l'Informatique (2026-2027)
Sujet de référence : Bac Pratique 23 mai 2026 (Séance 8h30)
"""

import os
import tempfile
import unittest
from pickle import dump, load

# ==============================================================================
# 1. VALIDATION ET CONVERSION DES NOMBRES ROMAINS (CONFORME BAC 2026)
# ==============================================================================

def Valider(ch: str) -> bool:
    """
    Règle officielle du Bac 2026 :
    - Chaîne non vide
    - Uniquement les lettres : I, V, X, L, C, D, M
    - Pas plus de trois lettres identiques consécutives
    (SANS AUCUNE BIBLIOTHÈQUE EXTERNE)
    """
    if not isinstance(ch, str) or len(ch) == 0:
        return False
        
    lettres_autorisees = "IVXLCDM"
    for c in ch:
        if c not in lettres_autorisees:
            return False
            
    for i in range(len(ch) - 3):
        if ch[i] == ch[i + 1] == ch[i + 2] == ch[i + 3]:
            return False
            
    return True

VALEURS_ROMAINES = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
}

def RomainToDecimal(ch: str) -> int:
    """
    Règle de conversion officielle du sujet Bac 2026 :
    - On parcourt la chaîne de gauche à droite
    - Si val[i] >= val[i+1] : on ajoute val[i]
    - Si val[i] < val[i+1] : on retranche val[i]
    - Le dernier caractère est toujours ajouté
    """
    total = 0
    n = len(ch)
    for i in range(n - 1):
        v_courant = VALEURS_ROMAINES[ch[i]]
        v_suivant = VALEURS_ROMAINES[ch[i + 1]]
        if v_courant >= v_suivant:
            total += v_courant
        else:
            total -= v_courant
            
    total += VALEURS_ROMAINES[ch[-1]]
    return total


# ==============================================================================
# 2. PERSISTANCE BINAIRE (PICKLE) CONFORME BAC SI
# ==============================================================================

def EnregistrerObjet(nom_fich: str, obj: dict) -> None:
    f = open(nom_fich, "ab")
    dump(obj, f)
    f.close()

def ChargerObjets(nom_fich: str) -> list:
    T = []
    if not os.path.exists(nom_fich):
        return T
    f = open(nom_fich, "rb")
    while True:
        try:
            e = load(f)
            T.append(e)
        except EOFError:
            break
    f.close()
    return T


# ==============================================================================
# 3. TRI SÉLECTION & RECHERCHE DICHOTOMIQUE CONFORME BAC SI
# ==============================================================================

def TriSelectionMultiCriteres(T: list) -> None:
    n = len(T)
    for i in range(n - 1):
        pos_max = i
        for j in range(i + 1, n):
            if T[j]['qte_decimal'] > T[pos_max]['qte_decimal']:
                pos_max = j
            elif (T[j]['qte_decimal'] == T[pos_max]['qte_decimal']) and (T[j]['designation'] < T[pos_max]['designation']):
                pos_max = j
        if pos_max != i:
            T[i], T[pos_max] = T[pos_max], T[i]

def TrierParCode(T: list) -> None:
    n = len(T)
    for i in range(n - 1):
        pos_min = i
        for j in range(i + 1, n):
            if T[j]['code'] < T[pos_min]['code']:
                pos_min = j
        if pos_min != i:
            T[i], T[pos_min] = T[pos_min], T[i]

def RechercheObjetParCode(T: list, code_rech: str) -> int:
    deb = 0
    fin = len(T) - 1
    while deb <= fin:
        mil = (deb + fin) // 2
        if T[mil]['code'] == code_rech:
            return mil
        elif T[mil]['code'] < code_rech:
            deb = mil + 1
        else:
            fin = mil - 1
    return -1


# ==============================================================================
# TESTS UNITAIRES
# ==============================================================================

class TestBacTunisien(unittest.TestCase):

    def test_01_exemples_officiels_bac_2026(self):
        """Vérifie exactement les 3 exemples donnés dans le sujet officiel 2026."""
        exemples = {
            'CXCII': 192,
            'XLVI': 46,
            'MDCCL': 1750,
            'MMXXVI': 2026,
            'I': 1,
            'III': 3,
            'IV': 4,
            'IX': 9,
            'XL': 40,
            'XC': 90,
            'CD': 400,
            'CM': 900
        }
        for ch, expected in exemples.items():
            with self.subTest(ch=ch):
                self.assertTrue(Valider(ch), f"Doit être valide selon le sujet : {ch}")
                self.assertEqual(RomainToDecimal(ch), expected)

    def test_02_contraintes_officielles_bac_2026(self):
        """Vérifie la contrainte officielle : > 3 lettres identiques consécutives interdites."""
        invalides = ['IIII', 'XXXX', 'CCCC', 'MMMM', '', 'ABC', 'IX5', '123', 'cxcii']
        for inv in invalides:
            with self.subTest(inv=inv):
                self.assertFalse(Valider(inv), f"Doit être invalide selon le sujet : {inv!r}")

    def test_03_tri_selection_multi_criteres(self):
        """Vérifie le tri sélection multi-critères avec permutation d'enregistrement."""
        objets = [
            {'code': 'OBJ003', 'designation': 'Stèle B', 'qte_decimal': 46, 'qte_romain': 'XLVI'},
            {'code': 'OBJ001', 'designation': 'Amphore', 'qte_decimal': 192, 'qte_romain': 'CXCII'},
            {'code': 'OBJ002', 'designation': 'Stèle A', 'qte_decimal': 46, 'qte_romain': 'XLVI'}
        ]
        TriSelectionMultiCriteres(objets)
        self.assertEqual(objets[0]['code'], 'OBJ001')
        self.assertEqual(objets[1]['code'], 'OBJ002') # 'Stèle A' < 'Stèle B'
        self.assertEqual(objets[2]['code'], 'OBJ003')

    def test_04_recherche_dichotomique_precondition(self):
        """Vérifie la condition préalable de tri par code pour la recherche dichotomique."""
        objets = [
            {'code': 'OBJ500', 'designation': 'Aigle', 'qte_decimal': 10},
            {'code': 'OBJ100', 'designation': 'Bague', 'qte_decimal': 500},
            {'code': 'OBJ900', 'designation': 'Collier', 'qte_decimal': 50}
        ]
        # Tri préalable par code obligatoire
        TrierParCode(objets)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ500'), 1)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ100'), 0)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ900'), 2)
        self.assertEqual(RechercheObjetParCode(objets, 'OBJ000'), -1)

    def test_05_persistance_pickle(self):
        """Vérifie la persistance binaire standard pickle."""
        with tempfile.TemporaryDirectory() as tmpdir:
            fpath = os.path.join(tmpdir, "objets.dat")
            # 0-octet
            open(fpath, "wb").close()
            self.assertEqual(ChargerObjets(fpath), [])
            
            # Écriture
            obj = {'code': 'OBJ1', 'designation': 'Test', 'qte_decimal': 10, 'qte_romain': 'X'}
            EnregistrerObjet(fpath, obj)
            loaded = ChargerObjets(fpath)
            self.assertEqual(len(loaded), 1)
            self.assertEqual(loaded[0]['code'], 'OBJ1')

if __name__ == '__main__':
    unittest.main()
