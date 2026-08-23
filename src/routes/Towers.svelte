<script>
    import { onMount, tick } from "svelte";
    import { _ } from 'svelte-i18n';
    import SongBar from "../components/SongBar.svelte";
    import { genreInfo } from "../lib/genres.js";

    /**
     * Taiko Towers.
     *
     * Each category is one tower drawn as a building: spire and battlements at
     * the summit, brick walls on the sides, a door at the base. Floors are the
     * same SongBar cards as the Song List, stacked so floor 1 sits at the
     * bottom — the viewport starts scrolled at the base and you climb up.
     *
     * Two different numbers are in play and must not be confused:
     *   floor  – the NN in the folder name (TSW01, TSP07, TCH01). This is the
     *            tower position and the only reliable ordering key.
     *   level  – chartDifficulties.Tower, the star rating. It repeats (Sweet
     *            has four 5s) and is decimal + out of order in Spicy
     *            (TSP11 is 8, sat between 11.0 and 11.4), so it can NOT be
     *            used to order the tower.
     *
     * Category colours/css live in genres.js ('01 - Sweet' etc.), so tower
     * bars, Songinfo bars and Artistinfo chips all share one theme.
     */
    const CATEGORIES = [
        { key: 'sweet',     folder: '01 - Sweet' },
        { key: 'spicy',     folder: '02 - Spicy' },
        { key: 'challenge', folder: '03 - Challenges' },
    ];

    let activeKey = 'sweet';
    let Fetching = false;
    let SongsInfo = [];

    $: active = CATEGORIES.find(c => c.key === activeKey);
    $: gi = genreInfo(active.folder);

    /** Trailing folder name, e.g. "S2 Taiko Towers\01 - Sweet\TSW01 - ..." -> "TSW01 - ...". */
    const folderName = (song) =>
        (song.tjaFolderPath ?? '').replace(/\\/g, '/').replace(/\/+$/, '').split('/').pop() ?? '';

    /** Floor number from the TSW01 / TSP07 / TCH01 prefix; 0 if absent. */
    const floorOf = (song) => {
        const m = folderName(song).match(/^[A-Z]+(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    };

    // Floors of the active tower, summit first (DOM order is top-to-bottom,
    // so descending floor number renders the tower standing upright).
    $: floors = SongsInfo
        .filter(s => s.tjaGenreFolder === active.folder)
        .map(s => ({
            floor:    floorOf(s),
            title:    s.chartTitle,
            subtitle: s.chartSubtitle,
            audio:    s.chartAudioFilePath,
            uniqueId: s.uniqueId,
            difficulties: [
                -1, -1, -1, -1, -1,
                (s.chartDifficulties ?? {}).Tower ?? -1,
                (s.chartDifficulties ?? {}).Dan ?? -1,
            ],
        }))
        .sort((a, b) => b.floor - a.floor);

    // Start at the base of the tower (scrolled to the bottom) on mount and
    // whenever the floors change (category switches). Implemented as an action
    // so the scrollTop write stays off Svelte's reactive graph — assigning a
    // property of a `bind:this` variable inside a `$:` block would invalidate
    // it and loop forever.
    const startAtBase = (el) => {
        const toBase = () => { el.scrollTop = el.scrollHeight; };
        // Re-apply once after layout settles (fonts/images can grow the content
        // a few px after the first tick).
        const go = () => tick().then(() => { toBase(); setTimeout(toBase, 150); });
        go();
        return { update: go };
    };

    const FetchSongs = async () => {
        Fetching = true;
        const res = await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json");
        SongsInfo = JSON.parse((await res.text()).valueOf());
        Fetching = false;
    };

    onMount(FetchSongs);
</script>

<div id="bg_optk"></div>

<h1>{$_('towers.title')}</h1>

<div class="content-row">
    <aside class="genre-panel">
        {#each CATEGORIES as cat}
            {@const cgi = genreInfo(cat.folder)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="genre-item"
                class:active={activeKey === cat.key}
                style="--swatch:{cgi.bg}; --active-bg:{cgi.bg}; --active-text:{cgi.text}"
                on:click={() => activeKey = cat.key}
                role="button"
                tabindex="0"
            >
                <span class="genre-swatch"></span>
                <span class="genre-label">{$_(`towers.${cat.key}`)}</span>
            </div>
        {/each}
    </aside>

    <div class="tower-pane" style="--tc:{gi.accent}">
        <div class="pane-header">
            <strong>{$_(`towers.${activeKey}`)}</strong>
            <span>{$_(`towers.${activeKey}_desc`)}</span>
        </div>

        {#if Fetching}
            <h2 class="loading">{$_('common.loading')}</h2>
            <img src="image/loading.gif" alt="Loading" class="loading-img">
        {:else}
            <div class="tower-viewport" use:startAtBase={floors}>
                <div class="tower">
                    {#if floors.length === 0}
                        <p class="empty">{$_('towers.empty')}</p>
                    {/if}
                    {#each floors as f (f.uniqueId)}
                        <div class="floor-row">
                            <div class="plate">
                                <span class="plate-f">{$_('towers.floor_short')}</span>
                                <span class="plate-n">{f.floor}</span>
                            </div>
                            <div class="bar-holder">
                                <SongBar
                                    Title={f.title}
                                    Subtitle={f.subtitle}
                                    Difficulties={f.difficulties}
                                    AudioFilePath={f.audio}
                                    Genre={gi.css}
                                    UniqueId={f.uniqueId}
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Static background, same as the Song List page. Do NOT animate it: the
       content-row's backdrop-filter would repaint the blur every frame. */
    #bg_optk {
        float: right;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: -64px;
        z-index: -1;
        background-color: rgb(150, 150, 150);
        background-image: url("/image/bg_songs.png");
        background-blend-mode: multiply;
        background-size: cover;
        background-repeat: repeat-x;
        background-attachment: fixed;
    }

    h1 {
        text-align: center;
        color: white;
        margin: 8px 0 4px;
    }

    /* ── Shared container — sidebar + tower in one box (same as Songlist) ── */
    .content-row {
        display: flex;
        gap: 0;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
        align-items: stretch;
        background: rgba(10, 10, 22, 0.78);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        clip-path: inset(0 round 14px);
    }

    /* ── Category sidebar (same look as the Songlist genre panel) ── */
    .genre-panel {
        width: 250px;
        flex-shrink: 0;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.28);
        border-right: 1px solid rgba(255,255,255,0.1);
        padding: 16px 8px;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .genre-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 10px;
        background: transparent;
        color: rgba(255,255,255,0.82);
        font-size: 0.85em;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.14s, transform 0.1s, color 0.14s;
        user-select: none;
    }

    .genre-item:hover {
        background: rgba(255,255,255,0.11);
        color: white;
    }

    .genre-item.active {
        background: var(--active-bg);
        color: var(--active-text);
        box-shadow: 0 2px 10px rgba(0,0,0,0.45);
        transform: translateX(3px);
    }

    .genre-swatch {
        width: 11px;
        height: 11px;
        border-radius: 3px;
        background: var(--swatch);
        flex-shrink: 0;
        border: 1px solid rgba(255,255,255,0.35);
    }

    .genre-label {
        white-space: nowrap;
    }

    /* ── Tower pane ─────────────────────────────────── */
    .tower-pane {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        padding: 10px 16px 16px 8px;
    }

    .pane-header {
        display: flex;
        align-items: baseline;
        gap: 10px;
        color: white;
        padding: 4px 8px 10px;
        flex-wrap: wrap;
    }

    .pane-header strong {
        color: var(--tc);
        font-size: 1.05em;
    }

    .pane-header span {
        color: rgba(255,255,255,0.6);
        font-size: 0.82em;
    }

    /* The climb: scrolls internally, starts at the base.
       Subtracts: fixed header (68pt), footer clearance (76px), and the page
       h1 + pane header/padding above the viewport (~165px). */
    .tower-viewport {
        height: calc(100vh - 68pt - 76px - 165px);
        min-height: 420px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
        display: flex;
        flex-direction: column;
        padding-right: 8px;
    }

    /* Short towers rest at the bottom rather than hanging from the top. */
    .tower {
        margin-top: auto;
    }

    .floor-row {
        display: flex;
        align-items: stretch;
    }

    /* Floor number — the tower position from the folder (TSW01 → F1).
       Styled like the SongBar cards it sits beside. */
    .plate {
        flex-shrink: 0;
        width: 56px;
        margin: 6px 4px 6px 0;
        border-radius: 12px 0 0 12px;
        background: rgba(0, 0, 0, 0.35);
        border-left: 4px solid var(--tc);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }

    .plate-f {
        font-size: 0.62em;
        font-weight: 700;
        color: rgba(255,255,255,0.55);
    }

    .plate-n {
        font-size: 1.45em;
        font-weight: 900;
        color: white;
    }

    .bar-holder {
        flex: 1;
        min-width: 0;
    }

    .empty {
        text-align: center;
        color: rgba(255,255,255,0.6);
        padding: 20px;
    }

    .loading { text-align: center; color: white; }
    .loading-img { display: block; margin: auto; }

    @media (max-width: 700px) {
        .content-row { flex-direction: column; }
        .genre-panel {
            width: 100%;
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 8px;
        }
        .tower-pane { padding: 8px; }
    }
</style>
