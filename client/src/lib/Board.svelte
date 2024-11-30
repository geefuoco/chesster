<script lang="ts">
    import Cell from "./Cell.svelte"
    // There is also an option to store all of the chess pieces
    // in the public folder, but there is not any clear indication
    // which way is better
    import bPawn from "../assets/pawn_dark.svg"
    import lPawn from "../assets/pawn_light.svg"
    import bKnight from "../assets/knight_dark.svg"
    import lKnight from "../assets/knight_light.svg"
    import bKing from "../assets/king_dark.svg"
    import lKing from "../assets/king_light.svg"
    import bQueen from "../assets/queen_dark.svg"
    import lQueen from "../assets/queen_light.svg"
    import bBishop from "../assets/bishop_dark.svg"
    import lBishop from "../assets/bishop_light.svg"
    import bRook from "../assets/rook_dark.svg"
    import lRook from "../assets/rook_light.svg"


    function setupBoard() {
        let board = Array(64)
        for (let i = 0; i < board.length; i++) {
            // First row will be black pieces
            if (i === 0 || i === 7) {
                board[i] = bRook
            }

            if (i === 1 || i === 6) {
                board[i] = bBishop
            }

            if (i === 2 || i === 5) {
                board[i] = bKnight
            }

            if (i === 3) {
                board[i] = bQueen
            }

            if (i === 4) {
                board[i] = bKing
            }
            // Second row will be black pawns
            if (i >= 8 && i <= 15) {
                board[i] = bPawn
            }

            // First row will be white pawns
            if (i >= 48 && i <= 55) {
                board[i] = lPawn
            }
            // Second row will be white pieces
            if (i === 56 || i === 63) {
                board[i] = lRook
            }

            if (i === 57 || i === 62) {
                board[i] = lBishop
            }

            if (i === 58 || i === 61) {
                board[i] = lKnight
            }

            if (i === 59) {
                board[i] = lQueen
            }

            if (i === 60) {
                board[i] = lKing
            }
        }
        return board
    }
    let cells = setupBoard()
</script>

<div class="board">
    {#each cells as cell, i}
        <Cell col={i % 8} row={Math.floor(i / 8)} piece={cell} />
    {/each}
</div>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        max-width: 80vh;
        width: 80vh;
        height: 80vh;
        aspect-ratio: 1 / 1;
    }
</style>
