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
  get titreColonnesG(){ return config.colonnesG; }
  get titreColonnesD(){ return config.colonnesD; }

  async ajouterLesProjets(){
    for await (const objLigne of await config.getTable(config.nomTablePrincipale, true)) {
      const nouvProjet = new Projet();
      //for await (const objColonne of config.colonnesG) {
      config.colonnesG.forEach((objColonne)=>{
        //si l'info est dans la table principale
        nouvProjet.ajouterInfoColonnesG(objLigne[objColonne.colonne], Number(objColonne.largeur));
      });
      this.ajouterProjet(nouvProjet);
      this.nbLigne += nouvProjet.nombreLignes;
      //console.log(nouvProjet);
      //}
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
    this.date_debut = 0;
    this.date_fin = 0;
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

  get nombreLignes(){ return this.nbLigne;}
}

export { projets };
