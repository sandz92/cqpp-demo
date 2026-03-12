import React, { useState, useMemo, useRef } from 'react';

// ============================================================================
// QPP COMPLIANCE TRACKER V4.0 - AI ENHANCED
// Outil de conformité Charte QPP avec Intelligence Artificielle
// BearingPoint © 2026
// ============================================================================

const COLORS = {
  primary: '#CC2931', primaryLight: '#FF5A5A', primaryDark: '#A31F26',
  warmGray: '#98847A', lightGray: '#E6DEDA', background: '#FAF8F7',
  white: '#FFFFFF', dark: '#2D2926', success: '#2E7D32', successLight: '#E8F5E9',
  warning: '#F57C00', warningLight: '#FFF3E0', error: '#C62828', errorLight: '#FFEBEE',
  info: '#1565C0', infoLight: '#E3F2FD', ai: '#7C3AED', aiLight: '#EDE9FE'
};

const FONCTIONS = [
  { id: 'all', label: 'Toutes les fonctions', icon: '👥' },
  { id: 'direction', label: 'Direction Générale', icon: '🏢' },
  { id: 'commercial', label: 'Direction Commerciale', icon: '💼' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'affaires_reg', label: 'Affaires Réglementaires', icon: '📋' },
  { id: 'qualite', label: 'Qualité', icon: '✅' },
  { id: 'compliance', label: 'Compliance', icon: '⚖️' },
  { id: 'rh', label: 'Ressources Humaines', icon: '👤' },
  { id: 'juridique', label: 'Juridique', icon: '📜' },
  { id: 'achats', label: 'Achats', icon: '🛒' },
  { id: 'it', label: 'IT / Systèmes', icon: '💻' }
];

const DOCUMENT_TYPES = [
  { id: 'charte_qpp', label: 'Charte QPP interne', icon: '📜', domaines: ['GOUVERNANCE', 'DEONTOLOGIE'], maxPoints: 15 },
  { id: 'formation_support', label: 'Support de formation', icon: '🎓', domaines: ['FORMATION'], maxPoints: 10 },
  { id: 'attestation_formation', label: 'Attestation de formation', icon: '📄', domaines: ['FORMATION'], maxPoints: 5 },
  { id: 'contrat_distributeur', label: 'Contrat distributeur/agent', icon: '🤝', domaines: ['TIERS'], maxPoints: 10 },
  { id: 'procedure_visite', label: 'Procédure de visite', icon: '📍', domaines: ['VISITES'], maxPoints: 8 },
  { id: 'cr_comite', label: 'CR Comité QPP', icon: '📝', domaines: ['GOUVERNANCE'], maxPoints: 5 },
  { id: 'brochure_deonto', label: 'Brochure déontologique', icon: '⚖️', domaines: ['DEONTOLOGIE'], maxPoints: 10 },
  { id: 'procedure_validation', label: 'Procédure validation supports', icon: '✅', domaines: ['INFORMATION'], maxPoints: 8 },
  { id: 'organigramme', label: 'Organigramme QPP', icon: '🏗️', domaines: ['GOUVERNANCE'], maxPoints: 5 },
  { id: 'autre', label: 'Autre document', icon: '📎', domaines: [], maxPoints: 3 }
];

