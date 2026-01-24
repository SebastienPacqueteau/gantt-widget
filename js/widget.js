// ===============================
// ====== script principale ======
// ===============================

import { Gantt } from './gantt.js';
import { Config } from './config.js';


//Gantt
const titreGantt = new Gantt('titreGantt');
const gantt = new Gantt('gantt');

//panneau de configuration
const config = new Config();

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
  //console.log(config);

  //Dessiner le Gantt
  titreGantt.ajusterDimension();
  gantt.height = 1500;
  gantt.ajusterDimension();
  gantt.dessiner(Array.from(config.colonnesG, obj => obj.titre));
})();

function afficherLesResultats(){
  config.optionsPanneau();
}

function basculerPanneauConfiguration() {
  const panneauConfig = document.getElementById('panneauConfig');
  panneauConfig.classList.toggle('collapsed');
}

// liste des évènements
document.getElementById('afficherLesResultats').addEventListener("click", afficherLesResultats);
document.getElementById('ouvrirConfig').addEventListener("click", basculerPanneauConfiguration);
document.getElementById('fermerConfig').addEventListener("click", basculerPanneauConfiguration);
