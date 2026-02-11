// ===============================
// ====== script principale ======
// ===============================

import { Gantt } from './gantt.js';
import { config } from './config.js';
import { projets } from './projet.js';

//Création du Gantt
const titreGantt = new Gantt('titreGantt');
const gantt = new Gantt('gantt');

grist.ready({
  onEditOptions() {
    basculerPanneauConfiguration();
  },
  columns: config.colonnesNecessaires,
  requiredAccess: 'full',
  allowSelectBy: false
});

(async function start(){
  //configuration
  await config.grist();
  await projets.ajouterLesProjets();
  //console.log(config);

  titreGantt.init();
  gantt.init();

  //Dessiner le Gantt
  titreGantt.dessinerBarreTitre();
  gantt.dessiner();
})();

async function afficherLesResultats(){
  await config.optionsPanneau();
}

async function basculerPanneauConfiguration() {
  const panneauConfig = document.getElementById('panneauConfig');
  if(!panneauConfig.classList.contains('collapsed')){
    await projets.majListeProjets();
    redessiner();
  }
  panneauConfig.classList.toggle('collapsed');
}

function redessiner() {
  gantt.redessiner();
  titreGantt.redessinerTitre();
}

// liste des évènements
document.getElementById('afficherLesResultats').addEventListener("click", afficherLesResultats);
document.getElementById('ouvrirConfig').addEventListener("click", basculerPanneauConfiguration);
document.getElementById('fermerConfig').addEventListener("click", basculerPanneauConfiguration);

export {redessiner};