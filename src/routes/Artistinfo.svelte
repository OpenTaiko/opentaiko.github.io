<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import ComposerList from "../components/ComposerList.svelte";
    import { genreInfo } from "../lib/genres.js";
    import { localizedTitle, localizedSubtitle } from "../lib/localize.js";
    import { loadComposers, LINK_DEFS, otherLabel } from "../lib/composers.js";
    import { barArt, IMG } from "../lib/skin.js";

    export let ArtistId;

    let loading = true;
    let artists = [];
    let boxesOf = new Map();

    onMount(async () => {
        ({ artists, boxesOf } = await loadComposers());
        loading = false;
    });

    $: id = Number(ArtistId);
    $: artist = artists.find(a => a.id === id) ?? null;
    $: boxes = boxesOf.get(id) ?? [];
    $: links = artist
        ? [
            ...LINK_DEFS.filter(l => artist.links[l.key]).map(l => ({ ...l, url: artist.links[l.key].trim() })),
            ...(artist.links.other ? [{ label: otherLabel(artist.links.other), color: '#555555', url: artist.links.other.trim() }] : []),
        ]
        : [];

    // the subtitle is shown only when it says more than the composer's own name
    const subOf = (song) => {
        const sub = localizedSubtitle(song, $locale);
        return sub && sub !== artist?.name ? sub : '';
    };
    const towerArt = (box) => box.sweet && box.spicy
        ? 'linear-gradient(90deg, #f6ff00, #ff5e00)'
        : (box.sweet ? '#f6ff00' : '#ff5e00');
</script>

<h1 class="sky-title">{$_('artists.title')}</h1>

<div class="page-wrap">
    {#if loading}
        <p class="loading-note">{$_('artists.loading')}</p>
    {:else}
        <div class="composers">
            <div class="list-col"><ComposerList {artists} selectedId={id} /></div>

            <div class="panel detail">
                {#if artist === null}
                    <p class="none">{$_('artistinfo.not_found')}</p>
                {:else}
                    <div class="head">
                        <h2>{artist.name}</h2>
                        {#if links.length > 0}
                            <div class="links">
                                {#each links as l}
                                    <a href={l.url} target="_blank" rel="noopener noreferrer"><span style="background:{l.color}"></span>{l.label}</a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    <div class="count">{$_('artistinfo.songs', { values: { count: boxes.length } })}</div>

                    <!-- each song: its genre's bar art underneath, the title card over it -->
                    <div class="songs">
                        {#each boxes as box (box.key)}
                            {#if box.kind === 'tower'}
                                <div class="song" style="background:{towerArt(box)}">
                                    <div class="card">
                                        <div class="title ell" title={localizedTitle(box.song, $locale)}>{localizedTitle(box.song, $locale)}</div>
                                        <div class="line">
                                            <span class="chip" style="background:#444444; color:#ffffff">{$_('towers.title')}</span>
                                            <span class="sub ell" title={subOf(box.song)}>{subOf(box.song)}</span>
                                        </div>
                                    </div>
                                    <div class="tower-buttons">
                                        {#if box.sweet}
                                            <Link to="/songinfo/{box.sweet.uniqueId}" class="tower-btn" aria-label="{$_('towers.sweet')}"><img src="{IMG}/tower/pill_sweet.png" alt={$_('towers.sweet')} /></Link>
                                        {/if}
                                        {#if box.spicy}
                                            <Link to="/songinfo/{box.spicy.uniqueId}" class="tower-btn" aria-label="{$_('towers.spicy')}"><img src="{IMG}/tower/pill_spicy.png" alt={$_('towers.spicy')} /></Link>
                                        {/if}
                                    </div>
                                </div>
                            {:else}
                                {@const gi = genreInfo(box.song.tjaGenreFolder)}
                                <Link to="/songinfo/{box.song.uniqueId}" class="song" style="background:{box.kind === 'challenge' ? gi.bg : barArt(gi.css)}">
                                    <div class="card">
                                        <div class="title ell" title={localizedTitle(box.song, $locale)}>{localizedTitle(box.song, $locale)}</div>
                                        <div class="line">
                                            <span class="chip" style="background:{gi.bg}; color:{gi.text}">{gi.label}</span>
                                            <span class="sub ell" title={subOf(box.song)}>{subOf(box.song)}</span>
                                        </div>
                                    </div>
                                </Link>
                            {/if}
                        {/each}
                    </div>
                    {#if boxes.length === 0}
                        <p class="none">{$_('artistinfo.no_songs')}</p>
                    {/if}
                {/if}
            </div>
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
    .detail {
        flex: 999 1 560px;
        min-width: 0;
        padding: 18px 18px 16px;
        box-sizing: border-box;
    }
    .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px 18px;
    }
    h2 {
        margin: 0;
        font-size: 30px;
        font-weight: 500;
    }
    .links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .links a {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        height: 34px;
        padding: 0 14px 0 8px;
        box-sizing: border-box;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #ffffff;
        color: var(--ink);
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        box-shadow: 0 2px 0 var(--ink);
    }
    .links a:hover {
        background: #eef7fe;
    }
    .links a span {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1.5px solid var(--ink);
    }
    .count {
        font-size: 13px;
        color: var(--ink-soft);
        margin: 14px 0 10px;
    }
    .songs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 8px;
    }
    .songs :global(.song) {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        padding: 4px 4px 4px 34px;
        border: 2px solid var(--ink);
        border-radius: 14px;
        overflow: hidden;
        color: var(--ink);
        text-decoration: none;
    }
    .songs :global(a.song:hover) {
        color: var(--ink);
        box-shadow: 0 3px 0 rgba(13, 36, 64, 0.25);
    }
    .card {
        flex: 1;
        min-width: 0;
        padding: 5px 10px;
        border: 2px solid var(--ink);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.88);
    }
    .title {
        font-size: 14px;
        font-weight: 500;
    }
    .line {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        margin-top: 2px;
    }
    .chip {
        flex: none;
        font-size: 11px;
        font-weight: 500;
        padding: 0 7px;
        border-radius: 999px;
        border: 1px solid rgba(13, 36, 64, 0.35);
    }
    .sub {
        min-width: 0;
        font-size: 11px;
        color: var(--ink-soft);
    }
    .tower-buttons {
        flex: none;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .tower-buttons :global(.tower-btn) {
        display: block;
        line-height: 0;
    }
    .tower-buttons :global(.tower-btn img) {
        height: 22px;
        filter: drop-shadow(0 1px 0 rgba(13, 36, 64, 0.35));
    }
    .tower-buttons :global(.tower-btn:hover img) {
        transform: translateY(-1px);
    }
    .none {
        color: var(--ink-soft);
        margin: 0;
    }

    /* narrow screens: the composer first, the list under it */
    @media (max-width: 960px) {
        .list-col { order: 2; max-width: none; }
    }
</style>
