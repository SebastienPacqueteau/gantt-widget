// =======================================================
// ====== Module gestion de l'affichage des filtres ======
// =======================================================

import { config } from './config.js';
/**
 * @description ajoute les options au filtre
 * @param {string[]} listeOptions liste d'options pour le menu déroulant
 */
function ajouteMenuDeroulantFiltre(listeOptions){
  const baliseFiltre = document.getElementById('filtreProjets');
  baliseFiltre.addEventListener("change", ()=>config.event(baliseFiltre));
  baliseFiltre.dataset.action = "filtre";
  let nouvelleOption = document.createElement("option");
  baliseFiltre.add(nouvelleOption);
  nouvelleOption.value = 0;
  nouvelleOption.text = "Filtrer les projets";
  baliseFiltre.selectedIndex = 0;
  nouvelleOption.disabled = true;
  ajouterOptions(baliseFiltre, listeOptions);
}

/**
 * 
 * @param {HTMLElement} select pointeur vers la balise <select>
 * @param {string[]} listeOptions liste d'options pour le menu déroulant
 * @param {string} valeurSelectionnee elle doit correspondre à l'une des chaines de caractères de la liste des options
 */
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

export {ajouteMenuDeroulantFiltre}; 