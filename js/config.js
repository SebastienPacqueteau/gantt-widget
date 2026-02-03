// ==========================================
// ====== Module Panneau configuration ======
// ==========================================

import * as vuePC from './vuePanneauConfiguration.js';

let config = new class {
  constructor(){
    this._colonnesNecessaires = [
      {
          name: 'projet',
          title: 'Nom des projets',
          type: 'Any',
          optional: false
        },
        {name: 'colonnesG', title: 'listes des colonnes à gauche', type: 'Any', allowMultiple: true, optional: true},
        {name: 'colonnesD', title: 'listes des colonnes à droite', type: 'Any', allowMultiple: true, optional: true},
        {name: 'dateDebut', title: 'La date du début de projet', type: 'Any', optional: false},
        {name: 'dateFin', title: 'La date de fin de projet', type: 'Any', optional: false}
      ];
  }

  async grist(){
    this._listeTables = await grist.docApi.listTables();
    this.tablePrincipale = await grist.getSelectedTableId();
    //this[this.tablePrincipale] = await grist.docApi.fetchTable(this.tablePrincipale);
    await this.getTable(this.tablePrincipale);
    //les options colonnes gauches et droites
    await this.getOptions();

    await this.prechargementTables(this.colonnesG);
    await this.prechargementTables(this.colonnesD);
    this.ajouterOptionsPC();
  }
  async getOptions(){
    await this.getOption("optionGantt");
    await this.getOption("colonnesG");
    await this.getOption("colonnesD");
  }

  async getOption(nomOption){
    let option = await grist.getOption(nomOption);
    if (!option){
      console.log("getOption : ", option, nomOption);
      if( nomOption ==='optionGantt'){
        option = [  
          {"titre": "Date début : ","table": "","colonne": "","col_ref": "","id": 0},
          {"titre": "Date fin : ","table": "","colonne": "","col_ref": "","id": 1},
          {"titre": "Contenu sur la barre : ","table": "","colonne": "","col_ref": "","id": 2},
          {"titre": "Couleur de la barre : ","table": "","colonne": "","col_ref": "","id": 3}
        ];
      }
      else{ 
        option = [];
      }
      await grist.setOption(nomOption, option);
    }
    if (nomOption === "optionGantt"){
      // si besoins
    }
    this[nomOption] = option;
    //console.log(this);
    
  }

  async prechargementTables(colonnes){
    for await (const obj of colonnes) {
      await this.getTable(obj.table);
    }
  }

  ajouterOptionsPC(){
    if(!this.optionsPCajoutees){
      vuePC.completerTableau("optionColG", this.colonnesG);
      vuePC.completerTableau("optionColD", this.colonnesD);
      vuePC.completerTableauGantt(this.optionGantt);
    }
  }

  async sauvegarde(idTableau){
    if(idTableau === "optionColG"){
      await grist.setOption("colonnesG", this.colonnesG);
    }
    else if (idTableau === "optionColD") {
      await grist.setOption("colonnesD", this.colonnesD);
    }
    else if (idTableau === "optionGantt") {
      await grist.setOption("optionGantt", this.optionGantt);
    }
    else{
      await grist.setOption("colonnesG", this.colonnesG);
      await grist.setOption("colonnesD", this.colonnesD);
      await grist.setOption("optionGantt", this.optionGantt);
    }
  }

  async options(){
    console.log(await grist.getOptions());
  }

  get listeTables(){ return this._listeTables; }
  get nomTablePrincipale(){ return this.tablePrincipale; }
  get colonnesTablePrincipale(){ return this[`${this.tablePrincipale}_col`]; }
  get colonnesNecessaires(){ return this._colonnesNecessaires; }
  get colonnesG(){ return this._colonnesG; }
  set colonnesG(nouvellesColonnes){ this._colonnesG = nouvellesColonnes; }
  get colonnesD(){ return this._colonnesD; }
  set colonnesD(nouvellesColonnes){ this._colonnesD = nouvellesColonnes; }
  get optionGantt(){ return this._optionGantt; }
  set optionGantt(nouvellesColonnes){ this._optionGantt = nouvellesColonnes; }
  get nbColonnesG(){ return this.colonnesG.length; }
  get nbColonnesD(){ return this.colonnesD.length; }

  get largeurColonnesG(){
    let largeur = 0;
    this.colonnesG.forEach((col) => { largeur += Number(col.largeur); });
    return largeur;
  }
  get largeurColonnesD(){
    let largeur = 0;
    this.colonnesD.forEach((col) => { largeur += Number(col.largeur); });
    return largeur;
  }

  async getTable(nomTable){
    const nomAttributCol = nomTable + "_col";
    if(!this[nomTable]){
      const table_col = await grist.docApi.fetchTable(nomTable);
      const colonnes = Object.keys(table_col);
      this[nomAttributCol] = colonnes;
      this[nomTable] = table_col[colonnes[0]].map((_, i) => {
          const objet = {};
          colonnes.forEach(colonne => {
            objet[colonne] = table_col[colonne][i];
          });
          return objet;
        });
    }
    return this[nomTable];
  }
  
  async getColonnes(nomTable){ 
    const nomAttributCol =  nomTable + "_col";
    if (!this[nomAttributCol]){
      await this.getTable(nomTable);
    }
    return this[nomAttributCol];
  }

  colOption(idTableau){
    const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : idTableau);
    return this[colOption];
  }

  supprColOption(idTableau, id){
      const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : idTableau);
      this[colOption] = this[colOption].filter(obj => obj.id != id);
      this.sauvegarde(idTableau);
  }

  ajouteColOption(idTableau, objLigne){
      const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : idTableau);
      if (objLigne.table){ this[colOption].push(objLigne);}

      this[colOption].sort((a,b) => a.id - b.id);
      this.sauvegarde(idTableau);
  }

  remplacerColOption(idTableau, objLigne, id){
    this.supprColOption(idTableau, id);
    this.ajouteColOption(idTableau, objLigne);
  }

  async optionsPanneau(){
    console.log("CONFIG", await grist.getOptions());
    /*const options = {
      colonnesG: [],
      colonnesD: [],
      optionGantt: ""
    };*/
    //console.log("CONFIG save options", options);
    //console.log("CONFIG après", await grist.setOptions(options));
  }

  /*
   * Actions
   */

   #ajouterUneColonne(bouton){
     try {
       const id_tableau = bouton.dataset.tableau;
       const colOption = (id_tableau === 'optionColG')? '_colonnesG' : ((id_tableau === 'optionColD')?'_colonnesD' : null);

       const objLigne = vuePC.valeursLigneTableau(id_tableau, "");
       objLigne["id"] = this[colOption].length > 0 ? Math.max(...this[colOption].map(obj => obj.id)) + 1 : 0;

       if (objLigne.table){
         vuePC.ajouterLigneAuTableau(id_tableau, objLigne);
         this.ajouteColOption(id_tableau, objLigne);
       }
     } catch (e) {
       console.log({ name: e.name, message: e.message });
     }
   }

  #supprimerUneColonne(bouton){
    try {
      const id_tableau = bouton.dataset.tableau;
      vuePC.retirerLigneDuTableau(id_tableau, bouton.dataset.idLigne);
      this.supprColOption(id_tableau, bouton.dataset.idLigne);
    } catch (e) {
      console.log({ name: e.name, message: e.message });
    }
  }

  /*
   * Gestion des évènements
   */

   async event(balise){
    //console.log(this, balise);
    switch (balise.dataset.action) {
      case "Ajouter":
        this.#ajouterUneColonne(balise);
        break;
      case "Supprimer":
        this.#supprimerUneColonne(balise);
        break;
      case "changement":
        await this.#modificationOption(balise);
        break
      default:
    }
  }

  async #modificationOption(balise){
    const idTableau = balise.parentNode.parentNode.parentNode.id;
      if (balise.dataset.type === 'listeTables'){
        this.#modificationListeTables(balise);
      }
      else if (balise.dataset.type === 'listeColonnes' ||
               balise.dataset.type === 'colonneRef' ||
               balise.dataset.type === 'titre' ||
               balise.dataset.type === 'largeur'){
        this.#modificationValeurOption(balise);
      }
    //}
  }

  async #modificationListeTables(balise){
    const ligneTableau = balise.parentNode.parentNode;
    const numLigne = ligneTableau.dataset.numLigne;
    const idTableau = ligneTableau.parentNode.id;
    if(balise.value !== this.nomTablePrincipale){
      vuePC.ajouterSelectColonne(idTableau, numLigne, "colonneRef", config.colonnesTablePrincipale);
    }
    else{
      vuePC.retirerSelectColonne(idTableau, numLigne, "colonneRef");
    }
    this.#sauvegardeValeursOption(idTableau, numLigne);
    vuePC.retirerSelectColonne(idTableau, numLigne, "listeColonnes");
    vuePC.ajouterSelectColonne(idTableau, numLigne, "listeColonnes", await this.getColonnes(balise.value));
  }

  #modificationValeurOption(balise){
    const ligneTableau = balise.parentNode.parentNode;
    const numLigne = ligneTableau.dataset.numLigne;
    const idTableau = ligneTableau.parentNode.id;
    this.#sauvegardeValeursOption(idTableau, numLigne);
  }

  #sauvegardeValeursOption(idTableau, numLigne){
    //console.log(idTableau, numLigne);
    if(numLigne){
      const objLigne = vuePC.valeursLigneTableau(idTableau, numLigne);
      //console.log(objLigne);
      this.remplacerColOption(idTableau, objLigne, numLigne);
    }
  }
}

export { config };
