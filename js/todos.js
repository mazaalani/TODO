let f1 = frm1;
let papa = document.getElementById("listeTaches"); //parent qui conteindra la liste des taches
let mListe = document.getElementById("modeleListe");
let mDetail = document.getElementById("modeleDetail");
//tableau contenant les id des taches
let idTaches = [];
// exemples de saisies
let tTaches = [
  {
    nom: "aaa",
    importance: "3",
    date: "21/04/2021, 15:41:05",
    id: 1,
    fait: false,
  },
  {
    nom: "bbb",
    importance: "2",
    date: "21/04/2021, 15:41:29",
    id: 3,
    fait: false,
  },
  {
    nom: "ccc",
    importance: "1",
    date: "21/04/2021, 15:41:12",
    id: 2,
    fait: false,
  },
  {
    nom: "ééé",
    importance: "2",
    date: "21/04/2021, 15:41:36",
    id: 4,
    fait: false,
  },
  {
    nom: "ggg",
    importance: "2",
    date: "21/04/2021, 15:41:45",
    id: 5,
    fait: false,
  },
  {
    nom: "ddd",
    importance: "1",
    date: "21/04/2021, 15:42:16",
    id: 6,
    fait: false,
  },
];

// Initialisation de l'affichage des taches
// =========================================
//remplacer tTaches par local si sauvegarde existe
if (localStorage.length > 0) tTaches = recuperer_localement();
//initialisation tableau contenant les index des taches
for (let tache of tTaches) idTaches.push(tache.id);

/**
 * Afficher le tableau au complet
 */
function afficher_tableau_taches() {
  //vider liste si déja affichée
  if (papa.hasChildNodes()) {
    let nbNodes = papa.childElementCount;
    for (let i = 0; i < nbNodes; i++) {
      papa.removeChild(papa.firstElementChild);
    }
  }
  //afficher tableau avec valeurs a jour
  for (let tache of tTaches) {
    let tHTML = mListe.innerHTML;
    for (let prop in tache) {
      tHTML = tHTML.replaceAll(`{${prop}}`, tache[prop]);
    }
    papa.insertAdjacentHTML("beforeend", tHTML);
  }
  sauvegrader_localement();
}

/**
 * Controle si saisie dans Nouvelle tâche est une chaîne de caractères
 */
export function controler_saisie() {
  let msgErr = "";
  let regExp = /^[a-z0-9àçèéêûùïî]+/i;
  let val = f1.tache.value.trim();
  if (val === "") msgErr = "Aucune valeur saisie.";
  else {
    if (!regExp.test(val)) msgErr = "Caractére(s) invalide(s).";
  }
  if (f1.importance.value === "") msgErr = "Ordre d'importance manquant."; // controle rapide de selection de l'importance
  document.getElementById("msgErr").innerHTML = msgErr;
}

/**
 * Mise a jour tableau en rajoutant tache saisie
 */
export function maj_tableau() {
  //affecter ids uniques consérvées même aprés suppression des taches
  let imp = f1.importance.value;
  let n = f1.tache.value.trim();
  let date = new Date();
  date = date.toLocaleString(); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  let tache = {
    nom: n,
    importance: imp,
    date: date,
    id: idTaches.length + 1,
    fait: false,
  };
  tTaches.push(tache);
  idTaches.push(tache.id);
  afficher_tableau_taches();
}

/**
 * Trier puis afficher tableau
 */
export function trier_tableau(sensTri) {
  let sens1 = sensTri == "nom/importance" ? "nom" : "importance";
  let sens2 = sens1 == "nom" ? "importance" : "nom";
  tTaches.sort(function (tache1, tache2) {
    // préparation pour comparaison en tenant compte des caractéres avec accent
    tache1[sens1] = tache1[sens1].toLocaleString();
    tache2[sens1] = tache2[sens1].toLocaleString();
    // utilisation de variable pour éviter le remplacement des caractéres saisis
    let t11 = tache1[sens1].toLowerCase();
    let t21 = tache2[sens1].toLowerCase();
    let t12 = tache1[sens2].toLowerCase();
    let t22 = tache2[sens2].toLowerCase();
    // comparaison
    if (t11.localeCompare(t21) > 0) return 1;
    if (t11.localeCompare(t21) < 0) return -1;
    if (t12.localeCompare(t22) > 0) return 1;
    if (t12.localeCompare(t22) < 0) return -1;
    return 0;
  });
  afficher_tableau_taches();
}

/**
 * Traitement click sur 'effacer'
 */
export function valider_btn_effacer(evt) {
  let target = evt.target;
  let parentId = target.parentNode.dataset.id;
  //controler que l'element selectionné est bien le span'effacer'
  if (target.innerHTML == "effacer") {
    //obtenir index de l'objet selectionné
    let indexTarget = tTaches.findIndex((i) => i.id == `${parentId}`); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
    tTaches.splice(indexTarget, 1);
    //affichage du tableau aprés la suppression
    afficher_tableau_taches();
  }
}

/**
 * Traitement click sur tache changement status fait
 */
export function valider_fait(evt) {
  let targetId = evt.target.dataset.id;
  //trouver element cible dans le tableau tTaches
  for (let t of tTaches) {
    if (t["id"] == targetId) {
      if (t["fait"] == false) t["fait"] = true;
      else t["fait"] = false;
    }
  }
  afficher_tableau_taches();
}

/**
 * Afficher le dialogue
 * https://www.w3schools.com/jsref/met_dialog_show.asp
 */
export function afficher_detail(evt) {
  let targetTxt = evt.target.innerHTML;
  let parentId = evt.target.parentNode.dataset.id;
  //valider que le click est bien sur 'details'
  if (targetTxt == "détail") {
    //obtenir index de l'objet selectionné
    let indexTarget = tTaches.findIndex((i) => i.id == `${parentId}`); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
    let modale = document.getElementById("modale");
    //obtenir objet dont les détails sont a afficher
    let tache = tTaches[indexTarget];
    let tHTML = mDetail.innerHTML;
    if (modale.hasChildNodes()) {
      let nbNodes = modale.childElementCount;
      for (let i = 0; i < nbNodes; i++) {
        modale.removeChild(modale.firstElementChild);
      }
    }
    for (let prop in tache) {
      tHTML = tHTML.replaceAll(`{${prop}}`, tache[prop]);
    }
    tHTML = tHTML.replace("true", "oui").replace("false", "non");
    modale.insertAdjacentHTML("beforeend", tHTML);
    modale.showModal();
  }
}

/**
 * Sauvegarde dans item JSON locale
 */
function sauvegrader_localement() {
  localStorage.clear();
  localStorage["taches"] = JSON.stringify(tTaches);
}

/**
 * récuperer JSON locale
 * @return array des taches sauvegardées dans item local
 */
function recuperer_localement() {
  let taches = JSON.parse(localStorage["taches"]);
  return taches;
}
