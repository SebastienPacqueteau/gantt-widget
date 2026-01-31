// ====================================================
// ====== Module affichage Panneau configuration ======
// ====================================================

import { config } from './config.js';

//id = {optionColD or optionColG} et lignes = tableau d'obj
async function completerTableau(idTableau, lignes){
  const contenuTableau = document.getElementById(idTableau);
  for await (const objLigne of lignes) {
    contenuTableau.appendChild(creerLigneAuTableau(idTableau, objLigne, await config.getColonnes(objLigne.table)));
  }
  contenuTableau.appendChild(creerLigneAuTableau(idTableau));
}

function creerLigneAuTableau(idTableau, objLigne, listeColonnes){
  const baliseTr = document.createElement("tr");
  baliseTr.dataset.numLigne = (objLigne)? objLigne.id : "";

  baliseTr.appendChild(creerChampSaisie("titre", (objLigne)? objLigne.titre : "", "texte"));
  baliseTr.appendChild(creerColSelect("listeTables", config.listeTables, "Selectionner la table", (objLigne) ? objLigne.table : null));
  baliseTr.appendChild(creerColSelect("listeColonnes", (listeColonnes)? listeColonnes :[], "Selectionner", (objLigne) ? objLigne.colonne : null));
  if (objLigne && objLigne.table !== config.nomTablePrincipale){
    baliseTr.appendChild(creerColSelect("colonneRef", config.colonnesTablePrincipale, "Selectionner", objLigne.col_ref));
  }
  else {
    const baliseTd = document.createElement("td")
    baliseTd.dataset.nomColonne = "colonneRef";
    baliseTr.appendChild(baliseTd);
  }

  baliseTr.appendChild(creerChampSaisie("largeur", (objLigne)? objLigne.largeur : 0, 'nombre'));
  baliseTr.appendChild(creerBouton("largeur", (objLigne)? "Supprimer":"Ajouter", idTableau, (objLigne)? objLigne.id : "ajout"));

  return baliseTr;
}

function creerChampSaisie(nom, valeur, type) {
  const ligneTableau = document.createElement("td");
  ligneTableau.dataset.nomColonne = nom;
  const champSaisie = document.createElement("input");
  champSaisie.addEventListener("change", ()=>config.event(champSaisie));
  champSaisie.value = valeur;
  champSaisie.dataset.type = nom;
  champSaisie.dataset.action = "changement";
  if (type === 'nombre'){
    champSaisie.min = 10;
    champSaisie.max = 250;
    champSaisie.step = 10;
    champSaisie.type = "number";
  }
  ligneTableau.appendChild(champSaisie);
  return ligneTableau;
}

function creerBouton(nom, type, idTableau, idLigne) {
  const ligneTableau = document.createElement("td");
  ligneTableau.dataset.nomColonne = nom;
  const bouton = document.createElement("button");
  if (type === "Supprimer"){
    bouton.appendChild(iconSupprimer());
    bouton.dataset.action = "Supprimer";
  }
  else if (type === "Ajouter") {
    bouton.appendChild(iconAjouter());
    bouton.dataset.action = "Ajouter";
  }
  bouton.addEventListener('click', ()=>config.event(bouton));
  bouton.dataset.tableau = idTableau;
  bouton.dataset.idLigne = idLigne;

  ligneTableau.appendChild(bouton);
  return ligneTableau;
}

function creerColSelect(typeCol, options, textDefaut, valeurSelectionnee){
  const baliseTd = document.createElement("td");
  baliseTd.dataset.nomColonne = typeCol;
  baliseTd.appendChild(creerBaliseSelect(typeCol, options, textDefaut, valeurSelectionnee));

  return baliseTd;
}

function creerBaliseSelect(typeSelect, options, textDefaut, valeurSelectionnee){
  const baliseSelect = document.createElement("select");
  baliseSelect.addEventListener("change", ()=>config.event(baliseSelect));
  baliseSelect.dataset.type = typeSelect;
  baliseSelect.dataset.action = "changement";
  let nouvelleOption = document.createElement("option");
  nouvelleOption.value = "";
  nouvelleOption.disabled = true;
  nouvelleOption.text = textDefaut;
  baliseSelect.add(nouvelleOption);
  baliseSelect.selectedIndex = 0;
  ajouterOptions(baliseSelect, options, valeurSelectionnee);
  return baliseSelect;
}

