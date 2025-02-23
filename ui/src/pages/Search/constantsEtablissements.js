const FILTERS = ["QUERYBUILDER", "SEARCH", "num_departement", "nom_academie", "tags", "published"];

const columnsDefinition = [
  {
    Header: "Siren",
    accessor: "siren",
    width: 200,
    editable: false,
  },
  {
    Header: "Siret",
    accessor: "siret",
    width: 200,
    editable: false,
  },
  {
    Header: "Nom / Enseigne",
    accessor: "enseigne",
    width: 200,
    editable: false,
  },
  {
    Header: "Raison sociale de l'entreprise",
    accessor: "entreprise_raison_sociale",
    width: 200,
    editable: false,
  },
  {
    Header: "Code NAF",
    accessor: "naf_code",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "Libellé du code NAT",
    accessor: "naf_libelle",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "Uai",
    accessor: "uai",
    width: 200,
    editorInput: "text",
    editable: true,
  },
  {
    Header: "CFA ou OFA ? ",
    accessor: "computed_type",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA conventionné ? ",
    accessor: "computed_conventionne",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA déclaré en préfecture ? ",
    accessor: "computed_declare_prefecture",
    width: 200,
    editable: false,
  },
  {
    Header: "Organisme certifié 2015 ? ",
    accessor: "computed_info_datadock",
    width: 200,
    editable: false,
  },
  {
    Header: "Est le siége de l'entreprise",
    accessor: "siege_social",
    width: 200,
    editable: false,
  },
  {
    Header: "Siret Siège social",
    accessor: "etablissement_siege_siret",
    width: 200,
    editable: false,
  },
  {
    Header: "Adresse",
    accessor: "adresse",
    width: 200,
    editable: false,
  },
  {
    Header: "Numéro de voie",
    accessor: "numero_voie",
    width: 60,
    editable: false,
  },
  {
    Header: "Type de voie",
    accessor: "type_voie",
    width: 60,
    editable: false,
  },
  {
    Header: "Nom de la voie",
    accessor: "nom_voie",
    width: 200,
    editable: false,
  },
  {
    Header: "Complément d'adresse",
    accessor: "complement_adresse",
    width: 200,
    editable: false,
  },
  {
    Header: "Code postal",
    accessor: "code_postal",
    width: 120,
    editable: false,
  },
  {
    Header: "Numéro de département",
    accessor: "num_departement",
    width: 120,
    editable: false,
  },
  {
    Header: "Localité",
    accessor: "localite",
    width: 200,
    editable: false,
  },
  {
    Header: "Code commune INSEE",
    accessor: "code_insee_localite",
    width: 200,
    editable: false,
  },
  {
    Header: "Cedex",
    accessor: "cedex",
    width: 200,
    editable: false,
  },
  {
    Header: "Région",
    accessor: "region_implantation_nom",
    width: 200,
    editable: false,
  },
  {
    Header: "Numéro académie",
    accessor: "num_academie",
    width: 200,
    editable: false,
  },
  {
    Header: "Nom de l'académie",
    accessor: "nom_academie",
    width: 200,
    editable: false,
  },
  {
    Header: "À charger dans Affelnet",
    accessor: "affelnet_a_charger",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "À charger dans ParcourSup",
    accessor: "parcoursup_a_charger",
    width: 200,
    editable: false,
  },
  {
    Header: "A des formations de niveau 3",
    accessor: "formations_n3",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "A des formations de niveau 4",
    accessor: "formations_n4",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "A des formations de niveau 5",
    accessor: "formations_n5",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "A des formations de niveau 6",
    accessor: "formations_n6",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "A des formations de niveau 7",
    accessor: "formations_n7",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "A des formations de niveau 3",
    accessor: "formations_n3",
    width: 200,
    editable: false,
  },
  {
    Header: "A des formations de niveau 4",
    accessor: "formations_n4",
    width: 200,
    editable: false,
  },
  {
    Header: "A des formations de niveau 5",
    accessor: "formations_n5",
    width: 200,
    editable: false,
  },
  {
    Header: "A des formations de niveau 6",
    accessor: "formations_n6",
    width: 200,
    editable: false,
  },
  {
    Header: "A des formations de niveau 7",
    accessor: "formations_n7",
    width: 200,
    editable: false,
  },
  {
    Header: "Email",
    accessor: "ds_questions_email",
    width: 200,
    debug: true,
    exportOnly: true,
    editable: false,
  },
  {
    Header: "Tags",
    accessor: "tags",
    width: 200,
    editable: false,
  },
];

const queryBuilderField = [
  { text: "Raison sociale", value: "entreprise_raison_sociale.keyword" },
  { text: "Siret", value: "siret.keyword" },
  { text: "Type d'établissement", value: "computed_type.keyword" },
  { text: "Conventionné", value: "computed_conventionne.keyword" },
  { text: "Déclaré en prefecture", value: "computed_declare_prefecture.keyword" },
  { text: "Référencé datadock", value: "computed_info_datadock.keyword" },
  { text: "Uai", value: "uai.keyword" },
];

const facetDefinition = [
  {
    componentId: "nom_academie",
    dataField: "nom_academie.keyword",
    title: "Académie",
    filterLabel: "Académie",
    selectAllLabel: "Toutes les académies",
    sortBy: "asc",
  },
  {
    componentId: "num_departement",
    dataField: "num_departement.keyword",
    title: "Département",
    filterLabel: "Département",
    selectAllLabel: "Tous",
    sortBy: "asc",
  },
  {
    componentId: "tags",
    dataField: "tags.keyword",
    title: "Année(s)",
    filterLabel: "Année(s)",
    selectAllLabel: "Toutes",
    sortBy: "asc",
  },
];

const dataSearch = {
  dataField: ["entreprise_raison_sociale", "uai", "siret"],
  placeholder: "Saisissez une raison sociale, un UAI, ou un numéro de Siret",
  fieldWeights: [3, 2, 1],
};

export default {
  FILTERS,
  columnsDefinition,
  facetDefinition,
  queryBuilderField,
  dataSearch,
};
