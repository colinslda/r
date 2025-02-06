// js/pieces.js

const PIECES_STORAGE_KEY = 'musicalPieces';

function getAllPieces() {
    const piecesString = localStorage.getItem(PIECES_STORAGE_KEY);
    return piecesString ? JSON.parse(piecesString) : [];
}

function saveAllPieces(pieces) {
    localStorage.setItem(PIECES_STORAGE_KEY, JSON.stringify(pieces));
}

function addPiece(pieceData) {
    const pieces = getAllPieces();
    pieces.push(pieceData);
    saveAllPieces(pieces);
}

function getPiece(pieceId) {
    const pieces = getAllPieces();
    return pieces.find(piece => piece.id === pieceId);
}

function updatePiece(pieceId, updatedPieceData) {
    let pieces = getAllPieces();
    pieces = pieces.map(piece => {
        if (piece.id === pieceId) {
            return updatedPieceData; // Remplacer avec les nouvelles données
        }
        return piece;
    });
    saveAllPieces(pieces);
}

function deletePiece(pieceId) {
    let pieces = getAllPieces();
    pieces = pieces.filter(piece => piece.id !== pieceId); // Filtrer pour exclure le morceau à supprimer
    saveAllPieces(pieces);
}

function addRepetitionNote(pieceId, noteText) {
    let piece = getPiece(pieceId);
    if (piece) {
        piece.notes = piece.notes || []; // Initialiser le tableau de notes si nécessaire
        piece.notes.push({
            date: new Date().toISOString(), // Date/heure de la note
            text: noteText
        });
        updatePiece(pieceId, piece); // Mettre à jour le morceau avec les nouvelles notes
    }
}

function getRepetitionNotes(pieceId) {
    const piece = getPiece(pieceId);
    return piece ? piece.notes || [] : [];
}