const REFERENTIEL = {
  'GOUVERNANCE': {
    id: 'GOUVERNANCE', ordre: 1, nom: 'Gouvernance & Pilotage', icon: '🎯',
    description: 'Mettre en place l\'organisation et les ressources nécessaires au projet de conformité',
    pourquoi: 'Sans gouvernance claire, le projet risque de manquer de légitimité et de ressources.',
    quiEstConcerne: ['direction', 'qualite', 'compliance'],
    exigences: [
      { id: 'GOV-01', titre: 'Engagement de la Direction', description: 'Formaliser l\'engagement de la Direction envers la conformité QPP',
        pourquoi: 'L\'engagement au plus haut niveau est indispensable pour mobiliser les équipes',
        commentFaire: 'Rédiger et signer une politique qualité PIP, la communiquer à tous',
        livrables: ['Politique qualité signée', 'Communication interne'], responsables: ['direction', 'qualite'],
        sousEtapes: [
          { id: 'GOV-01-a', titre: 'Rédiger la politique qualité PIP', description: 'Document d\'une page exprimant l\'engagement', obligatoire: true },
          { id: 'GOV-01-b', titre: 'Faire signer par le DG', description: 'Signature officielle du Directeur Général', obligatoire: true },
          { id: 'GOV-01-c', titre: 'Communiquer à tous les collaborateurs', description: 'Email, affichage, réunion d\'équipe', obligatoire: true }
        ]},
      { id: 'GOV-02', titre: 'Comité de pilotage', description: 'Constituer un comité de pilotage dédié au projet Charte QPP',
        pourquoi: 'Le comité assure le suivi, arbitre les décisions et maintient la dynamique',
        commentFaire: 'Identifier les membres, définir la fréquence des réunions, documenter les décisions',
        livrables: ['Liste des membres', 'Planning réunions', 'Comptes-rendus'], responsables: ['direction', 'qualite'],
        sousEtapes: [
          { id: 'GOV-02-a', titre: 'Identifier les membres du comité', description: 'Direction, Qualité, Aff. Rég., Commercial minimum', obligatoire: true },
          { id: 'GOV-02-b', titre: 'Définir la fréquence des réunions', description: 'Mensuelle recommandée en phase déploiement', obligatoire: true }
        ]},
      { id: 'GOV-03', titre: 'Responsable qualité PIP', description: 'Nommer un responsable dédié au pilotage opérationnel',
        pourquoi: 'Une personne identifiée garantit continuité et cohérence des actions',
        commentFaire: 'Désigner une personne, définir ses missions, communiquer sa nomination',
        livrables: ['Fiche de mission', 'Note de nomination'], responsables: ['direction', 'rh'],
        sousEtapes: [
          { id: 'GOV-03-a', titre: 'Identifier la personne', description: 'Profil Qualité ou Aff. Rég. recommandé', obligatoire: true },
          { id: 'GOV-03-b', titre: 'Définir la fiche de mission', description: 'Périmètre, objectifs, moyens, temps alloué', obligatoire: true },
          { id: 'GOV-03-c', titre: 'Officialiser la nomination', description: 'Communication interne', obligatoire: true }
        ]}
    ]
  },
  'DEONTOLOGIE': {
    id: 'DEONTOLOGIE', ordre: 2, nom: 'Déontologie', icon: '⚖️',
    description: 'Garantir des pratiques éthiques et transparentes avec les professionnels de santé',
    pourquoi: 'La déontologie protège l\'indépendance des PdS et la réputation de l\'entreprise.',
    quiEstConcerne: ['commercial', 'marketing', 'compliance', 'affaires_reg'],
    exigences: [
      { id: 'DEO-01', titre: 'Brochure déontologique', description: 'Créer et diffuser une brochure présentant vos engagements éthiques',
        pourquoi: 'Ce document formalise vos engagements, remis aux professionnels de santé',
        commentFaire: 'Rédiger le contenu, faire valider, imprimer et distribuer aux équipes terrain',
        livrables: ['Brochure imprimée', 'Version électronique'], responsables: ['affaires_reg', 'compliance', 'commercial'],
        sousEtapes: [
          { id: 'DEO-01-a', titre: 'Rédiger le contenu', description: 'Engagements : loyauté, indépendance, transparence', obligatoire: true },
          { id: 'DEO-01-b', titre: 'Faire valider par Direction et Compliance', description: 'Revue juridique et validation managériale', obligatoire: true },
          { id: 'DEO-01-c', titre: 'Créer la maquette graphique', description: 'Respect de la charte graphique', obligatoire: true },
          { id: 'DEO-01-d', titre: 'Distribuer aux équipes terrain', description: 'Chaque commercial doit en disposer', obligatoire: true }
        ]},
      { id: 'DEO-02', titre: 'Cartographie des avantages', description: 'Identifier et vérifier la conformité de tous les avantages offerts aux PdS',
        pourquoi: 'Obligation légale (loi anti-cadeaux). Les sanctions peuvent être pénales.',
        commentFaire: 'Lister tous les avantages, vérifier les seuils, déclarer sur Transparence Santé',
        livrables: ['Liste des avantages', 'Analyse conformité'], responsables: ['compliance', 'commercial', 'marketing'],
        sousEtapes: [
          { id: 'DEO-02-a', titre: 'Inventorier tous les avantages', description: 'Repas, cadeaux, congrès, échantillons...', obligatoire: true },
          { id: 'DEO-02-b', titre: 'Vérifier conformité aux seuils', description: 'Article L.1453-6 du CSP', obligatoire: true },
          { id: 'DEO-02-c', titre: 'Processus Transparence Santé', description: 'Déclaration obligatoire', obligatoire: true }
        ]}
    ]
  },
  'FORMATION': {
    id: 'FORMATION', ordre: 3, nom: 'Formation des équipes', icon: '🎓',
    description: 'S\'assurer que toutes les personnes impliquées sont correctement formées',
    pourquoi: 'La formation est une exigence centrale de la Charte QPP.',
    quiEstConcerne: ['rh', 'affaires_reg', 'commercial', 'marketing'],
    exigences: [
      { id: 'FOR-01', titre: 'Identification des personnes à former', description: 'Établir la liste des collaborateurs concernés',
        pourquoi: 'Impossible de former sans savoir qui. Cette liste est demandée en cas de contrôle.',
        commentFaire: 'Croiser organigrammes avec définition des activités PIP',
        livrables: ['Liste nominative', 'Critères d\'inclusion'], responsables: ['rh', 'affaires_reg'],
        sousEtapes: [
          { id: 'FOR-01-a', titre: 'Définir les critères d\'inclusion', description: 'Commerciaux, marketing, MSL, SAV...', obligatoire: true },
          { id: 'FOR-01-b', titre: 'Établir la liste nominative', description: 'Nom, prénom, fonction, BU', obligatoire: true },
          { id: 'FOR-01-c', titre: 'Processus de mise à jour', description: 'Intégrer nouveaux, retirer sortants', obligatoire: true }
        ]},
      { id: 'FOR-02', titre: 'Module réglementaire', description: 'Formation sur le cadre réglementaire',
        pourquoi: 'Socle commun obligatoire pour tous.',
        commentFaire: 'Développer ou acheter un module e-learning',
        livrables: ['Module e-learning', 'Quiz', 'Attestations'], responsables: ['affaires_reg', 'rh'],
        sousEtapes: [
          { id: 'FOR-02-a', titre: 'Choisir le mode de formation', description: 'E-learning recommandé', obligatoire: true },
          { id: 'FOR-02-b', titre: 'Développer le contenu', description: 'Interne ou prestataire', obligatoire: true },
          { id: 'FOR-02-c', titre: 'Créer le quiz d\'évaluation', description: 'Min. 10 questions, seuil 80%', obligatoire: true },
          { id: 'FOR-02-d', titre: 'Déployer et suivre', description: 'Relances automatiques', obligatoire: true }
        ]},
      { id: 'FOR-03', titre: 'Traçabilité des formations', description: 'Conserver les preuves pendant 5 ans',
        pourquoi: 'En cas de contrôle, vous devez prouver que chaque personne a été formée.',
        commentFaire: 'Centraliser attestations, archiver de manière sécurisée',
        livrables: ['Base de données', 'Attestations'], responsables: ['rh', 'qualite'],
        sousEtapes: [
          { id: 'FOR-03-a', titre: 'Choisir l\'outil de traçabilité', description: 'LMS ou SharePoint', obligatoire: true },
          { id: 'FOR-03-b', titre: 'Définir règles d\'archivage', description: '5 ans minimum', obligatoire: true }
        ]}
    ]
  },
  'INFORMATION': {
    id: 'INFORMATION', ordre: 4, nom: 'Qualité de l\'information', icon: '📄',
    description: 'Garantir que toute information diffusée est exacte et validée',
    pourquoi: 'L\'information promotionnelle est strictement encadrée.',
    quiEstConcerne: ['marketing', 'affaires_reg', 'commercial'],
    exigences: [
      { id: 'INF-01', titre: 'Inventaire des supports', description: 'Recenser tous les supports promotionnels',
        pourquoi: 'Impossible de vérifier la conformité sans savoir ce qui existe.',
        commentFaire: 'Demander à chaque BU de lister ses supports',
        livrables: ['Inventaire exhaustif'], responsables: ['marketing', 'affaires_reg'],
        sousEtapes: [
          { id: 'INF-01-a', titre: 'Définir les catégories', description: 'Brochures, fiches, vidéos...', obligatoire: true },
          { id: 'INF-01-b', titre: 'Collecter auprès des BU', description: 'Avec dates de création', obligatoire: true }
        ]},
      { id: 'INF-02', titre: 'Circuit de validation', description: 'Processus de validation avant diffusion',
        pourquoi: 'Seul un circuit formalisé garantit la conformité.',
        commentFaire: 'Définir étapes, valideurs, délais',
        livrables: ['Procédure', 'Workflow'], responsables: ['affaires_reg', 'marketing'],
        sousEtapes: [
          { id: 'INF-02-a', titre: 'Définir les étapes', description: 'Qui valide quoi ?', obligatoire: true },
          { id: 'INF-02-b', titre: 'Formaliser la procédure', description: 'Document écrit', obligatoire: true }
        ]}
    ]
  },
  'VISITES': {
    id: 'VISITES', ordre: 5, nom: 'Organisation des visites', icon: '📍',
    description: 'Encadrer les visites et assurer la traçabilité',
    pourquoi: 'La Charte impose des règles sur l\'identification et la traçabilité.',
    quiEstConcerne: ['commercial', 'it', 'qualite'],
    exigences: [
      { id: 'VIS-01', titre: 'Identification des intervenants', description: 'Chaque intervenant doit être identifié',
        pourquoi: 'Le PdS doit savoir à qui il a affaire.',
        commentFaire: 'Créer badges, définir script de présentation',
        livrables: ['Badges', 'Script'], responsables: ['commercial', 'rh'],
        sousEtapes: [
          { id: 'VIS-01-a', titre: 'Créer les badges', description: 'Nom, fonction, logo', obligatoire: true },
          { id: 'VIS-01-b', titre: 'Définir le script', description: 'Présentation en début de visite', obligatoire: true }
        ]},
      { id: 'VIS-02', titre: 'Traçabilité des visites', description: 'Documenter chaque visite dans le CRM',
        pourquoi: 'Données conservées 5 ans.',
        commentFaire: 'Paramétrer CRM, définir champs obligatoires',
        livrables: ['CRM paramétré', 'Procédure'], responsables: ['commercial', 'it'],
        sousEtapes: [
          { id: 'VIS-02-a', titre: 'Définir les champs', description: 'Date, lieu, objet...', obligatoire: true },
          { id: 'VIS-02-b', titre: 'Paramétrer le CRM', description: 'Champs obligatoires', obligatoire: true }
        ]}
    ]
  },
  'TIERS': {
    id: 'TIERS', ordre: 6, nom: 'Supervision des tiers', icon: '🤝',
    description: 'S\'assurer que les prestataires respectent la Charte',
    pourquoi: 'Vous êtes responsable de vos sous-traitants.',
    quiEstConcerne: ['achats', 'juridique', 'compliance', 'qualite'],
    exigences: [
      { id: 'TIE-01', titre: 'Cartographie des prestataires', description: 'Identifier les prestataires PIP',
        pourquoi: 'Savoir qui sont vos prestataires concernés.',
        commentFaire: 'Croiser liste avec définition activités PIP',
        livrables: ['Liste', 'Analyse risques'], responsables: ['achats', 'qualite'],
        sousEtapes: [
          { id: 'TIE-01-a', titre: 'Lister les prestataires', description: 'Agences, distributeurs...', obligatoire: true },
          { id: 'TIE-01-b', titre: 'Identifier ceux concernés', description: 'Activités PIP ?', obligatoire: true }
        ]},
      { id: 'TIE-02', titre: 'Clauses contractuelles', description: 'Intégrer des clauses QPP',
        pourquoi: 'Le contrat impose le respect de la Charte.',
        commentFaire: 'Rédiger clauses types, intégrer aux contrats',
        livrables: ['Clauses types', 'Avenants'], responsables: ['juridique', 'achats'],
        sousEtapes: [
          { id: 'TIE-02-a', titre: 'Rédiger les clauses', description: 'Engagement, audit, sanctions', obligatoire: true },
          { id: 'TIE-02-b', titre: 'Intégrer aux contrats', description: 'Nouveaux et existants', obligatoire: true }
        ]}
    ]
  },
  'QUALITE_SYS': {
    id: 'QUALITE_SYS', ordre: 7, nom: 'Système qualité', icon: '📊',
    description: 'Structurer le système de management PIP',
    pourquoi: 'Un système formalisé permet de démontrer la conformité.',
    quiEstConcerne: ['qualite', 'affaires_reg', 'direction'],
    exigences: [
      { id: 'SYS-01', titre: 'Manuel qualité PIP', description: 'Rédiger le manuel qualité',
        pourquoi: 'Document de référence.',
        commentFaire: 'Définir structure, rédiger, diffuser',
        livrables: ['Manuel qualité'], responsables: ['qualite', 'affaires_reg'],
        sousEtapes: [
          { id: 'SYS-01-a', titre: 'Définir la structure', description: 'Chapitres du manuel', obligatoire: true },
          { id: 'SYS-01-b', titre: 'Rédiger les chapitres', description: 'En cohérence avec la réalité', obligatoire: true }
        ]},
      { id: 'SYS-02', titre: 'Indicateurs de performance', description: 'Définir et suivre des KPIs',
        pourquoi: 'Mesurer l\'efficacité du système.',
        commentFaire: 'Définir indicateurs, tableau de bord',
        livrables: ['KPIs', 'Tableau de bord'], responsables: ['qualite'],
        sousEtapes: [
          { id: 'SYS-02-a', titre: 'Définir les indicateurs', description: 'Taux formation, conformité...', obligatoire: true },
          { id: 'SYS-02-b', titre: 'Créer le tableau de bord', description: 'Suivi régulier', obligatoire: true }
        ]}
    ]
  }
};

