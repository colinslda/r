// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, application initialisée.');
    loadPieceList(); // Charger la liste des morceaux au démarrage

    // Événements pour le formulaire d'ajout/modification
    const pieceForm = document.getElementById('piece-form');
    pieceForm.addEventListener('submit', handlePieceFormSubmit);

    const cancelPieceFormButton = document.getElementById('cancel-piece-form');
    cancelPieceFormButton.addEventListener('click', cancelPieceForm);

    // Événements pour la liste des morceaux (tri)
    document.getElementById('sort-by-title').addEventListener('click', () => sortPieceList('title'));
    document.getElementById('sort-by-composer').addEventListener('click', () => sortPieceList('composer'));
    document.getElementById('sort-by-style').addEventListener('click', () => sortPieceList('style'));

    // Événements pour la section des notes de répétition
    document.getElementById('save-notes').addEventListener('click', saveRepetitionNotes);
    document.getElementById('cancel-notes').addEventListener('click', hideRepetitionNotesSection);


    // Enregistrement du Service Worker (si supporté)
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
});

function registerServiceWorker() {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker enregistré avec succès :', registration);
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement du Service Worker :', error);
        });
}

function handlePieceFormSubmit(event) {
    event.preventDefault(); // Empêcher la soumission par défaut du formulaire

    const pieceId = document.getElementById('piece-id').value;
    const title = document.getElementById('piece-title').value;
    const composer = document.getElementById('piece-composer').value;
    const style = document.getElementById('piece-style').value;
    const customStyleInput = document.getElementById('custom-style');
    const customStyle = customStyleInput.value.trim(); // Récupérer la valeur et supprimer les espaces inutiles
    const tempo = document.getElementById('piece-tempo').value;
    const partitionFile = document.getElementById('piece-partition').files[0];

    // Validation simple (titre obligatoire)
    if (!title) {
        alert('Le titre du morceau est obligatoire.');
        return;
    }

    let finalStyle = style;
    if (style === 'Autre' && customStyle) {
        finalStyle = customStyle; // Utiliser le style personnalisé si "Autre" est sélectionné et un style personnalisé est fourni
    } else if (style === 'Autre' && !customStyle) {
        alert('Veuillez spécifier un style personnalisé si "Autre" est sélectionné.');
        return; // Arrêter la soumission si "Autre" est sélectionné mais aucun style personnalisé n'est donné
    }


    const pieceData = {
        id: pieceId || generateUniqueId(), // Générer un ID unique si nouveau morceau
        titre: title,
        compositeur: composer,
        style: finalStyle,
        tempo: tempo ? parseInt(tempo) : null, // Convertir en nombre si tempo est fourni
        partition: partitionFile ? partitionFile.name : null // Stocker le nom du fichier pour l'instant
        // **Note:** Dans une application réelle, vous géreriez probablement l'upload et le stockage des fichiers partitions plus en détail.
    };

    if (pieceId) {
        updatePiece(pieceId, pieceData); // Mettre à jour un morceau existant
    } else {
        addPiece(pieceData); // Ajouter un nouveau morceau
    }

    loadPieceList(); // Recharger la liste après l'ajout/modification
    resetPieceForm(); // Réinitialiser le formulaire
}


function cancelPieceForm() {
    resetPieceForm();
}


function resetPieceForm() {
    document.getElementById('piece-id').value = '';
    document.getElementById('piece-title').value = '';
    document.getElementById('piece-composer').value = '';
    document.getElementById('piece-style').value = '';
    document.getElementById('custom-style').value = '';
    document.getElementById('piece-tempo').value = '';
    document.getElementById('piece-partition').value = ''; // Réinitialiser l'input de fichier aussi
    document.getElementById('custom-style').style.display = 'none'; // Cacher le champ style personnalisé
    document.getElementById('cancel-piece-form').style.display = 'none'; // Cacher le bouton annuler
}


function loadPieceList() {
    const pieceList = getAllPieces();
    displayPieceList(pieceList); // Afficher la liste dans l'UI (fonction définie dans ui.js)
}


function sortPieceList(sortBy) {
    const pieceList = getAllPieces();
    let sortedList;

    if (sortBy === 'title') {
        sortedList = pieceList.sort((a, b) => a.titre.localeCompare(b.titre));
    } else if (sortBy === 'composer') {
        sortedList = pieceList.sort((a, b) => (a.compositeur || '').localeCompare(b.compositeur || '')); // Gérer les compositeurs optionnels
    } else if (sortBy === 'style') {
        sortedList = pieceList.sort((a, b) => (a.style || '').localeCompare(b.style || '')); // Gérer les styles optionnels
    } else {
        return; // Tri non reconnu
    }

    displayPieceList(sortedList); // Afficher la liste triée
}


function saveRepetitionNotes() {
    const pieceId = document.getElementById('piece-id').value; // Réutiliser l'ID stocké temporairement dans le formulaire
    const notesText = document.getElementById('repetition-notes').value;

    if (pieceId) {
        addRepetitionNote(pieceId, notesText); // Fonction à implémenter dans pieces.js
        hideRepetitionNotesSection();
        alert('Notes enregistrées !');
    } else {
        alert('Erreur: ID du morceau non trouvé pour enregistrer les notes.');
    }
}

function hideRepetitionNotesSection() {
    document.getElementById('repetition-notes-section').style.display = 'none';
}


// Fonctions utilitaires (vous pouvez les déplacer dans un fichier util.js si vous en avez plus)
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15); // Générer un ID semi-aléatoire
}
