// ==========================
// ====== Module Gantt ======
// ==========================

class Gantt{
  constructor(id){
    this.element = document.getElementById(id);
    this._width = 2000;
    this._height = 20;
    this._listeProjets = [];
  }

  get width(){
    return this._width;
  }

  get height(){
    return this._height;
  }

  get listeProjets(){
    return this._listeProjets;
  }

  ajouter(projet){
    this._listeProjets.push(projet);
  }

  set height(newHeight){
    this._height = newHeight;
  }

  toString(){
    //console.log(this, this.element);
    return `Canvas ${this.element.id} : ${this._width} x ${this._height}`;
  }

  ajusterDimension(){
    this.element.width = this._width;
    this.element.height = this._height;
  }

  dessiner(listeTitres){
    const ctx = this.element.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(20, 10, 1460, 20);
    this.ligneTitres(listeTitres);
  }

  ligneTitres(listeTitres){
    const ctx = this.element.getContext('2d');
    ctx.fillStyle = 'blue';
    listeTitres.forEach((titre, i) => {
      ctx.fillText(titre, 20 + 200*i, 50);
    });


  }
}

export { Gantt };
