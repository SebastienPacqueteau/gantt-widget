// ==========================================
// ====== Module Panneau configuration ======
// ==========================================

import * as vuePC from './affichagePanneauConfiguration.js';

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
    this[this.tablePrincipale] = await grist.docApi.fetchTable(this.tablePrincipale);
    //les options colonnes gauches et droites
    this._colonnesG = await grist.getOption("colonnesG");
    this._colonnesD = await grist.getOption("colonnesD");
    await this.prechargementTables(this.colonnesG);
    await this.prechargementTables(this.colonnesD);
    this.ajouterOptionsPC();
  }

  async prechargementTables(colonnes){
    for await (const obj of colonnes) {
      this[obj.table] = await grist.docApi.fetchTable(obj.table);
    }
  }

  ajouterOptionsPC(){
    if(!this.optionsPCajoutees){
      vuePC.completerTableau("optionColG", this.colonnesG);
      vuePC.completerTableau("optionColD", this.colonnesD);
    }
  }

  async sauvegarde(idTableau){
    if(idTableau === "optionColG"){
      await grist.setOption("colonnesG", this.colonnesG);
    }
    else if (idTableau === "optionColD") {
    await grist.setOption("colonnesD", this.colonnesD);
    }
    else{
      await grist.setOption("colonnesG", this.colonnesG);
      await grist.setOption("colonnesD", this.colonnesD);
    }
  }

  async options(){
    console.log(await grist.getOptions());
  }

  get listeTables(){ return this._listeTables; }
  get nomTablePrincipale(){ return this.tablePrincipale; }
  get colonnesTablePrincipale(){ return Object.keys(this[this.tablePrincipale]); }
  get colonnesNecessaires(){ return this._colonnesNecessaires; }
  get colonnesG(){ return this._colonnesG; }
  get colonnesD(){ return this._colonnesD; }

  async getTable(nomTable){
    if(!this[nomTable]){
      let tmp = await grist.docApi.fetchTable(nomTable);
      return tmp;
    }
    return this[nomTable];
  }

  async getColonnes(nomTable){
    if(!this[nomTable]){
      let tmp = await grist.docApi.fetchTable(nomTable);
      return Object.keys(tmp);
    }
    return Object.keys(this[nomTable]);
  }

  colOption(idTableau){
    const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : null);
    return this[colOption];
  }

  supprColOption(idTableau, id){
      const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : null);
      this[colOption] = this[colOption].filter(obj => obj.id != id);
      this.sauvegarde(idTableau);
  }

  ajouteColOption(idTableau, objLigne){
      const colOption = (idTableau === 'optionColG')? '_colonnesG' : ((idTableau === 'optionColD')?'_colonnesD' : null);
      this[colOption].push(objLigne);

      this[colOption].sort((a,b) => a.id - b.id);
      this.sauvegarde(idTableau);
  }

  remplacerColOption(idTableau, objLigne, id){
    this.supprColOption(idTableau, id);
    this.ajouteColOption(idTableau, objLigne);
  }

  optionsPanneau(){
    console.log("CONFIG", this.colonnesG, this.colonnesD);
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

       vuePC.ajouterLigneAuTableau(id_tableau, objLigne);
       this.ajouteColOption(id_tableau, objLigne);
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
    console.log(this, balise);
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
    if (balise.dataset.type === 'listeTables'){
      this.#modificationListeTables(balise);
    }
    else if (balise.dataset.type === 'listeColonnes' ||
             balise.dataset.type === 'colonneRef' ||
             balise.dataset.type === 'titre' ||
             balise.dataset.type === 'largeur'){
      this.#modificationValeurOption(balise);
    }
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
    if(numLigne){
      const objLigne = vuePC.valeursLigneTableau(idTableau, numLigne);
      //console.log(objLigne);
      this.remplacerColOption(idTableau, objLigne, numLigne);
    }
  }
}

export { config };
