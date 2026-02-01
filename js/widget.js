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
  requiredAccess: 'read table',
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
  titreGantt.ajusterDimension(20);
  //gantt.height = 1500;
  gantt.ajusterDimension();
  gantt.dessiner();
})();

function afficherLesResultats(){
  config.optionsPanneau();
}

async function basculerPanneauConfiguration() {
  const panneauConfig = document.getElementById('panneauConfig');
  if(!panneauConfig.classList.contains('collapsed')){
    await projets.majListeProjets();
    gantt.redessiner();
  }
  panneauConfig.classList.toggle('collapsed');
}

// liste des évènements
document.getElementById('afficherLesResultats').addEventListener("click", afficherLesResultats);
document.getElementById('ouvrirConfig').addEventListener("click", basculerPanneauConfiguration);
document.getElementById('fermerConfig').addEventListener("click", basculerPanneauConfiguration);
