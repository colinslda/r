document.addEventListener('DOMContentLoaded', () => {
    const formMorceau = document.getElementById('form-morceau');
    const morceauxListeUl = document.getElementById('morceaux-liste');
    const notesSection = document.getElementById('notes-repetition');
    const btnListe = document.getElementById('btn-liste');
    const btnNotes = document.getElementById('btn-notes');
    const morceauIndexInput = document.getElementById('morceau-index');
    const btnAjouterModifier = document.getElementById('btn-ajouter-modifier');
    const btnAnnulerModifier = document.getElementById('btn-annuler-modifier');
    const triSelection = document.getElementById('tri-selection');
    const notesTextarea = document.getElementById('notes');
    const notesTitreMorceau = document.getElementById('notes-titre-morceau'); // Récupérer le titre dynamique des notes
    const btnRetourListe = document.getElementById('btn-retour-liste'); // Récupérer le bouton "Retour à la liste"


    const compositeurInput = document.getElementById('compositeur');
    const compositeurAutocompleteList = document.getElementById('compositeur-autocomplete-list');
    const styleInput = document.getElementById('style');
    const styleAutocompleteList = document.getElementById('style-autocomplete-list');

    let morceaux = []; // Pour stocker les morceaux temporairement en mémoire

    // Données pour l'autocomplétion (vous pouvez les étendre)
    const compositeursDisponibles = ["Bach", "Beethoven", "Mozart", "Brahms", "Debussy", "Ravel", "Tchaikovsky", "Chopin", "Schubert"];
    const stylesDisponibles = ["Concerto", "Sonate", "Technique", "Caprices/Etudes"];

    let morceauEnEditionIndex = -1; // Index du morceau en cours d'édition, -1 si ajout
    let morceauEnNotesIndex = -1; // Index du morceau dont les notes sont affichées, -1 si aucune note affichée


    // --- Fonctions d'Autocomplétion (inchangées) ---
    function autocomplétion(inputElement, listeAutocompleteElement, suggestions) { /* ... */ }
    autocomplétion(compositeurInput, compositeurAutocompleteList, compositeursDisponibles);
    autocomplétion(styleInput, styleAutocompleteList, stylesDisponibles);


    // Fonction pour afficher les morceaux dans la liste (modifiée)
    function afficherMorceaux() {
        morceauxListeUl.innerHTML = '';
        morceaux.forEach((morceau, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${morceau.titre} - ${morceau.compositeur} (${morceau.style})</span>
                <div class="actions-morceau">
                    <button class="btn-modifier" data-index="${index}">Modifier</button>
                    <button class="btn-supprimer" data-index="${index}">Supprimer</button>
                </div>
            `;
            li.addEventListener('click', () => afficherNotesMorceau(index)); // Ajouter un event listener sur le LI pour afficher les notes
            morceauxListeUl.appendChild(li);
        });
        ajouterEventListenersActions();
    }

    function ajouterEventListenersActions() { /* ... (inchangée) ... */ }
    function supprimerMorceau(index) { /* ... (inchangée) ... */ }
    function modifierMorceau(index) { /* ... (inchangée) ... */ }


    // --- Fonctionnalité Afficher Notes Morceau ---
    function afficherNotesMorceau(index) {
        morceauEnNotesIndex = index; // Mémoriser l'index du morceau dont les notes sont affichées
        const morceau = morceaux[index];

        notesTitreMorceau.textContent = `Notes de répétition pour ${morceau.titre}`; // Mettre à jour le titre de la section notes
        notesTextarea.value = morceau.notes || ''; // Remplir la textarea avec les notes existantes (ou vide si pas de notes)

        notesSection.classList.remove('hidden'); // Afficher la section notes
        btnRetourListe.classList.remove('hidden'); // Afficher le bouton "Retour à la liste"
        document.getElementById('liste-morceaux').classList.add('hidden'); // Cacher la liste des morceaux
        btnNotes.classList.add('active'); // Activer le bouton de navigation "Notes"
        btnListe.classList.remove('active'); // Désactiver le bouton de navigation "Morceaux"
    }


    // Fonctionnalité Annuler Modification (inchangée)
    btnAnnulerModifier.addEventListener('click', function() { /* ... (inchangée) ... */ });


    // Gestion de la soumission du formulaire (modifiée pour initialiser les notes)
    formMorceau.addEventListener('submit', function(event) {
        event.preventDefault();

        const titre = document.getElementById('titre').value;
        const compositeur = document.getElementById('compositeur').value;
        const style = document.getElementById('style').value;
        const indexModification = parseInt(morceauIndexInput.value);

        const morceauModifie = {
            titre: titre,
            compositeur: compositeur,
            style: style,
            notes: indexModification >= 0 ? morceaux[indexModification].notes : "" // Conserver les notes si modification, sinon notes vides à la création
        };

        if (indexModification >= 0) {
            morceaux[indexModification] = morceauModifie;
        } else {
            morceaux.push(morceauModifie);
        }

        afficherMorceaux();

        formMorceau.reset();
        morceauIndexInput.value = -1;
        btnAjouterModifier.textContent = "Ajouter morceau";
        btnAnnulerModifier.classList.add('hidden');
        document.querySelector('#ajout-morceau h2').textContent = "Ajouter un morceau";
    });


    // --- Fonctionnalité Sauvegarder Notes ---
    document.getElementById('btn-sauvegarder-notes').addEventListener('click', function() {
        if (morceauEnNotesIndex >= 0) {
            const notes = notesTextarea.value;
            morceaux[morceauEnNotesIndex].notes = notes; // Sauvegarder les notes dans l'objet morceau correspondant
            alert(`Notes sauvegardées pour ${morceaux[morceauEnNotesIndex].titre}`); // Feedback utilisateur (peut être amélioré)
            // Optionnel :  Revenir à la liste des morceaux après sauvegarde, ou rester sur la page des notes
        }
    });


    // --- Fonctionnalité Retour à la Liste des Morceaux ---
    btnRetourListe.addEventListener('click', function() {
        notesSection.classList.add('hidden'); // Cacher la section notes
        btnRetourListe.classList.add('hidden'); // Cacher le bouton "Retour à la liste"
        document.getElementById('liste-morceaux').classList.remove('hidden'); // Afficher la liste des morceaux
        btnListe.classList.add('active'); // Activer le bouton de navigation "Morceaux"
        btnNotes.classList.remove('active'); // Désactiver le bouton de navigation "Notes"
        morceauEnNotesIndex = -1; // Réinitialiser l'index du morceau en notes
    });


    // --- Fonctionnalité Tri des Morceaux (inchangée) ---
    triSelection.addEventListener('change', function() { /* ... (inchangée) ... */ });


    // Navigation entre sections (légèrement modifiée pour cacher le bouton retour)
    btnNotes.addEventListener('click', () => {
        notesSection.classList.remove('hidden');
        btnRetourListe.classList.remove('hidden'); // Afficher le bouton "Retour" quand on va sur la section Notes depuis la nav
        document.getElementById('liste-morceaux').classList.add('hidden');
        btnNotes.classList.add('active');
        btnListe.classList.remove('active');
    });

    btnListe.addEventListener('click', () => {
        notesSection.classList.add('hidden');
        btnRetourListe.classList.add('hidden'); // Cacher le bouton "Retour" quand on revient sur la liste
        document.getElementById('liste-morceaux').classList.remove('hidden');
        btnListe.classList.add('active');
        btnNotes.classList.remove('active');
    });


    // Afficher les morceaux initiaux au chargement (inchangé)
    afficherMorceaux();
});
