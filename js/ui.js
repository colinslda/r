// js/ui.js


const pieceCategories = ["Concerto", "Sonate", "Pièces solo", "Etudes/Caprices", "Techniques"]; // Définir l'ordre des catégories

function displayPieceListByCategory(pieces) { // CHANGEMENT : Fonction pour afficher par catégorie
    pieceCategories.forEach(category => { // Iterer sur les catégories définies
        const categoryPieces = pieces.filter(piece => piece.category === category); // Filtrer les morceaux par catégorie
        const categoryId = getCategoryId(category); // Obtenir l'élément UL pour cette catégorie

        console.log("Catégorie:", category); // Affiche le nom de la catégorie
        console.log("ID généré par getCategoryId:", categoryId); // Affiche l'ID généré
        const categoryListElement = document.getElementById(categoryId); // Essaye de récupérer l'élément UL
        console.log("Résultat de document.getElementById:", categoryListElement); // Affiche le résultat de getElementById

        categoryListElement.innerHTML = ''; // Vider la liste précédente de cette catégorie

        if (categoryPieces.length === 0) {
            categoryListElement.innerHTML = '<p>Aucun morceau ajouté dans cette catégorie pour le moment.</p>';
        } else {
            categoryPieces.forEach(piece => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="piece-item-info">
                        <h3><strong>${piece.compositeur || 'Inconnu'}</strong></h3>  <p>${piece.titre}</p> </div>
                    <div class="piece-actions">
                        <button class="edit-piece" data-id="${piece.id}">Modifier</button>
                        <button class="delete-piece" data-id="${piece.id}">Supprimer</button>
                        <button class="add-notes-piece" data-id="${piece.id}">Notes</button>
                    </div>
                `;
                categoryListElement.appendChild(listItem);
            });
        }
    });

    attachListEventListeners(); // Attacher les listeners après avoir rendu toutes les listes
}


function getCategoryId(categoryName) { // Fonction utilitaire pour obtenir l'ID de l'UL de catégorie
    return `piece-${categoryName.toLowerCase().replace(/[^a-z]+/g, '')}-list`; // CORRECTION : Supprimer le tiret supplémentaire après 'piece-list'
}


function attachListEventListeners() {
    const pieceCategorySection = document.getElementById('piece-category-section'); // CHANGEMENT : Listener sur la section catégorie entière

    pieceCategorySection.addEventListener('click', function(event) { // CHANGEMENT : Listener sur la section catégorie entière
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


function showPieceFormSection() {
    document.getElementById('piece-form-section').style.display = 'block';
    document.getElementById('add-piece-button-section').style.display = 'none';
    document.getElementById('piece-form-section').scrollIntoView({behavior: 'smooth'});
    document.getElementById('cancel-piece-form').style.display = 'inline-block';
}

function hidePieceFormSection() {
    document.getElementById('piece-form-section').style.display = 'none';
    document.getElementById('add-piece-button-section').style.display = 'block';
    resetPieceForm();
}


function editPieceForm(pieceId) {
    const piece = getPiece(pieceId);
    if (piece) {
        showPieceFormSection();
        document.getElementById('piece-id').value = piece.id;
        document.getElementById('piece-title').value = piece.titre;
        document.getElementById('piece-composer').value = piece.compositeur || '';
        document.getElementById('piece-category').value = piece.category || ''; // CHANGEMENT : Remplir le champ catégorie
        document.getElementById('piece-reference-link').value = piece.referenceLink || '';
        document.getElementById('cancel-piece-form').style.display = 'inline-block';
        document.getElementById('piece-form-section').scrollIntoView({behavior: 'smooth'});
    }
}


function deleteConfirmation(pieceId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce morceau ?")) {
        deletePiece(pieceId);
        loadPieceList();
    }
}

function showRepetitionNotesSection(pieceId) {
    const piece = getPiece(pieceId);
    if (piece) {
        document.getElementById('piece-id').value = pieceId;
        document.getElementById('notes-piece-title').textContent = piece.titre;
        document.getElementById('repetition-notes').value = getRepetitionNotesText(piece.notes);
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
