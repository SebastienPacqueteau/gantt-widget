// ===========================
// ====== Module Projet ======
// ===========================

import { config } from './config.js';

let projets = new class {
  constructor(){
    this._liste = [];
    this.nbLigne = 0;
  }
  ajouterProjet(projet){
    this._liste.push(projet);
  }

  get length(){ return this._liste.length; }
  get liste(){ return this._liste; }
  get nombreLignes(){ return this.nbLigne; }


  get nbColonnesG(){ return config.nbColonnesG; }
  get nbColonnesD(){ return config.nbColonnesD; }

  get largeurColonnesG(){ return config.largeurColonnesG; }
  get largeurColonnesD(){ return config.largeurColonnesD; }

  get colonnesTitre(){
    return {gauche: config.colonnesG, centre:{ titre: "Gantt" }, droite: config.colonnesD};
  }

  async ajouterLesProjets(){
    const tableCouleurBarre = await config.getTable(config.optionGantt[3].table);
    const tableTitreBarre = await config.getTable(config.optionGantt[2].table);
    
    for await (const objLigne of await config.getTable(config.nomTablePrincipale)) {
      const nouvProjet = new Projet();
      //for await (const objColonne of config.colonnesG) {
      config.colonnesG.forEach((objColonne)=>{
        //si l'info est dans la table principale
        nouvProjet.ajouterInfoColonnesG(objLigne[objColonne.colonne], Number(objColonne.largeur));
      });
      
      this.ajouterProjet(nouvProjet);
      this.nbLigne += nouvProjet.nombreLignes;
      //si les dates sont dans la table principale 
      const objColonneDateDebut = config.optionGantt[0];
      const objColonneDateFin = config.optionGantt[1];
      nouvProjet.date_debut = objLigne[objColonneDateDebut.colonne]; 
      nouvProjet.date_fin = objLigne[objColonneDateFin.colonne];
      nouvProjet.ajouterCouleurBarre(objLigne, tableCouleurBarre);
      nouvProjet.ajouterTitreBarre(objLigne, tableTitreBarre);
    }
    //console.log(this);
  }

  async majListeProjets(){
      this._liste = [];
      this.nbLigne = 0;
      await this.ajouterLesProjets();
  }
}

class Projet {
  constructor() {
    this.colonnesG = [];
    this.colonnesD = [];
    this._dateDebut = 0;
    this._dateFin = 0;
    this._couleurBarre;
    this._titreBarre;
    this.nbLigne = 1;
  }

  ajouterInfoColonnesG(contenu, largeur){
    let nContenu;
    if (Array.isArray(contenu) && contenu.length){
      if(contenu[0] === "L"){
        nContenu = contenu.slice(1);
      }
      nContenu = [...new Set(nContenu)];
    }
    else { nContenu = [contenu];}
    if (nContenu.length > this.nbLigne){ this.nbLigne = nContenu.length ; }
    this.colonnesG.push({
      contenu: nContenu,
      largeur: largeur
    });
  }

  ajouterCouleurBarre(objLigne, tableCouleurBarre){
      if (config.optionGantt[3].table === config.nomTablePrincipale){
        this.couleurBarre = objLigne[config.optionGantt[3].colonne];
      }
      else{
        const idColRefCouleur = objLigne[config.optionGantt[3].col_ref]
        const ligneCouleur = tableCouleurBarre.find(ligne => ligne.id === idColRefCouleur);
        this.couleurBarre = (ligneCouleur)? ligneCouleur[config.optionGantt[3].colonne] : null;
      }
  }

  ajouterTitreBarre(objLigne, tableTitreBarre){
    if (config.optionGantt[2].table === config.nomTablePrincipale){
      this.titreBarre = objLigne[config.optionGantt[2].colonne];
    }
    else{
      const idColRefTitre = objLigne[config.optionGantt[2].col_ref]
      const ligneTitre = tableTitreBarre.find(ligne => ligne.id === idColRefTitre);
      this.titreBarre = (ligneTitre)? ligneTitre[config.optionGantt[2].colonne] : null;
    }
  }

  get date_debut(){ return this._dateDebut; }
  get date_fin(){ return this._dateFin; }
  get couleurBarre(){ return this._couleurBarre; }
  set couleurBarre(couleur){ this._couleurBarre = (couleur)? couleur : "black"; }
  
  get titreBarre(){ return this._titreBarre; }
  set titreBarre(titre){ this._titreBarre = (titre)? titre : ""; }

  set date_debut(date_grist){ this._dateDebut = (date_grist) ? new Date(this.#convDateGrist(date_grist)) : null; }
  set date_fin(date_grist){ this._dateFin = (date_grist) ? new Date(this.#convDateGrist(date_grist)): null; }

  //il y un facteur 1 000 entre le timestamp de grist et celui de l'objet Date
  #convDateGrist(date_grist){ return (date_grist) ? date_grist*1000 : null;}

  get nombreLignes(){ return this.nbLigne;}
}

export { projets };
