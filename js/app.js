// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, application initialisée.');
    loadPieceList();

// Événements pour le bouton "Ajouter une pièce"
    document.getElementById('add-piece-button').addEventListener('click', function() { // Ajout d'une fonction anonyme
        console.log("Le bouton 'Ajouter une pièce' a été cliqué !"); // AJOUTER CETTE LIGNE
        showPieceFormSection();
    });

    // Événements pour le formulaire d'ajout/modification
    const pieceForm = document.getElementById('piece-form');
    pieceForm.addEventListener('submit', handlePieceFormSubmit);

    const cancelPieceFormButton = document.getElementById('cancel-piece-form');
    cancelPieceFormButton.addEventListener('click', hidePieceFormSection);


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
    event.preventDefault();

    const pieceId = document.getElementById('piece-id').value;
    const title = document.getElementById('piece-title').value;
    const composer = document.getElementById('piece-composer').value;
    const category = document.getElementById('piece-category').value; // CHANGEMENT : Récupérer la catégorie
    const referenceLink = document.getElementById('piece-reference-link').value;


    if (!title) {
        alert('Le titre du morceau est obligatoire.');
        return;
    }

    if (!category) { // AJOUT : Validation de la catégorie obligatoire
        alert('Veuillez sélectionner une catégorie pour l\'œuvre.');
        return;
    }


    const pieceData = {
        id: pieceId || generateUniqueId(),
        titre: title,
        compositeur: composer,
        category: category, // CHANGEMENT : Utiliser la catégorie
        referenceLink: referenceLink,
        notes: []
    };

    if (pieceId) {
        updatePiece(pieceId, pieceData);
    } else {
        addPiece(pieceData);
    }

    loadPieceList();
    hidePieceFormSection();
}


function resetPieceForm() {
    document.getElementById('piece-id').value = '';
    document.getElementById('piece-title').value = '';
    document.getElementById('piece-composer').value = '';
    document.getElementById('piece-category').value = ''; // CHANGEMENT : Reset catégorie
    document.getElementById('piece-reference-link').value = '';
    document.getElementById('cancel-piece-form').style.display = 'none';
}

function loadPieceList() {
    const pieceList = getAllPieces();
    displayPieceListByCategory(pieceList); // CHANGEMENT : Utiliser displayPieceListByCategory
}


// SUPPRESSION DE LA FONCTION sortPieceList - plus nécessaire avec les catégories
/*
function sortPieceList(sortBy) { ... }
*/


function saveRepetitionNotes() {
    const pieceId = document.getElementById('piece-id').value;
    const notesText = document.getElementById('repetition-notes').value;

    if (pieceId) {
        addRepetitionNote(pieceId, notesText);
        hideRepetitionNotesSection();
        alert('Notes enregistrées !');
    } else {
        alert('Erreur: ID du morceau non trouvé pour enregistrer les notes.');
    }
}

function hideRepetitionNotesSection() {
    document.getElementById('repetition-notes-section').style.display = 'none';
}


// Fonctions utilitaires
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}