function iconAjouter(){
  const svgIcon= document.createElementNS("http://www.w3.org/2000/svg",'svg');
  //svgIcon.setAttribute("class", "icon-arrow-down");
  svgIcon.setAttribute("width", "16");
  svgIcon.setAttribute("height", "16");
  svgIcon.setAttribute("fill", "green");
  svgIcon.setAttribute("viewBox", "0 0 16 16");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const pathIcon = document.createElementNS("http://www.w3.org/2000/svg",'path');
  svgIcon.appendChild(pathIcon);
  pathIcon.setAttribute("d","M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z");

  return svgIcon;
}

function iconSupprimer(){
  const svgIcon= document.createElementNS("http://www.w3.org/2000/svg",'svg');
  //svgIcon.setAttribute("class", "icon-arrow-down");
  svgIcon.setAttribute("width", "16");
  svgIcon.setAttribute("height", "16");
  svgIcon.setAttribute("fill", "red");
  svgIcon.setAttribute("viewBox", "0 0 16 16");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const pathIcon = document.createElementNS("http://www.w3.org/2000/svg",'path');
  svgIcon.appendChild(pathIcon);
  pathIcon.setAttribute("d","M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z");

  return svgIcon;
}

function ajouterOptions(select, listeOptions, valeurSelectionnee){
  let nouvelleOption;
  listeOptions.sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  listeOptions.forEach((option, i) => {
    nouvelleOption = document.createElement("option");
    nouvelleOption.value = option;
    nouvelleOption.text = option;
    select.add(nouvelleOption);
    if(valeurSelectionnee && valeurSelectionnee === option){
      select.selectedIndex = i + 1;
    }
  });
}

function retirerSelectColonne(idTableau, numLigne, nomColonne){
  const contenuTableau = document.getElementById(idTableau);
  const ligneTableau = contenuTableau.querySelector(`tr[data-num-ligne="${numLigne}"]`);
  const colonne = ligneTableau.querySelector(`td[data-nom-colonne=${nomColonne}]`);
  while (colonne.children && colonne.children.length) {
    colonne.lastElementChild.remove();
  }
}

function ajouterSelectColonne(idTableau, numLigne, nomColonne, listeColonnes){
  const contenuTableau = document.getElementById(idTableau);
  const ligneTableau = contenuTableau.querySelector(`tr[data-num-ligne="${numLigne}"]`);
  const colonne = ligneTableau.querySelector(`td[data-nom-colonne=${nomColonne}]`);
  if (!colonne.children.length){
    const selectCol = creerBaliseSelect(nomColonne, listeColonnes, "Selectionner");
    colonne.appendChild(selectCol);
  }
}

function valeursLigneTableau(idTableau, numLigne){
  const contenuTableau = document.getElementById(idTableau);
  const ligneTableau = contenuTableau.querySelector(`tr[data-num-ligne="${numLigne}"]`);
  const colTire = ligneTableau.children[0].children[0].value;
  const colTable = ligneTableau.children[1].children[0].value;
  const colColonne = ligneTableau.children[2].children[0].value;
  const colColonneRef = (colTable !== config.nomTablePrincipale && ligneTableau.children[3].children.length) ? ligneTableau.children[3].children[0].value : "";
  const colLargeur = ligneTableau.children[4].children[0].value;
  const id = numLigne;

  return { titre: colTire, table: colTable, colonne: colColonne, largeur: colLargeur, col_ref: colColonneRef, id: id };
}

function ajouterLigneAuTableau(idTableau, objLigne) {
  const contenuTableau = document.getElementById(idTableau);

  contenuTableau.lastElementChild.remove();
  contenuTableau.appendChild(creerLigneAuTableau(idTableau, objLigne));
  contenuTableau.appendChild(creerLigneAuTableau(idTableau));
}

function retirerLigneDuTableau(idTableau, numLigne) {
  const contenuTableau = document.getElementById(idTableau);
  const ligneTableau = contenuTableau.querySelector(`tr[data-num-ligne="${numLigne}"]`);
  ligneTableau.remove();
}

export {
  completerTableau,
  ajouterLigneAuTableau,
  retirerLigneDuTableau,
  creerBaliseSelect,
  ajouterOptions,
  valeursLigneTableau,
  retirerSelectColonne,
  ajouterSelectColonne
};
