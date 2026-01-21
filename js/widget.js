// ===============================
// ====== script principale ======
// ===============================



function basculerPanneauOption() {
		const panneauConfig = document.getElementById('panneauConfig');
		panneauConfig.classList.toggle('collapsed');
}

document.getElementById('ouvrirConfig').addEventListener("click", basculerPanneauOption);
document.getElementById('fermerConfig').addEventListener("click", basculerPanneauOption);