const ACTIONS_INIT = [
  { id: 'ACT-001', domaine: 'GOUVERNANCE', action: 'Rédiger et faire signer la politique qualité PIP', responsables: ['direction', 'qualite'], echeance: '2026-02-28', priorite: 'Critique', statut: 'Non démarré', commentaire: '' },
  { id: 'ACT-002', domaine: 'GOUVERNANCE', action: 'Constituer le comité de pilotage Charte QPP', responsables: ['direction'], echeance: '2026-01-31', priorite: 'Critique', statut: 'En cours', commentaire: 'Réunion lancement prévue' },
  { id: 'ACT-003', domaine: 'DEONTOLOGIE', action: 'Créer et diffuser la brochure déontologique', responsables: ['affaires_reg', 'compliance'], echeance: '2026-03-31', priorite: 'Haute', statut: 'En cours', commentaire: '' },
  { id: 'ACT-004', domaine: 'FORMATION', action: 'Établir la liste des personnes à former', responsables: ['rh', 'affaires_reg'], echeance: '2026-02-15', priorite: 'Critique', statut: 'Terminé', commentaire: 'Liste finalisée' },
  { id: 'ACT-005', domaine: 'FORMATION', action: 'Développer le module réglementaire', responsables: ['affaires_reg', 'rh'], echeance: '2026-05-31', priorite: 'Critique', statut: 'Non démarré', commentaire: '' },
  { id: 'ACT-006', domaine: 'INFORMATION', action: 'Définir le circuit de validation des supports', responsables: ['affaires_reg', 'marketing'], echeance: '2026-04-15', priorite: 'Critique', statut: 'Non démarré', commentaire: '' },
  { id: 'ACT-007', domaine: 'VISITES', action: 'Paramétrer le CRM pour la traçabilité', responsables: ['it', 'commercial'], echeance: '2026-05-31', priorite: 'Haute', statut: 'Non démarré', commentaire: '' },
  { id: 'ACT-008', domaine: 'TIERS', action: 'Rédiger les clauses contractuelles QPP', responsables: ['juridique', 'achats'], echeance: '2026-05-31', priorite: 'Moyenne', statut: 'Non démarré', commentaire: '' },
  { id: 'ACT-009', domaine: 'QUALITE_SYS', action: 'Rédiger le manuel qualité PIP', responsables: ['qualite'], echeance: '2026-04-30', priorite: 'Haute', statut: 'Non démarré', commentaire: '' }
];

// Simulations d'analyses IA
const AI_ANALYSES = {
  charte_qpp: {
    score: 78,
    conformes: ['Engagement direction présent', 'Périmètre produits défini', 'Principes déontologiques mentionnés'],
    manquants: ['Processus de mise à jour non défini', 'Signature DG absente'],
    recommandations: ['Ajouter une clause de révision annuelle', 'Faire signer par le Directeur Général', 'Préciser les sanctions en cas de non-respect'],
    exigencesCouvertes: ['GOV-01', 'DEO-01']
  },
  formation_support: {
    score: 65,
    conformes: ['Cadre réglementaire LPPR couvert', 'Quiz d\'évaluation présent'],
    manquants: ['Principes déontologiques insuffisants', 'Pas de cas pratiques', 'Durée non conforme (< 2h)'],
    recommandations: ['Ajouter un module sur la loi anti-cadeaux', 'Intégrer des mises en situation', 'Prévoir au moins 2h de formation'],
    exigencesCouvertes: ['FOR-02']
  },
  attestation_formation: {
    score: 90,
    conformes: ['Nom du formé', 'Date de formation', 'Contenu couvert', 'Signature'],
    manquants: ['Score au quiz non mentionné'],
    recommandations: ['Ajouter le score obtenu au quiz', 'Préciser la durée effective'],
    exigencesCouvertes: ['FOR-03']
  },
  contrat_distributeur: {
    score: 45,
    conformes: ['Identification des parties', 'Périmètre géographique'],
    manquants: ['Clause QPP absente', 'Obligation de formation non mentionnée', 'Droit d\'audit absent', 'Clause de résiliation QPP absente'],
    recommandations: ['Ajouter une clause d\'engagement Charte QPP', 'Prévoir l\'obligation de formation des équipes', 'Intégrer un droit d\'audit annuel', 'Prévoir la résiliation en cas de manquement'],
    exigencesCouvertes: []
  },
  procedure_visite: {
    score: 72,
    conformes: ['Identification du visiteur', 'Prise de RDV décrite', 'Traçabilité CRM mentionnée'],
    manquants: ['Gestion des échantillons non couverte', 'Règles sur les avantages absentes'],
    recommandations: ['Ajouter une section sur la remise d\'échantillons', 'Préciser les règles sur les repas/cadeaux'],
    exigencesCouvertes: ['VIS-01', 'VIS-02']
  },
  cr_comite: {
    score: 85,
    conformes: ['Date et participants', 'Ordre du jour', 'Décisions tracées'],
    manquants: ['Actions avec échéances non systématiques'],
    recommandations: ['Formaliser un tableau de suivi des actions'],
    exigencesCouvertes: ['GOV-02']
  },
  brochure_deonto: {
    score: 88,
    conformes: ['Engagements clairs', 'Indépendance du PdS mentionnée', 'Contact référent indiqué'],
    manquants: ['QR code vers version digitale absent'],
    recommandations: ['Ajouter un QR code pour accès mobile'],
    exigencesCouvertes: ['DEO-01']
  },
  procedure_validation: {
    score: 70,
    conformes: ['Étapes de validation définies', 'Rôles identifiés'],
    manquants: ['Délais non précisés', 'Critères de validation flous', 'Archivage non décrit'],
    recommandations: ['Définir des SLA par étape', 'Créer une checklist de validation', 'Décrire le processus d\'archivage'],
    exigencesCouvertes: ['INF-02']
  },
  organigramme: {
    score: 60,
    conformes: ['Responsable QPP identifié'],
    manquants: ['Liens hiérarchiques QPP flous', 'Suppléants non définis'],
    recommandations: ['Clarifier le rattachement du responsable QPP', 'Identifier des suppléants'],
    exigencesCouvertes: ['GOV-03']
  },
  autre: {
    score: 50,
    conformes: ['Document reçu'],
    manquants: ['Analyse manuelle requise'],
    recommandations: ['Faire analyser par un expert BearingPoint'],
    exigencesCouvertes: []
  }
};

