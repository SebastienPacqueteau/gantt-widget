// ==========================
// ====== Module Gantt ======
// ==========================

import { projets } from './projet.js';

class Gantt{
  constructor(id){
    this.element = document.getElementById(id);
    this._width = 2000;
    this._height = 20;
    this.fontTitre = '30px Marianne';
    this.font = '25px Marianne';
    this.hauteurTitre = 100;
    this.margeTitre = 20;
    this.hauteurLigne = 40;
    this.hautBarre = 30;
    this.margeColonne = 20;
    this.nbMoisAffiches = 8;
  }

  init(){
    this.largeurColonnesG = projets.largeurColonnesG + ((projets.nbColonnesG + 2) * this.margeColonne);
    this.largeurColonnesD = projets.largeurColonnesD + ((projets.nbColonnesD + 2) * this.margeColonne);
    this.largeurGraphGantt = this.width - this.largeurColonnesG - this.largeurColonnesD;
    this.dateDebutAffichage = (()=>{
      const date = new Date(); 
      date.setMonth(date.getMonth()-2);
      date.setDate(1);
      return date;
    })();
    this.dateFinAffichage = (()=>{
      const date = new Date(); 
      date.setMonth(date.getMonth()+6);
      date.setDate(1);
      return date;
    })();
    this.ecartDate = this.dateFinAffichage - this.dateDebutAffichage; 
    this.listeMoisAffiches = (()=>{
      let listeMois = [];
      const moisAffichee = -2;
      for (let i = 0; i < this.nbMoisAffiches; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + moisAffichee + i);
        date.setDate(1);
        listeMois.push(date); 
      }
      return listeMois;
    })();     
  }

  get width(){ return this._width; }
  get height(){ return this._height; }
  set height(newHeight){ this._height = newHeight; }

  toString(){
    return `Canvas ${this.element.id} : ${this._width} x ${this._height}`;
  }

  ajusterDimension(hauteur){
    this.element.width = this._width;
    this.element.height = hauteur;
  }

  redessiner(){
    const ctx = this.element.getContext('2d');
    ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.init();
    this.dessiner();
  }

  dessinerBarreTitre(){
    this.ajusterDimension(this.hauteurTitre);
    this.ligneTitres(projets.colonnesTitre);
  }

  redessinerTitre(){
    const ctx = this.element.getContext('2d');
    ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.init();
    this.dessinerBarreTitre();
  }

  dessiner(){
    this.ajusterDimension(this.hauteurTitre + this.margeTitre + (projets.nombreLignes * this.hauteurLigne));

    this.ligneTitres(projets.colonnesTitre);

    let hauteur = this.hauteurTitre + this.margeTitre;
    this.#dessinerlignesTitres();
    this.#dessinerLigneAjrd();
    projets.liste.forEach((projet,i)=>{
      hauteur += this.ajouterLigneProjet(projet, hauteur);
      if(i != projets.liste.length){
      }
    });
  }

  ajouterLigneProjet(projet, hauteur){
    const ctx = this.element.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = this.font;
    this.ajouterLigneColonneG(projet, hauteur, ctx);
    this.ajouterLigneBarreGantt(projet, hauteur, ctx);
    this.ajouterLigneColonneD(projet, hauteur, ctx);

    return projet.nbLigne * this.hauteurLigne;
  }

  ajouterLigneColonneG(projet, hauteur, ctx){
    let x = this.margeColonne;
    projet.colonnesG.forEach((objColonne) => {
      objColonne.contenu.forEach((ligne, i) => {
        ctx.fillText(ligne, x, hauteur + (i * this.hauteurLigne), objColonne.largeur);
      });
      x += this.margeColonne + objColonne.largeur;
    });
  }

  ajouterLigneColonneD(projet, hauteur, ctx){
    //console.log(projet.colonnesD);
  }

  ajouterLigneBarreGantt(projet, hauteur, ctx){
    
    const positionDebut = this.#convTimestampToPosition(projet.date_debut);
    const positionFin = this.#convTimestampToPosition(projet.date_fin);
    const ajustementHauteurBarre = (this.hauteurLigne - this.hautBarre)/2;
    
    if(projet.date_debut){
      ctx.save();
      ctx.rect(this.largeurColonnesG, hauteur-ajustementHauteurBarre, this.largeurGraphGantt, this.hauteurLigne * projet.nbLigne);
      ctx.clip();
      ctx.beginPath();
      ctx.roundRect(this.largeurColonnesG + positionDebut, hauteur - ajustementHauteurBarre, (positionFin - positionDebut), this.hautBarre * projet.nbLigne, 25);
      ctx.fillStyle = projet.couleurBarre;
      ctx.fill();
      
      if(projet.date_fin < this.dateDebutAffichage){}
      else if(projet.date_debut > this.dateFinAffichage){}
      else {
        let positionTitreX; 
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        if(projet.date_debut < this.dateDebutAffichage){
          positionTitreX = this.largeurColonnesG + 10;
        }
        else {
          positionTitreX = this.largeurColonnesG + positionDebut + 10;
        }
        ctx.fillText(projet.titreBarre, positionTitreX, hauteur);
      }

      

      ctx.closePath();
      //
      ctx.restore();
    }
  }
  
  ligneTitres(colonnes){
    const ctx = this.element.getContext('2d');
    ctx.font = this.fontTitre;
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let x = this.margeColonne;
    colonnes.gauche.forEach((colonne, i) => {
      if (colonne.titre.length*10 > Number(colonne.largeur) && colonne.titre.split(" ").length === 2){
        // si on peut faire un saut de ligne : 
        ctx.save();
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'center';
        const positionX = x + (Number(colonne.largeur)/10);
        ctx.fillText(colonne.titre.split(" ")[0], positionX, 50, Number(colonne.largeur));
        ctx.textBaseline = 'top';
        ctx.fillText(colonne.titre.split(" ")[1], positionX, 50, Number(colonne.largeur));
        ctx.restore();
      }
      else{
        ctx.fillText(colonne.titre, x, 50, Number(colonne.largeur));
      }
      x += Number(colonne.largeur) + this.margeColonne;
    });

    const largeurMois = this.largeurGraphGantt / this.nbMoisAffiches;
    this.#colonneDate().forEach((date,i) => {
      ctx.fillText(date, this.largeurColonnesG + (largeurMois * i), 50);
    });
    
    //TODO: ajouter la colonne de droite : colonnes.droite .... 
  }

  #dessinerlignesTitres(){
    this.listeMoisAffiches.forEach((date)=>{
      this.#dessinerligneDate(date, 1, [5,5]);
    });
  }

  #dessinerLigneAjrd(){
    this.#dessinerligneDate(new Date(), 2, [5,10,15,10]);
  }

  /**
   * 
   * @param {Date} date mettre la date à tracer 
   * @param {Number} epaisseurTrait 
   * @param {Number[]} schemaPointillees - largeur trait plein, espacement, .... 
   */
  #dessinerligneDate(date, epaisseurTrait, schemaPointillees){
    const ctx = this.element.getContext('2d');
    const positionX = this.largeurColonnesG + this.#convTimestampToPosition(date);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = epaisseurTrait;
    ctx.beginPath();
    ctx.setLineDash(schemaPointillees);
    ctx.moveTo(positionX,  this.hauteurTitre + this.margeTitre);
    ctx.lineTo(positionX, this.element.height);
    ctx.stroke();
  }

  #colonneDate(){
    const colonneDate = [];
    
    this.listeMoisAffiches.forEach((date)=>{
      const mois = date.toLocaleDateString("fr-FR", {month: "long"});
      const annee = date.toLocaleDateString("fr-FR", {year: "numeric"});
      colonneDate.push(`${this.#convMois(mois)} ${annee.slice(-2)}`); 
    });
    return colonneDate;
  }

  #convMois(mois){
  if (mois =='janvier'){return 'Janv.'}
  else if (mois =='février'){return 'Fév.'}
  else if (mois =='avril'){return 'Avr.'}
  else if (mois =='juillet'){return 'Juil.'}
  else if (mois =='septembre'){return 'Sept.'}
  else if (mois =='octobre'){return 'Oct.'}
  else if (mois =='novembre'){return 'Nov.'}
  else if (mois =='décembre'){return 'Déc.'}
  else{ return mois.slice(0,1).toUpperCase() + mois.slice(1); }
  }

  #convTimestampToPosition(date){
    let postion = date - this.dateDebutAffichage;
    postion /= this.ecartDate;
    postion *= this.largeurGraphGantt;
    //let postion = ((date - this.dateDebutAffichage) / this.ecartDate) * this.largeurGraphGantt;
    return postion;
  }

}

export { Gantt };