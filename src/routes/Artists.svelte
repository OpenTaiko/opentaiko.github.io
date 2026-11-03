<script>
    import { onMount } from "svelte";
    import { _ } from 'svelte-i18n';
    import ComposerList from "../components/ComposerList.svelte";
    import { loadComposers } from "../lib/composers.js";

    let loading = true;
    let artists = [];

    onMount(async () => {
        ({ artists } = await loadComposers());
        loading = false;
    });
</script>

<h1 class="sky-title">{$_('artists.title')}</h1>

<div class="page-wrap">
    {#if loading}
        <p class="loading-note">{$_('artists.loading')}</p>
    {:else}
        <div class="composers">
            <div class="list-col"><ComposerList {artists} /></div>
            <div class="panel pick">{$_('artists.pick')}</div>
        </div>
    {/if}
</div>

<style>
    .composers {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: flex-start;
        margin-top: 14px;
    }
    .list-col {
        flex: 1 1 300px;
        max-width: 380px;
        min-width: 0;
    }
    .pick {
        flex: 999 1 560px;
        min-width: 0;
        padding: 28px;
        color: var(--ink-soft);
        text-align: center;
    }

    /* narrow screens: just the list, full width */
    @media (max-width: 960px) {
        .list-col { max-width: none; }
        .pick { display: none; }
    }
</style>
