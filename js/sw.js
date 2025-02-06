// js/ui.js

function displayPieceList(pieces) {
    const pieceListElement = document.getElementById('piece-list');
    pieceListElement.innerHTML = ''; // Vider la liste actuelle

    if (pieces.length === 0) {
        pieceListElement.innerHTML = '<p>Aucun morceau ajouté pour le moment.</p>';
        return;
    }

    pieces.forEach(piece => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="piece-item-info">
                <h3>${piece.titre}</h3>
                <p>Compositeur: ${piece.compositeur || 'Inconnu'}</p>
                <p>Style: ${piece.style || 'Non spécifié'}</p>
            </div>
            <div class="piece-actions">
                <button class="edit-piece" data-id="${piece.id}">Modifier</button>
                <button class="delete-piece" data-id="${piece.id}">Supprimer</button>
                <button class="add-notes-piece" data-id="${piece.id}">Notes</button>
            </div>
        `;
        pieceListElement.appendChild(listItem);
    });

    // Ajouter les listeners d'événements après avoir ajouté les éléments à la liste (délégation d'événements)
    attachListEventListeners();
}


function attachListEventListeners() {
    const pieceListElement = document.getElementById('piece-list');

    pieceListElement.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-piece')) {
            const pieceId = event.target.dataset.id;
            editPieceForm(pieceId);
        } else if (event.target.classList.contains('delete-piece')) {
            const pieceId = event.target.dataset.id;
            deleteConfirmation(pieceId);
        } else if (event.target.classList.contains('add-notes-piece')) {
            const pieceId = event.target.dataset.id;
            showRepetitionNotesSection(pieceId);
        }
    });
}


function editPieceForm(pieceId) {
    const piece = getPiece(pieceId);
    if (piece) {
        document.getElementById('piece-id').value = piece.id;
        document.getElementById('piece-title').value = piece.titre;
        document.getElementById('piece-composer').value = piece.compositeur || '';
        document.getElementById('piece-style').value = piece.style || '';
        document.getElementById('piece-tempo').value = piece.tempo || '';
        // **Partition**:  Réfléchir à comment gérer l'affichage/modification du nom de fichier de partition si nécessaire.
        document.getElementById('cancel-piece-form').style.display = 'inline-block'; // Afficher le bouton annuler
        document.getElementById('piece-form-section').scrollIntoView({behavior: 'smooth'}); // Faire défiler vers le formulaire
    }
}


function deleteConfirmation(pieceId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce morceau ?")) {
        deletePiece(pieceId);
        loadPieceList(); // Recharger la liste après suppression
    }
}

function showRepetitionNotesSection(pieceId) {
    const piece = getPiece(pieceId);
    if (piece) {
        document.getElementById('piece-id').value = pieceId; // Stocker temporairement l'ID du morceau dans le formulaire de notes
        document.getElementById('notes-piece-title').textContent = piece.titre;
        document.getElementById('repetition-notes').value = getRepetitionNotesText(piece.notes); // Fonction à implémenter pour formater les notes
        document.getElementById('repetition-notes-section').style.display = 'block';
        document.getElementById('repetition-notes-section').scrollIntoView({behavior: 'smooth'});
    }
}

function getRepetitionNotesText(notesArray) {
    if (!notesArray || notesArray.length === 0) {
        return '';
    }
    return notesArray.map(note => {
        const date = new Date(note.date).toLocaleDateString() + " " + new Date(note.date).toLocaleTimeString();
        return `- ${date}: ${note.text}`;
    }).join('\n');
}
