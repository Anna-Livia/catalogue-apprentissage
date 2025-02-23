const etablissementFormateurInfo = require("./etablissement.formateur.sub");
const etablissementGestionnaireInfo = require("./etablissement.gestionnaire.sub");
const etablissementReferenceInfo = require("./etablissement.reference.sub");

const mnaFormationSchema = {
  ...etablissementGestionnaireInfo,
  ...etablissementFormateurInfo,
  ...etablissementReferenceInfo,

  cfd: {
    type: String,
    default: null,
    description: "Code formation diplome (education nationale)",
  },
  cfd_specialite: {
    type: Object,
    default: null,
    description: "Lettre spécialité du code cfd",
  },
  cfd_outdated: {
    type: Boolean,
    default: false,
    description: "BCN : cfd périmé (fermeture avant le 31 aout de l'année courante)",
  },
  mef_10_code: {
    type: String,
    default: null,
    description: "Code MEF 10 caractères",
  },
  mefs_10: {
    type: [Object],
    default: [],
    description: "Tableau de Code MEF 10 caractères et modalités (filtrés pour Affelnet si applicable)",
  },
  nom_academie: {
    type: String,
    default: null,
    description: "Nom de l'académie",
  },
  num_academie: {
    type: String,
    default: 0,
    description: "Numéro de l'académie",
  },
  code_postal: {
    type: String,
    default: null,
    description: "Code postal",
  },
  code_commune_insee: {
    type: String,
    default: null,
    description: "Code commune INSEE",
  },
  num_departement: {
    type: String,
    default: null,
    description: "Numéro de departement",
  },
  nom_departement: {
    type: String,
    default: null,
    description: "Nom du departement",
  },
  region: {
    type: String,
    default: null,
    description: "Numéro de departement",
  },
  localite: {
    type: String,
    default: null,
    description: "Localité",
  },
  uai_formation: {
    type: String,
    default: null,
    description: "UAI de la formation",
  },
  nom: {
    type: String,
    default: null,
    description: "Nom de la formation déclaratif",
  },
  intitule_long: {
    type: String,
    default: null,
    description: "Intitulé long de la formation normalisé BCN",
  },
  intitule_court: {
    type: String,
    default: null,
    description: "Intitulé court de la formation normalisé BCN",
  },
  diplome: {
    type: String,
    default: null,
    description: "Diplôme ou titre visé",
  },
  niveau: {
    type: String,
    default: null,
    description: "Niveau de la formation",
  },
  onisep_url: {
    type: String,
    default: null,
    description: "Url de redirection vers le site de l'ONISEP",
  },
  rncp_code: {
    type: String,
    default: null,
    description: "Code RNCP",
  },
  rncp_intitule: {
    type: String,
    default: null,
    description: "Intitulé du code RNCP",
  },
  rncp_eligible_apprentissage: {
    type: Boolean,
    default: false,
    description: "Le titre RNCP est éligible en apprentissage",
  },
  rncp_details: {
    type: Object,
    default: null,
    description: "Détails RNCP (bloc de compétences etc..)",
  },
  rome_codes: {
    type: [String],
    default: [],
    description: "Codes ROME",
  },
  periode: {
    type: String,
    default: null,
    description: "Période d'inscription à la formation",
  },
  capacite: {
    type: String,
    default: null,
    description: "Capacité d'accueil",
  },
  duree: {
    type: String,
    default: null,
    description: "Durée de la formation en années",
  },
  annee: {
    type: String,
    default: null,
    description: "Année de la formation (cursus)",
  },
  email: {
    type: String,
    default: null,
    description: "Email du contact pour cette formation",
  },
  parcoursup_reference: {
    type: Boolean,
    default: false,
    description: "La formation est présent sur parcourSup",
  },
  parcoursup_a_charger: {
    type: Boolean,
    default: false,
    description: "La formation doit être ajouter à ParcourSup",
  },
  parcoursup_statut: {
    type: String,
    enum: [
      "hors périmètre",
      "publié",
      "non publié",
      "à publier (vérifier accès direct postbac)",
      "à publier (soumis à validation Recteur)",
      "à publier",
      "en attente de publication",
    ],
    default: "hors périmètre",
    description: "Statut parcoursup",
  },
  parcoursup_error: {
    type: String,
    default: null,
    description: "Erreur lors du contrôle de référencement sur ParcourSup de la formation",
  },
  affelnet_reference: {
    type: Boolean,
    default: false,
    description: "La formation est présent sur affelnet",
  },
  affelnet_a_charger: {
    type: Boolean,
    default: false,
    description: "**[DEPRECATED]** La formation doit être ajouter à affelnet",
  },
  affelnet_statut: {
    type: String,
    enum: [
      "hors périmètre",
      "publié",
      "non publié",
      "à publier (soumis à validation)",
      "à publier",
      "en attente de publication",
    ],
    default: "hors périmètre",
    description: "Statut affelnet",
  },
  affelnet_error: {
    type: String,
    default: null,
    description: "Erreur lors du contrôle de référencement sur affelnet de la formation",
  },
  source: {
    type: String,
    default: null,
    description: "Origine de la formation",
  },
  commentaires: {
    type: String,
    default: null,
    description: "Commentaires",
  },
  opcos: {
    type: [String],
    default: null,
    description: "Liste des opcos de la formation",
  },
  info_opcos: {
    type: Number,
    default: 0,
    description: "Code du statut de liaison avec un/des opcos",
  },
  info_opcos_intitule: {
    type: String,
    default: null,
    description: "Intitule du statut de liaison avec un/des opcos",
  },
  published: {
    type: Boolean,
    default: false,
    description: "Est publiée, la formation est éligible pour le catalogue",
  },
  draft: {
    type: Boolean,
    default: false,
    description: "En cours de creation",
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "Date d'ajout en base de données",
  },
  updates_history: {
    type: [Object],
    default: [],
    description: "Historique des mises à jours",
    noIndex: true,
  },
  last_update_at: {
    type: Date,
    default: Date.now,
    description: "Date de dernières mise à jour",
  },
  last_update_who: {
    type: String,
    default: null,
    description: "Qui a réalisé la derniere modification",
  },

  // Flags
  to_verified: {
    type: Boolean,
    default: false,
    description: "Formation à vérifier manuellement",
  },

  // Product specific
  idea_geo_coordonnees_etablissement: {
    type: String,
    implicit_type: "geo_point",
    description: "Latitude et longitude de l'établissement recherchable dans Idea",
  },

  update_error: {
    type: String,
    default: null,
    description: "Erreur lors de la mise à jour de la formation",
  },

  lieu_formation_geo_coordonnees: {
    type: String,
    implicit_type: "geo_point",
    description: "Latitude et longitude du lieu de formation",
  },
  lieu_formation_adresse: {
    type: String,
    default: null,
    description: "Adresse du lieu de formation",
  },
  lieu_formation_siret: {
    type: String,
    default: null,
    description: "Siret du lieu de formation",
  },
  id_rco_formation: {
    type: String,
    default: null,
    description: "Id de formation RCO (id_formation + id_action + id_certifinfo)",
  },
  tags: {
    type: [String],
    default: [],
    description: "Tableau de tags (2020, 2021, etc.)",
  },
  libelle_court: {
    type: String,
    default: null,
    description: "BCN : libelle court fusion table n_formation_diplome ou v_formation_diplome",
  },
  niveau_formation_diplome: {
    type: String,
    default: null,
    description: "BCN : niveau formation diplome",
  },
  affelnet_infos_offre: {
    type: String,
    default: null,
    description: "Affelnet : Informations offre de formation",
  },
  affelnet_code_nature: {
    type: String,
    default: null,
    description: "Affelnet : code nature de l'établissement de formation",
  },
  affelnet_secteur: {
    type: String,
    enum: ["PR", "PU", null],
    default: null,
    description: "Affelnet : type d'établissement (PR: Privé / PU: Public)",
  },
  bcn_mefs_10: {
    type: [Object],
    default: null,
    description: "BCN : Codes MEF 10 caractères",
  },
};

module.exports = mnaFormationSchema;
