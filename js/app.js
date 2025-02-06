// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, application initialisée.');
    loadPieceList();

    // Événements pour le bouton "Ajouter une pièce"
    document.getElementById('add-piece-button').addEventListener('click', showPieceFormSection);

    // Événements pour le formulaire d'ajout/modification
    const pieceForm = document.getElementById('piece-form');
    pieceForm.addEventListener('submit', handlePieceFormSubmit);

    const cancelPieceFormButton = document.getElementById('cancel-piece-form');
    cancelPieceFormButton.addEventListener('click', hidePieceFormSection);

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
    event.preventDefault();

    const pieceId = document.getElementById('piece-id').value;
    const title = document.getElementById('piece-title').value;
    const composer = document.getElementById('piece-composer').value;
    const style = document.getElementById('piece-style').value;
    const customStyleInput = document.getElementById('custom-style');
    const customStyle = customStyleInput.value.trim();
    const referenceLink = document.getElementById('piece-reference-link').value;

    if (!title) {
        alert('Le titre du morceau est obligatoire.');
        return;
    }

    let finalStyle = style;
    if (style === 'Autre' && customStyle) {
        finalStyle = customStyle;
    } else if (style === 'Autre' && !customStyle) {
        alert('Veuillez spécifier un style personnalisé si "Autre" est sélectionné.');
        return;
    }


    const pieceData = {
        id: pieceId || generateUniqueId(),
        titre: title,
        compositeur: composer,
        style: finalStyle,
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
    document.getElementById('piece-style').value = '';
    document.getElementById('custom-style').value = '';
    document.getElementById('piece-reference-link').value = '';
    document.getElementById('custom-style').style.display = 'none';
    document.getElementById('cancel-piece-form').style.display = 'none';
}

function loadPieceList() {
    const pieceList = getAllPieces();
    displayPieceList(pieceList);
}


function sortPieceList(sortBy) {
    const pieceList = getAllPieces();
    let sortedList;

    if (sortBy === 'title') {
        sortedList = pieceList.sort((a, b) => a.titre.localeCompare(b.titre));
    } else if (sortBy === 'composer') {
        sortedList = pieceList.sort((a, b) => (a.compositeur || '').localeCompare(b.compositeur || ''));
    } else if (sortBy === 'style') {
        sortedList = pieceList.sort((a, b) => (a.style || '').localeCompare(b.style || ''));
    } else {
        return; // Tri non reconnu
    }

    displayPieceList(sortedList);
}


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