// Questions/réponses IA simulées
const AI_QA_RESPONSES = [
  { keywords: ['distributeur', 'belgique', 'étranger', 'europe'], answer: "Oui, un distributeur basé en Belgique qui vend des produits LPPR en France est soumis à la Charte QPP. L'arrêté du 4 mars 2022 s'applique à toute personne qui assure la présentation, l'information ou la promotion de ces produits sur le territoire français, quelle que soit sa localisation.\n\n📖 Source : Arrêté du 4 mars 2022, Article 1er" },
  { keywords: ['échantillon', 'cadre de santé', 'infirmier'], answer: "La remise d'échantillons à un cadre de santé est encadrée. Selon la Charte QPP, les échantillons ne peuvent être remis qu'aux professionnels de santé habilités à prescrire ou utiliser le dispositif médical concerné.\n\nUn cadre de santé peut recevoir des échantillons s'il participe directement aux soins ou à l'évaluation des produits.\n\n📖 Source : Arrêté du 4 mars 2022, Article 5.3" },
  { keywords: ['information', 'promotion', 'différence'], answer: "La distinction est importante :\n\n• **Information médicale** : données objectives, équilibrées, basées sur des preuves scientifiques, sans incitation à l'achat\n\n• **Promotion** : tout message visant à favoriser la prescription, l'achat ou l'utilisation du produit\n\nLa Charte QPP encadre les deux, mais avec des exigences différentes. L'information doit être validée par les Affaires Réglementaires.\n\n📖 Source : Arrêté du 4 mars 2022, Article 4" },
  { keywords: ['sanction', 'amende', 'pénalité', 'risque'], answer: "Les sanctions en cas de non-conformité à la Charte QPP peuvent atteindre :\n\n🔴 **Jusqu'à 10% du CA annuel** réalisé en France sur les produits concernés\n\n🔴 **Sanctions pénales** possibles en cas de violation de la loi anti-cadeaux (jusqu'à 2 ans d'emprisonnement et 150 000€ d'amende)\n\n🔴 **Déréférencement LPPR** possible\n\n📖 Source : Article L.162-17-8 du CSS, Article L.1453-1 du CSP" },
  { keywords: ['formation', 'durée', 'fréquence', 'obligatoire'], answer: "La Charte QPP exige une formation pour toute personne participant aux activités PIP :\n\n• **Formation initiale** : avant toute activité PIP\n• **Contenu minimum** : cadre réglementaire, déontologie, qualité de l'information\n• **Évaluation** : quiz ou test de validation\n• **Recyclage** : recommandé tous les 2 ans ou lors de changements réglementaires\n• **Traçabilité** : conservation 5 ans minimum\n\n📖 Source : Arrêté du 4 mars 2022, Article 6" },
  { keywords: ['comité', 'pilotage', 'composition', 'membre'], answer: "Le comité de pilotage QPP devrait inclure au minimum :\n\n• **Direction Générale** (sponsor)\n• **Responsable Qualité/Compliance**\n• **Affaires Réglementaires**\n• **Direction Commerciale**\n• **RH** (pour la formation)\n\nFréquence recommandée : mensuelle en phase de déploiement, trimestrielle ensuite.\n\n📖 Source : Bonnes pratiques sectorielles (SNITEM)" }
];

const LIVRABLE_TEMPLATES = {
  charte: {
    titre: 'Charte QPP Interne',
    sections: ['Engagement de la Direction', 'Périmètre d\'application', 'Principes déontologiques', 'Organisation et gouvernance', 'Formation', 'Contrôle et audit', 'Sanctions', 'Révision']
  },
  procedure_visite: {
    titre: 'Procédure de Visite Médicale',
    sections: ['Objet et périmètre', 'Préparation de la visite', 'Identification', 'Déroulement', 'Remise de documentation', 'Échantillons', 'Traçabilité CRM', 'Cas particuliers']
  },
  procedure_formation: {
    titre: 'Procédure de Formation PIP',
    sections: ['Personnes concernées', 'Contenu obligatoire', 'Modalités', 'Évaluation', 'Traçabilité', 'Mise à jour des compétences']
  }
};

// ============================================================================
// COMPOSANTS UI
// ============================================================================

const ProgressRing = ({ progress, size = 100 }) => {
  const r = (size - 10) / 2, c = r * 2 * Math.PI, o = c - (progress / 100) * c;
  const col = progress >= 80 ? COLORS.success : progress >= 50 ? COLORS.warning : COLORS.error;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.lightGray} strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={10} strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.26, fontWeight: '700', color: COLORS.white }}>{Math.round(progress)}%</div>
    </div>
  );
};

const Badge = ({ children, variant = 'default', size = 'medium' }) => {
  const v = { default: { bg: COLORS.lightGray, c: COLORS.dark }, success: { bg: COLORS.successLight, c: COLORS.success }, warning: { bg: COLORS.warningLight, c: COLORS.warning }, error: { bg: COLORS.errorLight, c: COLORS.error }, info: { bg: COLORS.infoLight, c: COLORS.info }, primary: { bg: COLORS.errorLight, c: COLORS.primary }, ai: { bg: COLORS.aiLight, c: COLORS.ai } }[variant] || { bg: COLORS.lightGray, c: COLORS.dark };
  const s = size === 'small' ? { p: '3px 8px', f: '11px' } : { p: '5px 12px', f: '12px' };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: s.p, borderRadius: '20px', fontSize: s.f, fontWeight: '600', backgroundColor: v.bg, color: v.c, whiteSpace: 'nowrap' }}>{children}</span>;
};

const Card = ({ children, title, subtitle, icon, headerRight, onClick, style, variant }) => (
  <div onClick={onClick} style={{ backgroundColor: variant === 'ai' ? COLORS.aiLight : COLORS.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${variant === 'ai' ? COLORS.ai : COLORS.lightGray}`, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s', ...style }}>
    {(title || headerRight) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: subtitle ? '8px' : '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: variant === 'ai' ? COLORS.ai : COLORS.dark }}>{title}</h3>}
        </div>
        {headerRight}
      </div>
    )}
    {subtitle && <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: COLORS.warmGray, lineHeight: '1.5' }}>{subtitle}</p>}
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled, icon, fullWidth }) => {
  const v = { primary: { bg: COLORS.primary, c: COLORS.white }, secondary: { bg: COLORS.white, c: COLORS.primary, b: `2px solid ${COLORS.primary}` }, ghost: { bg: 'transparent', c: COLORS.warmGray }, ai: { bg: COLORS.ai, c: COLORS.white } }[variant];
  const s = { small: { p: '8px 16px', f: '13px' }, medium: { p: '12px 24px', f: '14px' }, large: { p: '16px 32px', f: '16px' } }[size];
  return <button onClick={onClick} disabled={disabled} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: disabled ? COLORS.lightGray : v.bg, color: disabled ? COLORS.warmGray : v.c, border: v.b || 'none', borderRadius: '10px', padding: s.p, fontSize: s.f, fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', width: fullWidth ? '100%' : 'auto', transition: 'all 0.2s' }}>{icon && <span>{icon}</span>}{children}</button>;
};

const Select = ({ value, onChange, options, style }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: '12px 36px 12px 16px', borderRadius: '10px', border: `1px solid ${COLORS.lightGray}`, fontSize: '14px', backgroundColor: COLORS.white, cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2398847A' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', ...style }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Input = ({ value, onChange, placeholder, type = 'text', style }) => (
  <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${COLORS.lightGray}`, fontSize: '14px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', ...style }} />
);

