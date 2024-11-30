<script lang="ts">
    const { row, col, piece } = $props()
    const output = row + col
</script>

<div
    class={`cell ${output % 2 == 0 ? "dark" : "light"}`}
    data-dropzone
>
    {#if !!piece}
        <img 
            src={piece}
            alt="chess piece"
            data-draggable
        />
    {/if}
</div>

<style>
    img {
        height: 100%;
        aspect-ratio: 1 / 1;
        cursor: pointer;
    }
    .cell {
        height: 100%;
        min-width: 50px;
        min-height: 50px;
        aspect-ratio: 1 / 1;
    }

    .dark {
        background-color: #2d2d2d;
    }

    .light {
        background-color: #0d0d0d;
    }
</style>
