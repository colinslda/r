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

    const compositeurInput = document.getElementById('compositeur');
    const compositeurAutocompleteList = document.getElementById('compositeur-autocomplete-list');
    const styleInput = document.getElementById('style');
    const styleAutocompleteList = document.getElementById('style-autocomplete-list');

    let morceaux = []; // Pour stocker les morceaux temporairement en mémoire

    // Données pour l'autocomplétion (vous pouvez les étendre)
    const compositeursDisponibles = ["Bach", "Beethoven", "Mozart", "Brahms", "Debussy", "Ravel", "Tchaikovsky", "Chopin", "Schubert"];
    const stylesDisponibles = ["Concerto", "Sonate", "Technique", "Caprices/Etudes"];

    let morceauEnEditionIndex = -1; // Index du morceau en cours d'édition, -1 si ajout


    // --- Fonctions d'Autocomplétion ---
    function autocomplétion(inputElement, listeAutocompleteElement, suggestions) {
        inputElement.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            listeAutocompleteElement.innerHTML = ''; // Efface la liste précédente
            if (!inputValue) {
                listeAutocompleteElement.classList.remove('show'); // Cache si input vide
                return;
            }

            const suggestionsFiltrées = suggestions.filter(suggestion =>
                suggestion.toLowerCase().startsWith(inputValue)
            );

            if (suggestionsFiltrées.length > 0) {
                listeAutocompleteElement.classList.add('show');
                suggestionsFiltrées.forEach(suggestion => {
                    const li = document.createElement('li');
                    li.textContent = suggestion;
                    li.addEventListener('click', function() {
                        inputElement.value = suggestion;
                        listeAutocompleteElement.classList.remove('show');
                    });
                    listeAutocompleteElement.appendChild(li);
                });
            } else {
                listeAutocompleteElement.classList.remove('show'); // Cache si pas de suggestions
            }
        });

        // Cacher la liste si on clique en dehors
        document.addEventListener('click', function(event) {
            if (!inputElement.parentNode.contains(event.target)) {
                listeAutocompleteElement.classList.remove('show');
            }
        });
    }

    // Initialiser l'autocomplétion pour compositeur et style
    autocomplétion(compositeurInput, compositeurAutocompleteList, compositeursDisponibles);
    autocomplétion(styleInput, styleAutocompleteList, stylesDisponibles);


    // Fonction pour afficher les morceaux dans la liste (inchangée)
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
            morceauxListeUl.appendChild(li);
        });
        ajouterEventListenersActions();
    }

    function ajouterEventListenersActions() {
        document.querySelectorAll('.btn-supprimer').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                supprimerMorceau(index);
            });
        });
        document.querySelectorAll('.btn-modifier').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                modifierMorceau(index);
            });
        });
    }

    function supprimerMorceau(index) {
        morceaux.splice(index, 1);
        afficherMorceaux();
    }


    // --- Fonctionnalité Modifier Morceau ---
    function modifierMorceau(index) {
        morceauEnEditionIndex = index; // Stocker l'index du morceau en édition
        const morceau = morceaux[index]; // Récupérer le morceau à modifier

        // Pré-remplir le formulaire avec les données du morceau
        document.getElementById('titre').value = morceau.titre;
        document.getElementById('compositeur').value = morceau.compositeur;
        document.getElementById('style').value = morceau.style;
        morceauIndexInput.value = index; // Stocker l'index dans l'input caché
        btnAjouterModifier.textContent = "Modifier morceau"; // Changer le texte du bouton
        btnAnnulerModifier.classList.remove('hidden'); // Afficher le bouton Annuler
        document.querySelector('#ajout-morceau h2').textContent = "Modifier le morceau"; // Changer le titre de la section

        // Scroll jusqu'à la section d'ajout pour une meilleure UX
        document.getElementById('ajout-morceau').scrollIntoView({behavior: 'smooth'});
    }

    // Fonction pour annuler la modification
    btnAnnulerModifier.addEventListener('click', function() {
        morceauEnEditionIndex = -1; // Réinitialiser l'index d'édition
        formMorceau.reset(); // Réinitialiser le formulaire
        morceauIndexInput.value = -1; // Réinitialiser l'input caché de l'index
        btnAjouterModifier.textContent = "Ajouter morceau"; // Remettre le texte du bouton à "Ajouter"
        btnAnnulerModifier.classList.add('hidden'); // Cacher le bouton Annuler
        document.querySelector('#ajout-morceau h2').textContent = "Ajouter un morceau"; // Remettre le titre de la section à "Ajouter"
    });


    // Gestion de la soumission du formulaire (modifiée pour gérer l'ajout ET la modification)
    formMorceau.addEventListener('submit', function(event) {
        event.preventDefault();

        const titre = document.getElementById('titre').value;
        const compositeur = document.getElementById('compositeur').value;
        const style = document.getElementById('style').value;
        const indexModification = parseInt(morceauIndexInput.value); // Récupérer l'index depuis l'input caché

        const morceauModifie = {
            titre: titre,
            compositeur: compositeur,
            style: style
        };

        if (indexModification >= 0) {
            // Modification d'un morceau existant
            morceaux[indexModification] = morceauModifie; // Mettre à jour le morceau à l'index
        } else {
            // Ajout d'un nouveau morceau
            morceaux.push(morceauModifie);
        }

        afficherMorceaux(); // Réafficher la liste

        formMorceau.reset(); // Réinitialiser le formulaire
        morceauIndexInput.value = -1; // Réinitialiser l'index caché
        btnAjouterModifier.textContent = "Ajouter morceau"; // Remettre le texte du bouton à "Ajouter"
        btnAnnulerModifier.classList.add('hidden'); // Cacher le bouton Annuler
        document.querySelector('#ajout-morceau h2').textContent = "Ajouter un morceau"; // Remettre le titre à "Ajouter"
    });


    // --- Fonctionnalité Tri des Morceaux ---
    triSelection.addEventListener('change', function() {
        const critereTri = this.value;
        if (critereTri === 'aucun') {
            // Pas de tri, réafficher dans l'ordre actuel (ou ordre d'ajout si vous voulez un ordre par défaut)
            afficherMorceaux(); // Réaffiche simplement la liste
            return;
        }

        morceaux.sort((a, b) => {
            const valeurA = a[critereTri].toLowerCase(); // Convertir en minuscules pour un tri insensible à la casse
            const valeurB = b[critereTri].toLowerCase();

            if (valeurA < valeurB) {
                return -1;
            }
            if (valeurA > valeurB) {
                return 1;
            }
            return 0; // valeurs égales
        });
        afficherMorceaux(); // Réafficher la liste triée
    });


    // Navigation entre sections (inchangée)
    btnNotes.addEventListener('click', () => { /* ... */ });
    btnListe.addEventListener('click', () => { /* ... */ });


    // Afficher les morceaux initiaux au chargement (inchangé)
    afficherMorceaux();
});
