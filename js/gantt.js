// ==========================
// ====== Module Gantt ======
// ==========================

import { projets } from './projet.js';

class Gantt{
  constructor(id){
    this.element = document.getElementById(id);
    this._width = 2000;
    this._height = 20;
    this.fontTitre = '24px Marianne';
    this.font = '20px Marianne';
    this.hauteurTitre = 90;
    this.hauteurLigne = 30;
    this.margeColonne = 20;
  }

  init(){
    this.largeurColonnesG = projets.largeurColonnesG + ((projets.nbColonnesG + 2) * this.margeColonne);
    this.largeurColonnesD = projets.largeurColonnesD + ((projets.nbColonnesD + 2) * this.margeColonne);
  }

  get width(){ return this._width; }
  get height(){ return this._height; }
  set height(newHeight){ this._height = newHeight; }

  toString(){
    //console.log(this, this.element);
    return `Canvas ${this.element.id} : ${this._width} x ${this._height}`;
  }

  ajusterDimension(hauteur){
    this.element.width = this._width;
    this.element.height = (hauteur) ? hauteur : this.hauteurTitre + (projets.nombreLignes * this.hauteurLigne);
  }

  async redessiner(){
    const ctx = this.element.getContext('2d');
    ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.init();
    await this.dessiner();
  }

  async dessiner(){
    // création de la ligne titre ok
    this.ligneTitres(projets.titreColonnesG);

    let hauteur = this.hauteurTitre;
    projets.liste.forEach((projet)=>{
      hauteur += this.ajouterLigneProjet(projet, hauteur);
    });

    //console.log("test largeurColonnesG:",this.largeurColonnesG, projets.largeurColonnesG, projets.nbColonnesG, this.margeColonne);
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
      //console.log(objColonne);
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
    //console.log(projet.date_debut, projet.date_fin);
    ctx.beginPath();
    ctx.roundRect(this.largeurColonnesG, hauteur, 100, 20, 25);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
  }

  ligneTitres(colonnes){
    const ctx = this.element.getContext('2d');
    ctx.font = this.fontTitre;
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let x = this.margeColonne;
    colonnes.forEach((colonne, i) => {
      //console.log(colonne.titre, Number(colonne.largeur));
      ctx.fillText(colonne.titre, x, 50, Number(colonne.largeur));
      x += Number(colonne.largeur) + this.margeColonne;
    });
  }

}

export { Gantt };
