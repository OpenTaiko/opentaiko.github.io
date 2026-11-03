<script>
    // The round preview button of every song card; the parent owns the audio.
    // The click stops here, so a click on it never also opens the bar it sits on.
    import { createEventDispatcher } from "svelte";

    export let playing = false;
    export let label = '';
    export let size = 32;

    const dispatch = createEventDispatcher();
    const press = (e) => { e.stopPropagation(); dispatch('click'); };
</script>

<button
    type="button"
    class="play-round"
    style="width:{size}px; height:{size}px"
    aria-label={(playing ? 'Pause ' : 'Play ') + label}
    aria-pressed={playing}
    on:click={press}
>
    {#if playing}
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
    {:else}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
    {/if}
</button>
