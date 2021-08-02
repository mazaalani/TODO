import {
  trier_tableau,
  controler_saisie,
  valider_btn_effacer,
  valider_fait,
  afficher_detail,
  maj_tableau,
} from "./todos.js";

let papa = document.getElementById("listeTaches"); //parent qui conteindra la liste des taches

trier_tableau("nom/importance");

// Initialisation des listeners
// ============================
//Ajout de tache
frm1.ajouter.addEventListener("click", function (evt) {
  controler_saisie();
  if (document.getElementById("msgErr").innerHTML !== "") evt.preventDefault();
  else {
    maj_tableau();
    frm1.tache.value = "";
  }
});
//traitement a la selection du tri
frm2.tri.addEventListener("change", function (evt) {
  //sauvegarde locale avant modif tableau pour conserver la bonne version du tableau
  trier_tableau(evt.target.value);
});
//traitement au click sur effacer
papa.addEventListener("click", function (evt) {
  valider_btn_effacer(evt);
});
//traitement status fait au click sur nom tache
papa.addEventListener("click", function (evt) {
  valider_fait(evt);
});
//traitement au click sur detail
papa.addEventListener("click", function (evt) {
  afficher_detail(evt);
});