const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${COLORS.lightGray}`, fontSize: '14px', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }} />
);

const Modal = ({ isOpen, onClose, title, subtitle, children, width = '700px' }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(45, 41, 38, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: COLORS.white, borderRadius: '20px', width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.lightGray}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>{title}</h2>{subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: COLORS.warmGray }}>{subtitle}</p>}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: COLORS.warmGray, padding: '0 4px' }}>×</button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

const InfoBox = ({ type = 'info', title, children }) => {
  const t = { info: { bg: COLORS.infoLight, b: COLORS.info, i: 'ℹ️' }, warning: { bg: COLORS.warningLight, b: COLORS.warning, i: '⚠️' }, success: { bg: COLORS.successLight, b: COLORS.success, i: '✅' }, tip: { bg: '#F3E5F5', b: '#7B1FA2', i: '💡' }, ai: { bg: COLORS.aiLight, b: COLORS.ai, i: '🤖' } }[type];
  return (
    <div style={{ padding: '16px 20px', backgroundColor: t.bg, borderLeft: `4px solid ${t.b}`, borderRadius: '0 12px 12px 0', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '18px' }}>{t.i}</span>
        <div style={{ flex: 1 }}>{title && <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>}<div style={{ fontSize: '14px', lineHeight: '1.6' }}>{children}</div></div>
      </div>
    </div>
  );
};

const AITypingIndicator = () => (
  <div style={{ display: 'flex', gap: '4px', padding: '12px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.ai, animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite` }} />
    ))}
    <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }`}</style>
  </div>
);

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const QPPComplianceTracker = () => {
  const [tab, setTab] = useState('accueil');
  const [domain, setDomain] = useState(null);
  const [exigence, setExigence] = useState(null);
  const [fonctionFilter, setFonctionFilter] = useState('all');
  const [actions, setActions] = useState(ACTIONS_INIT);
  const [evals, setEvals] = useState({});
  const [editAction, setEditAction] = useState(null);
  const [newAction, setNewAction] = useState(null);
  
  // États IA
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Calcul des stats incluant les points documents
  const stats = useMemo(() => {
    const doms = Object.values(REFERENTIEL);
    const allSE = doms.flatMap(d => d.exigences.flatMap(e => e.sousEtapes || []));
    const conf = allSE.filter(se => evals[se.id] === 'conforme').length;
    
    // Points des documents
    const docPoints = documents.reduce((acc, doc) => {
      if (doc.analysis) {
        return acc + Math.round((doc.analysis.score / 100) * doc.maxPoints);
      }
      return acc;
    }, 0);
    const maxDocPoints = documents.reduce((acc, doc) => acc + doc.maxPoints, 0);
    
    // Score combiné
    const evalScore = allSE.length > 0 ? (conf / allSE.length) * 100 : 0;
    const docScore = maxDocPoints > 0 ? (docPoints / maxDocPoints) * 100 : 0;
    const hasEvals = Object.keys(evals).length > 0;
    const hasDocs = documents.length > 0;
    
    let combinedScore = 0;
    if (hasEvals && hasDocs) {
      combinedScore = (evalScore * 0.6) + (docScore * 0.4);
    } else if (hasEvals) {
      combinedScore = evalScore;
    } else if (hasDocs) {
      combinedScore = docScore;
    }
    
    const domStats = {};
    doms.forEach(d => {
      const dSE = d.exigences.flatMap(e => e.sousEtapes || []);
      const dConf = dSE.filter(se => evals[se.id] === 'conforme').length;
      const domDocs = documents.filter(doc => doc.analysis?.exigencesCouvertes?.some(e => d.exigences.some(ex => ex.id === e)));
      const domDocScore = domDocs.length > 0 ? domDocs.reduce((a, doc) => a + doc.analysis.score, 0) / domDocs.length : 0;
      const baseScore = dSE.length > 0 ? (dConf / dSE.length) * 100 : 0;
      domStats[d.id] = { 
        score: domDocs.length > 0 ? Math.round((baseScore + domDocScore) / 2) : Math.round(baseScore), 
        conf: dConf, 
        total: dSE.length,
        docs: domDocs.length
      };
    });
    
    const aStats = { total: actions.length, done: actions.filter(a => a.statut === 'Terminé').length, prog: actions.filter(a => a.statut === 'En cours').length, late: actions.filter(a => new Date(a.echeance) < new Date() && a.statut !== 'Terminé').length };
    
    return { score: Math.round(combinedScore), conf, total: allSE.length, domStats, aStats, docPoints, maxDocPoints, docsCount: documents.length };
  }, [evals, actions, documents]);

  const filteredActions = useMemo(() => fonctionFilter === 'all' ? actions : actions.filter(a => a.responsables.includes(fonctionFilter)), [actions, fonctionFilter]);
  const getFonctionLabel = (id) => FONCTIONS.find(f => f.id === id)?.label || id;
  const getFonctionIcon = (id) => FONCTIONS.find(f => f.id === id)?.icon || '👤';

  // Simulation d'analyse de document
  const analyzeDocument = (doc) => {
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = AI_ANALYSES[doc.type] || AI_ANALYSES.autre;
      const analyzedDoc = { ...doc, analysis, analyzedAt: new Date().toISOString() };
      setDocuments(prev => prev.map(d => d.id === doc.id ? analyzedDoc : d));
      setSelectedDoc(analyzedDoc);
      setAnalyzing(false);
    }, 2000);
  };

  // Upload de document
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const docType = DOCUMENT_TYPES.find(t => 
      file.name.toLowerCase().includes(t.id.replace('_', ' ')) ||
      file.name.toLowerCase().includes(t.id.replace('_', '-'))
    ) || DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1];
    
    const newDoc = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      type: docType.id,
      typeLabel: docType.label,
      typeIcon: docType.icon,
      maxPoints: docType.maxPoints,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      analysis: null
    };
    
    setDocuments(prev => [...prev, newDoc]);
    analyzeDocument(newDoc);
    e.target.value = '';
  };

  // Chat IA
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    setTimeout(() => {
      const input = chatInput.toLowerCase();
      let response = AI_QA_RESPONSES.find(r => r.keywords.some(k => input.includes(k)));
      
      if (!response) {
        response = {
          answer: "Je comprends votre question. Pour une réponse précise et contextualisée, je vous recommande de consulter l'arrêté du 4 mars 2022 ou de contacter votre référent BearingPoint.\n\nPuis-je vous aider sur un autre sujet ?\n\n💡 Exemples de questions que je peux traiter :\n• Obligations de formation\n• Sanctions encourues\n• Composition du comité de pilotage\n• Différence information/promotion"
        };
      }
      
      const aiMessage = { role: 'assistant', content: response.answer };
      setChatMessages(prev => [...prev, aiMessage]);
      setChatLoading(false);
      
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 1500);
  };

  // Génération de livrable
  const generateLivrable = (type) => {
    setGenerating(true);
    setGeneratedContent('');
    
    const template = LIVRABLE_TEMPLATES[type];
    let content = `# ${template.titre}\n\n`;
    content += `**Document généré le ${new Date().toLocaleDateString('fr-FR')}**\n\n`;
    content += `---\n\n`;
    
    template.sections.forEach((section, i) => {
      content += `## ${i + 1}. ${section}\n\n`;
      content += `[Contenu à personnaliser selon le contexte de votre organisation]\n\n`;
    });
    
    content += `---\n\n`;
    content += `📖 *Ce document est une base de travail générée par l'assistant IA QPP.*\n`;
    content += `*Il doit être adapté et validé par vos équipes avant utilisation.*\n`;
    content += `*Pour un accompagnement personnalisé, contactez BearingPoint.*`;
    
    let index = 0;
    const interval = setInterval(() => {
      setGeneratedContent(content.substring(0, index));
      index += 5;
      if (index >= content.length) {
        clearInterval(interval);
        setGenerating(false);
        setGeneratedContent(content);
      }
    }, 10);
  };

  // ============================================================================
  // PAGE ACCUEIL
  // ============================================================================
  const renderAccueil = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Card style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, color: COLORS.white, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>QPP Compliance Tracker</h1>
              <Badge variant="ai" size="small">✨ IA Enhanced</Badge>
            </div>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Votre assistant intelligent de mise en conformité Charte QPP</p>
          </div>
          <ProgressRing progress={stats.score} size={100} />
        </div>
      </Card>

      {/* Section IA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <Card variant="ai" title="🤖 Assistant IA" subtitle="Posez vos questions sur la réglementation QPP">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="ai" fullWidth icon="💬" onClick={() => setTab('assistant')}>Ouvrir l'assistant</Button>
            <div style={{ fontSize: '13px', color: COLORS.ai }}>
              Exemples : "Sanctions encourues ?", "Durée de formation ?"
            </div>
          </div>
        </Card>
        
        <Card variant="ai" title="📄 Analyse de documents" subtitle="Uploadez vos documents pour un diagnostic automatique">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="ai" fullWidth icon="📤" onClick={() => setTab('documents')}>Analyser des documents</Button>
            <div style={{ fontSize: '13px', color: COLORS.ai }}>
              {stats.docsCount} document{stats.docsCount > 1 ? 's' : ''} analysé{stats.docsCount > 1 ? 's' : ''} • {stats.docPoints} pts
            </div>
          </div>
        </Card>
      </div>

      {/* Sélecteur de fonction */}
      <Card title="🎯 Mon espace" subtitle="Sélectionnez votre fonction pour personnaliser l'affichage" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {FONCTIONS.slice(0, 8).map(f => (
            <div key={f.id} onClick={() => { setFonctionFilter(f.id); setTab('actions'); }} style={{ padding: '14px 12px', borderRadius: '12px', border: `2px solid ${fonctionFilter === f.id ? COLORS.primary : COLORS.lightGray}`, backgroundColor: fonctionFilter === f.id ? COLORS.errorLight : COLORS.white, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{f.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: fonctionFilter === f.id ? COLORS.primary : COLORS.dark }}>{f.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats et domaines */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Card title="📋 Domaines de conformité">
          <div style={{ display: 'grid', gap: '10px' }}>
            {Object.values(REFERENTIEL).sort((a, b) => a.ordre - b.ordre).map(d => {
              const ds = stats.domStats[d.id];
              return (
                <div key={d.id} onClick={() => { setDomain(d.id); setTab('referentiel'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', backgroundColor: COLORS.background, cursor: 'pointer' }}>
                  <span style={{ fontSize: '22px' }}>{d.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: '600', fontSize: '14px' }}>{d.nom}</div></div>
                  {ds.docs > 0 && <Badge variant="ai" size="small">📄 {ds.docs}</Badge>}
                  <div style={{ width: '80px' }}><div style={{ height: '6px', backgroundColor: COLORS.lightGray, borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${ds.score}%`, height: '100%', backgroundColor: ds.score >= 80 ? COLORS.success : ds.score >= 50 ? COLORS.warning : COLORS.error }} /></div></div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: ds.score >= 80 ? COLORS.success : ds.score >= 50 ? COLORS.warning : COLORS.error, minWidth: '40px', textAlign: 'right' }}>{ds.score}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.success }}>{stats.aStats.done}</div>
              <div style={{ fontSize: '13px', color: COLORS.warmGray }}>Actions terminées</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.error }}>{stats.aStats.late}</div>
              <div style={{ fontSize: '13px', color: COLORS.warmGray }}>En retard</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.ai }}>{stats.docsCount}</div>
              <div style={{ fontSize: '13px', color: COLORS.warmGray }}>Documents analysés</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // PAGE DOCUMENTS (IA)
  // ============================================================================
  const renderDocuments = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="ai">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" style={{ display: 'none' }} />
          <Button variant="ai" fullWidth icon="📤" size="large" onClick={() => fileInputRef.current?.click()}>
            Uploader un document
          </Button>
          <div style={{ marginTop: '12px', fontSize: '12px', color: COLORS.ai, textAlign: 'center' }}>
            PDF, Word, PowerPoint, Excel
          </div>
        </Card>

        <Card title="📁 Documents analysés" subtitle={`${documents.length} document${documents.length > 1 ? 's' : ''}`}>
          {documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: COLORS.warmGray }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
              <div>Aucun document</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Uploadez votre premier document</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map(doc => (
                <div key={doc.id} onClick={() => setSelectedDoc(doc)} style={{ 
                  padding: '12px', 
                  borderRadius: '10px', 
                  backgroundColor: selectedDoc?.id === doc.id ? COLORS.aiLight : COLORS.background,
                  border: `1px solid ${selectedDoc?.id === doc.id ? COLORS.ai : 'transparent'}`,
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{doc.typeIcon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                      <div style={{ fontSize: '11px', color: COLORS.warmGray }}>{doc.typeLabel}</div>
                    </div>
                    {doc.analysis && (
                      <Badge variant={doc.analysis.score >= 80 ? 'success' : doc.analysis.score >= 50 ? 'warning' : 'error'} size="small">
                        {doc.analysis.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="📊 Score documentaire">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: COLORS.ai }}>{stats.docPoints}</div>
            <div style={{ fontSize: '13px', color: COLORS.warmGray }}>points sur {stats.maxDocPoints} possibles</div>
          </div>
        </Card>
      </div>

      {/* Zone principale */}
      <div>
        {analyzing ? (
          <Card variant="ai">
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
              <h3 style={{ margin: '0 0 12px 0', color: COLORS.ai }}>Analyse en cours...</h3>
              <AITypingIndicator />
              <p style={{ margin: '20px 0 0 0', color: COLORS.warmGray }}>L'IA examine votre document</p>
            </div>
          </Card>
        ) : selectedDoc?.analysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '40px' }}>{selectedDoc.typeIcon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedDoc.name}</h2>
                    <div style={{ fontSize: '14px', color: COLORS.warmGray }}>{selectedDoc.typeLabel}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: selectedDoc.analysis.score >= 80 ? COLORS.success : selectedDoc.analysis.score >= 50 ? COLORS.warning : COLORS.error }}>
                    {selectedDoc.analysis.score}%
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.warmGray }}>Score conformité</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: COLORS.success, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span> Points conformes
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {selectedDoc.analysis.conformes.map((c, i) => (
                      <li key={i} style={{ marginBottom: '6px', fontSize: '14px' }}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: COLORS.error, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>❌</span> Points manquants
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {selectedDoc.analysis.manquants.map((m, i) => (
                      <li key={i} style={{ marginBottom: '6px', fontSize: '14px' }}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card variant="ai" title="🤖 Recommandations IA">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedDoc.analysis.recommandations.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', backgroundColor: COLORS.white, borderRadius: '8px' }}>
                    <span style={{ color: COLORS.ai }}>💡</span>
                    <span style={{ fontSize: '14px' }}>{r}</span>
                  </div>
                ))}
              </div>
            </Card>

            {selectedDoc.analysis.exigencesCouvertes.length > 0 && (
              <Card title="📋 Exigences couvertes par ce document">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedDoc.analysis.exigencesCouvertes.map(e => (
                    <Badge key={e} variant="success">{e}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <div style={{ textAlign: 'center', padding: '80px 40px', color: COLORS.warmGray }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
              <h3 style={{ margin: '0 0 12px 0', color: COLORS.dark }}>Analysez vos documents</h3>
              <p style={{ margin: '0 0 24px 0' }}>L'IA examine automatiquement vos documents et identifie les points de conformité et les lacunes.</p>
              <Button variant="ai" icon="📤" onClick={() => fileInputRef.current?.click()}>Uploader un document</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // PAGE ASSISTANT IA
  // ============================================================================
  const renderAssistant = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', height: 'calc(100vh - 250px)', minHeight: '500px' }}>
      {/* Chat */}
      <Card style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.lightGray}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.ai, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Assistant QPP</h3>
            <div style={{ fontSize: '12px', color: COLORS.warmGray }}>Posez vos questions sur la réglementation</div>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: COLORS.warmGray }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
              <h3 style={{ margin: '0 0 8px 0', color: COLORS.dark }}>Bonjour !</h3>
              <p style={{ margin: 0 }}>Je suis votre assistant QPP. Posez-moi vos questions sur la Charte des pratiques professionnelles.</p>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '80%', 
                padding: '14px 18px', 
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: msg.role === 'user' ? COLORS.primary : COLORS.aiLight,
                color: msg.role === 'user' ? COLORS.white : COLORS.dark
              }}>
                <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '14px 18px', borderRadius: '16px 16px 16px 4px', backgroundColor: COLORS.aiLight }}>
                <AITypingIndicator />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.lightGray}`, display: 'flex', gap: '12px' }}>
          <Input 
            value={chatInput} 
            onChange={setChatInput} 
            placeholder="Posez votre question..." 
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
          />
          <Button variant="ai" icon="📤" onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading}>Envoyer</Button>
        </div>
      </Card>

      {/* Sidebar avec suggestions et génération */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card title="💡 Questions suggérées">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Quelles sanctions en cas de non-conformité ?', 'Durée et fréquence des formations ?', 'Composition du comité de pilotage ?', 'Différence information/promotion ?'].map((q, i) => (
              <div key={i} onClick={() => { setChatInput(q); }} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: COLORS.background, cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s' }}>
                {q}
              </div>
            ))}
          </div>
        </Card>

        <Card variant="ai" title="📝 Générer un livrable">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant="secondary" fullWidth size="small" onClick={() => setShowGenerator('charte')}>
              📜 Draft Charte QPP
            </Button>
            <Button variant="secondary" fullWidth size="small" onClick={() => setShowGenerator('procedure_visite')}>
              📍 Procédure de visite
            </Button>
            <Button variant="secondary" fullWidth size="small" onClick={() => setShowGenerator('procedure_formation')}>
              🎓 Procédure formation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // PAGE RÉFÉRENTIEL
  // ============================================================================
  const renderReferentiel = () => {
    const doms = Object.values(REFERENTIEL).sort((a, b) => a.ordre - b.ordre);
    const curDom = domain ? REFERENTIEL[domain] : null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
        <Card>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: COLORS.warmGray, textTransform: 'uppercase' }}>Domaines</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {doms.map(d => {
              const sel = domain === d.id; const ds = stats.domStats[d.id];
              return (
                <div key={d.id} onClick={() => { setDomain(d.id); setExigence(null); }} style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: sel ? COLORS.primary : COLORS.background, color: sel ? COLORS.white : COLORS.dark, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}><span style={{ fontSize: '20px' }}>{d.icon}</span><span style={{ fontWeight: '600', fontSize: '14px' }}>{d.nom}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.85 }}><span>{d.exigences.length} exig.</span><span style={{ fontWeight: '600' }}>{ds.score}%</span></div>
                </div>
              );
            })}
          </div>
        </Card>
        <div style={{ display: 'grid', gap: '20px' }}>
          {!curDom ? (
            <Card><div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.warmGray }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div><h3 style={{ margin: '0 0 8px 0', color: COLORS.dark }}>Sélectionnez un domaine</h3></div></Card>
          ) : (
            <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '40px' }}>{curDom.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{curDom.ordre}. {curDom.nom}</h2>
                    <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: COLORS.warmGray }}>{curDom.description}</p>
                    <InfoBox type="tip" title="Pourquoi c'est important ?">{curDom.pourquoi}</InfoBox>
                  </div>
                </div>
              </Card>
              <Card title="Exigences">
                <div style={{ display: 'grid', gap: '12px' }}>
                  {curDom.exigences.map(ex => {
                    const se = ex.sousEtapes || []; const conf = se.filter(s => evals[s.id] === 'conforme').length;
                    const prog = se.length > 0 ? Math.round((conf / se.length) * 100) : 0;
                    const exp = exigence === ex.id;
                    return (
                      <div key={ex.id} style={{ border: `1px solid ${exp ? COLORS.primary : COLORS.lightGray}`, borderRadius: '12px', overflow: 'hidden' }}>
                        <div onClick={() => setExigence(exp ? null : ex.id)} style={{ padding: '16px 20px', cursor: 'pointer', backgroundColor: exp ? COLORS.errorLight : COLORS.background, display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Badge variant="primary">{ex.id}</Badge>
                          <div style={{ flex: 1 }}><div style={{ fontWeight: '600', fontSize: '15px' }}>{ex.titre}</div></div>
                          <div style={{ fontWeight: '700', color: prog >= 80 ? COLORS.success : prog >= 50 ? COLORS.warning : COLORS.error }}>{prog}%</div>
                          <span style={{ fontSize: '20px', color: COLORS.warmGray, transform: exp ? 'rotate(90deg)' : 'none' }}>›</span>
                        </div>
                        {exp && (
                          <div style={{ padding: '20px', borderTop: `1px solid ${COLORS.lightGray}` }}>
                            <InfoBox type="info" title="Pourquoi ?">{ex.pourquoi}</InfoBox>
                            <div style={{ backgroundColor: COLORS.background, borderRadius: '12px', padding: '16px' }}>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Sous-étapes ({conf}/{se.length})</h4>
                              <div style={{ display: 'grid', gap: '8px' }}>
                                {se.map(s => (
                                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: COLORS.white, borderRadius: '8px' }}>
                                    <div style={{ flex: 1, fontSize: '14px' }}>{s.titre}</div>
                                    <Select value={evals[s.id] || ''} onChange={(v) => setEvals(prev => ({ ...prev, [s.id]: v }))} options={[{ value: '', label: '⬜' }, { value: 'conforme', label: '✅' }, { value: 'en_cours', label: '🔄' }, { value: 'non_conforme', label: '❌' }]} style={{ minWidth: '80px', fontSize: '13px' }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // PAGE ACTIONS
  // ============================================================================
  const renderActions = () => {
    const pOrder = { 'Critique': 0, 'Haute': 1, 'Moyenne': 2, 'Basse': 3 };
    const sorted = [...filteredActions].sort((a, b) => {
      if (a.statut === 'Terminé' && b.statut !== 'Terminé') return 1;
      if (a.statut !== 'Terminé' && b.statut === 'Terminé') return -1;
      return pOrder[a.priorite] - pOrder[b.priorite] || new Date(a.echeance) - new Date(b.echeance);
    });
    const myCount = fonctionFilter !== 'all' ? filteredActions.length : null;

    return (
      <div>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div><label style={{ display: 'block', fontSize: '12px', color: COLORS.warmGray, marginBottom: '6px', fontWeight: '600' }}>FILTRER PAR FONCTION</label><Select value={fonctionFilter} onChange={setFonctionFilter} options={FONCTIONS.map(f => ({ value: f.id, label: `${f.icon} ${f.label}` }))} style={{ minWidth: '250px' }} /></div>
            {myCount !== null && <Badge variant="primary">{myCount} action{myCount > 1 ? 's' : ''}</Badge>}
            <div style={{ flex: 1 }} />
            <Button variant="secondary" icon="📥" onClick={() => {
              const headers = ['ID', 'Action', 'Domaine', 'Responsables', 'Échéance', 'Priorité', 'Statut', 'Commentaire'];
              const rows = filteredActions.map(a => [a.id, a.action, REFERENTIEL[a.domaine]?.nom || a.domaine, a.responsables.map(r => getFonctionLabel(r)).join(', '), new Date(a.echeance).toLocaleDateString('fr-FR'), a.priorite, a.statut, a.commentaire]);
              const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
              const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `plan-actions-qpp-${new Date().toISOString().split('T')[0]}.csv`; link.click();
            }}>Export Excel</Button>
            <Button icon="➕" onClick={() => setNewAction({ domaine: 'GOUVERNANCE', action: '', responsables: [], echeance: '', priorite: 'Moyenne', statut: 'Non démarré', commentaire: '' })}>Nouvelle action</Button>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'grid', gap: '12px' }}>
            {sorted.map(a => {
              const late = new Date(a.echeance) < new Date() && a.statut !== 'Terminé';
              const dom = REFERENTIEL[a.domaine];
              return (
                <div key={a.id} onClick={() => setEditAction(a)} style={{ padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', backgroundColor: a.statut === 'Terminé' ? COLORS.successLight : late ? COLORS.errorLight : COLORS.background, border: `1px solid ${late ? COLORS.error : 'transparent'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <span style={{ fontSize: '24px' }}>{dom?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>{a.action}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Badge variant={a.priorite === 'Critique' ? 'error' : a.priorite === 'Haute' ? 'warning' : 'info'} size="small">{a.priorite}</Badge>
                        <Badge size="small">{dom?.nom}</Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: late ? COLORS.error : COLORS.dark, marginBottom: '8px' }}>{new Date(a.echeance).toLocaleDateString('fr-FR')}</div>
                      <Select value={a.statut} onClick={(e) => e.stopPropagation()} onChange={(v) => setActions(prev => prev.map(x => x.id === a.id ? { ...x, statut: v } : x))} options={[{ value: 'Non démarré', label: '⬜' }, { value: 'En cours', label: '🔄' }, { value: 'Terminé', label: '✅' }, { value: 'Bloqué', label: '🚫' }]} style={{ fontSize: '12px' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  // ============================================================================
  // NAVIGATION & RENDER
  // ============================================================================
  const tabs = [
    { id: 'accueil', label: 'Accueil', icon: '🏠' },
    { id: 'documents', label: 'Documents IA', icon: '📄' },
    { id: 'assistant', label: 'Assistant IA', icon: '🤖' },
    { id: 'referentiel', label: 'Référentiel', icon: '📖' },
    { id: 'actions', label: 'Plan d\'Actions', icon: '📋' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, fontFamily: 'Aptos, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ backgroundColor: COLORS.white, borderBottom: `1px solid ${COLORS.lightGray}`, padding: '16px 32px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: COLORS.primary, color: COLORS.white, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>B°</div>
            <div><h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Charte QPP</h1><p style={{ margin: 0, fontSize: '13px', color: COLORS.warmGray }}>Compliance Tracker <Badge variant="ai" size="small">IA</Badge></p></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge variant={stats.score >= 80 ? 'success' : stats.score >= 50 ? 'warning' : 'error'}>Score : {stats.score}%</Badge>
          </div>
        </div>
      </header>
      
      <nav style={{ backgroundColor: COLORS.white, borderBottom: `1px solid ${COLORS.lightGray}`, padding: '0 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.id ? '600' : '400', color: tab === t.id ? (t.id.includes('assistant') || t.id.includes('documents') ? COLORS.ai : COLORS.primary) : COLORS.warmGray, borderBottom: tab === t.id ? `3px solid ${t.id.includes('assistant') || t.id.includes('documents') ? COLORS.ai : COLORS.primary}` : '3px solid transparent', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
              <span style={{ fontSize: '16px' }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </nav>
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {tab === 'accueil' && renderAccueil()}
        {tab === 'documents' && renderDocuments()}
        {tab === 'assistant' && renderAssistant()}
        {tab === 'referentiel' && renderReferentiel()}
        {tab === 'actions' && renderActions()}
      </main>
      
      <footer style={{ backgroundColor: COLORS.white, borderTop: `1px solid ${COLORS.lightGray}`, padding: '20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: COLORS.warmGray }}><strong style={{ color: COLORS.primary }}>BearingPoint</strong> © 2026 • QPP Compliance Tracker v4.0 • Powered by AI</div>
      </footer>

      {/* Modals */}
      {editAction && (
        <Modal isOpen={!!editAction} onClose={() => setEditAction(null)} title={editAction.action} subtitle={`Action ${editAction.id}`}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label><TextArea value={editAction.action} onChange={(v) => setEditAction({ ...editAction, action: v })} rows={2} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Échéance</label><Input type="date" value={editAction.echeance} onChange={(v) => setEditAction({ ...editAction, echeance: v })} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Priorité</label><Select value={editAction.priorite} onChange={(v) => setEditAction({ ...editAction, priorite: v })} options={[{ value: 'Critique', label: '🔴 Critique' }, { value: 'Haute', label: '🟠 Haute' }, { value: 'Moyenne', label: '🔵 Moyenne' }, { value: 'Basse', label: '⚪ Basse' }]} style={{ width: '100%' }} /></div>
            </div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Commentaire</label><TextArea value={editAction.commentaire} onChange={(v) => setEditAction({ ...editAction, commentaire: v })} /></div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setEditAction(null)}>Annuler</Button>
              <Button onClick={() => { setActions(prev => prev.map(a => a.id === editAction.id ? editAction : a)); setEditAction(null); }}>Enregistrer</Button>
            </div>
          </div>
        </Modal>
      )}

      {newAction && (
        <Modal isOpen={!!newAction} onClose={() => setNewAction(null)} title="Nouvelle action">
          <div style={{ display: 'grid', gap: '20px' }}>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description *</label><TextArea value={newAction.action} onChange={(v) => setNewAction({ ...newAction, action: v })} placeholder="Décrivez l'action..." rows={2} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Domaine *</label><Select value={newAction.domaine} onChange={(v) => setNewAction({ ...newAction, domaine: v })} options={Object.values(REFERENTIEL).map(d => ({ value: d.id, label: `${d.icon} ${d.nom}` }))} style={{ width: '100%' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Échéance *</label><Input type="date" value={newAction.echeance} onChange={(v) => setNewAction({ ...newAction, echeance: v })} /></div>
            </div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Responsables *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {FONCTIONS.filter(f => f.id !== 'all').map(f => (
                  <div key={f.id} onClick={() => setNewAction(prev => ({ ...prev, responsables: prev.responsables.includes(f.id) ? prev.responsables.filter(r => r !== f.id) : [...prev.responsables, f.id] }))} style={{ padding: '8px 12px', borderRadius: '8px', border: `2px solid ${newAction.responsables.includes(f.id) ? COLORS.primary : COLORS.lightGray}`, backgroundColor: newAction.responsables.includes(f.id) ? COLORS.errorLight : COLORS.white, cursor: 'pointer', fontSize: '12px' }}>
                    {f.icon} {f.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setNewAction(null)}>Annuler</Button>
              <Button disabled={!newAction.action || !newAction.echeance || newAction.responsables.length === 0} onClick={() => { setActions(prev => [...prev, { ...newAction, id: `ACT-${String(prev.length + 1).padStart(3, '0')}` }]); setNewAction(null); }}>Créer</Button>
            </div>
          </div>
        </Modal>
      )}

      {showGenerator && (
        <Modal isOpen={!!showGenerator} onClose={() => { setShowGenerator(null); setGeneratedContent(''); }} title={`Générer : ${LIVRABLE_TEMPLATES[showGenerator]?.titre}`} width="800px">
          <div>
            {!generatedContent && !generating && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                <p style={{ marginBottom: '24px', color: COLORS.warmGray }}>L'IA va générer un draft basé sur le référentiel QPP et les bonnes pratiques.</p>
                <Button variant="ai" icon="🤖" size="large" onClick={() => generateLivrable(showGenerator)}>Générer le document</Button>
              </div>
            )}
            {generating && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <AITypingIndicator />
                <p style={{ marginTop: '20px', color: COLORS.ai }}>Génération en cours...</p>
              </div>
            )}
            {generatedContent && (
              <div>
                <div style={{ backgroundColor: COLORS.background, borderRadius: '12px', padding: '20px', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {generatedContent}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(generatedContent); }}>📋 Copier</Button>
                  <Button onClick={() => { const blob = new Blob([generatedContent], { type: 'text/markdown' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${showGenerator}.md`; link.click(); }}>💾 Télécharger</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QPPComplianceTracker;
