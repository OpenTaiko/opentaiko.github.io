<script>
    import { onMount } from "svelte";
    import { _, locale } from 'svelte-i18n';

    import SongBar from "../components/SongBar.svelte";
    import { SONGLIST_GENRES } from "../lib/genres.js";
    import { localizedTitle, localizedSubtitle } from "../lib/localize.js";
    import { fetchSoundtrack, hideForLocale } from "../lib/soundtrack.js";

    let activeCss = 'ch7';
    let Fetching = true;
    let SongsInfo = [];

    $: active = SONGLIST_GENRES.find(g => g.css === activeCss) ?? SONGLIST_GENRES[0];
    $: cards = SongsInfo
        .filter(song => song.tjaGenreFolder === active.folder)
        .map(song => ({
            song,
            audio: song.chartAudioFilePath,
            uid: song.uniqueId,
            difficulties: ['Easy', 'Normal', 'Hard', 'Oni', 'Edit', 'Tower', 'Dan']
                .map(k => song.chartDifficulties?.[k] ?? -1),
        }));

    onMount(async () => {
        SongsInfo = hideForLocale(await fetchSoundtrack());
        Fetching = false;
    });
</script>

<h1 class="sky-title">{$_('songlist.title')}</h1>

<div class="page-wrap">
    <div class="panel songlist">
        <aside class="genres">
            {#each SONGLIST_GENRES as g}
                <button
                    type="button"
                    class="genre"
                    class:on={activeCss === g.css}
                    style="--swatch:{g.bg}"
                    on:click={() => activeCss = g.css}
                >
                    <span class="swatch"></span>
                    <span class="ell" title={g.btnLabel ?? g.label}>{g.btnLabel ?? g.label}</span>
                </button>
            {/each}
            <button type="button" class="genre" style="--swatch:#111111" on:click={() => window.location.replace('secret')}>
                <span class="swatch"></span><span>???</span>
            </button>
        </aside>

        <div class="songs">
            <div class="songs-head">
                <span class="songs-title">{active.btnLabel ?? active.label}</span>
                {#if !Fetching}<span class="songs-count">{$_('songlist.count', { values: { count: cards.length } })}</span>{/if}
            </div>
            {#if Fetching}
                <p class="waiting">{$_('common.loading')}</p>
            {:else}
                {#each cards as c (c.uid)}
                    <SongBar
                        Title={localizedTitle(c.song, $locale)}
                        Subtitle={localizedSubtitle(c.song, $locale)}
                        Difficulties={c.difficulties}
                        AudioFilePath={c.audio}
                        Genre={active.css}
                        UniqueId={c.uid}
                    />
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .songlist {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        /* clip-path, not overflow: hidden, so the genre list can stay sticky */
        clip-path: inset(0 round 20px);
        /* the genre column's tint runs the full height even while the list itself sticks */
        background: linear-gradient(90deg, #eef7fe 0 236px, var(--line) 236px 238px, #ffffff 238px);
    }

    .genres {
        width: 236px;
        flex: none;
        box-sizing: border-box;
        position: sticky;
        top: calc(var(--header-h) + 14px);
        max-height: calc(100vh - var(--header-h) - var(--footer-h) - 28px);
        overflow-y: auto;
        scrollbar-width: thin;
        padding: 13px 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .genre {
        display: flex;
        align-items: center;
        gap: 9px;
        margin: 0;
        padding: 8px 12px;
        border-radius: 999px;
        border: 2px solid var(--line);
        background: #ffffff;
        color: var(--ink);
        font-size: 13px;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
        min-width: 0;
    }
    .genre:hover {
        border-color: var(--ink-soft);
    }
    /* the selected genre is yellow; its own colour stays in the swatch, so dark genres stay readable */
    .genre.on {
        background: var(--sun);
        border-color: var(--ink);
        box-shadow: 0 2px 0 var(--ink);
    }
    .swatch {
        width: 12px;
        height: 12px;
        flex: none;
        border-radius: 4px;
        background: var(--swatch);
        border: 1.5px solid rgba(13, 36, 64, 0.45);
    }

    .songs {
        flex: 999 1 560px;
        min-width: 0;
        padding: 13px 15px 6px;
    }
    .songs-head {
        display: flex;
        align-items: baseline;
        gap: 10px;
        padding: 0 4px 10px;
    }
    .songs-title {
        font-size: 16px;
        font-weight: 500;
    }
    .songs-count {
        font-size: 13px;
        color: var(--ink-soft);
    }
    .waiting {
        text-align: center;
        color: var(--ink-soft);
        padding: 30px 0;
    }

    /* phones: the genres become a wrapping row of pills above the songs */
    @media (max-width: 820px) {
        .songlist { background: #ffffff; }
        .genres {
            width: 100%;
            position: static;
            max-height: none;
            flex-direction: row;
            flex-wrap: wrap;
            background: #eef7fe;
            border-bottom: 2px solid var(--line);
        }
        .genre { flex: 0 1 auto; }
    }
</style>
