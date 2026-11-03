<script>
    // The composer list: a search box, the count, and one row per composer with a bar for
    // how many songs they have next to the most prolific one.
    import { Link } from "svelte-routing";
    import { _ } from 'svelte-i18n';

    export let artists = [];
    export let selectedId = null;

    let search = '';
    $: term = search.trim().toLowerCase();
    $: shown = term === '' ? artists : artists.filter(a => a.name.toLowerCase().includes(term));
    $: most = Math.max(1, ...artists.map(a => a.count));
</script>

<div class="panel list">
    <label class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 015.6 11.2l4.6 4.6-1.4 1.4-4.6-4.6A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z"/></svg>
        <input type="search" placeholder={$_('artists.search')} aria-label={$_('artists.search')} bind:value={search} />
    </label>
    <div class="count">{$_('artists.count', { values: { filtered: shown.length, total: artists.length } })}</div>
    <div class="rows">
        {#each shown as a (a.id)}
            <Link to="/artistinfo/{a.id}" class="composer {a.id === selectedId ? 'on' : ''}">
                <span class="c-main">
                    <span class="c-name ell" title={a.name}>{a.name}</span>
                    <span class="c-bar"><span style="width:{Math.round(a.count / most * 100)}%"></span></span>
                </span>
                <span class="c-count">{$_('artists.songs', { values: { count: a.count } })}</span>
            </Link>
        {/each}
        {#if shown.length === 0}
            <p class="none">{$_('artists.no_results', { values: { search } })}</p>
        {/if}
    </div>
</div>

<style>
    .list {
        padding: 14px;
        box-sizing: border-box;
    }
    .search {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 14px;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: var(--paper-soft);
        box-sizing: border-box;
    }
    .search svg {
        width: 16px;
        height: 16px;
        fill: var(--ink-soft);
        flex: none;
    }
    .search input {
        flex: 1;
        min-width: 0;
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 14px;
        color: var(--ink);
    }
    .count {
        font-size: 12px;
        color: var(--ink-soft);
        margin: 10px 4px 8px;
    }
    .rows {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .rows :global(.composer) {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 12px;
        border: 2px solid transparent;
        color: var(--ink);
        text-decoration: none;
        flex-shrink: 0;
    }
    .rows :global(.composer:hover) {
        background: #eef7fe;
        color: var(--ink);
    }
    .rows :global(.composer.on) {
        background: #fff4d1;
        border-color: var(--ink);
    }
    .c-main {
        flex: 1;
        min-width: 0;
        display: block;
    }
    .c-name {
        display: block;
        font-size: 15px;
        font-weight: 500;
    }
    .c-bar {
        display: block;
        height: 5px;
        margin-top: 4px;
        border-radius: 999px;
        background: #e3eef8;
        overflow: hidden;
    }
    .c-bar span {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--sky-1);
    }
    .c-count {
        flex: none;
        min-width: 58px;
        text-align: right;
        font-size: 12px;
        color: var(--ink-soft);
        white-space: nowrap;
    }
    .none {
        color: var(--ink-soft);
        padding: 12px;
        margin: 0;
    }
</style>
