<script>
    import { onMount } from "svelte";

    import SongBar from "../components/SongBar.svelte";
    import { SONGLIST_GENRES } from "../lib/genres.js";

    let activeGenre = 'ch7';

    const AvailableGenres = [
        ...SONGLIST_GENRES.map(g => ({
            color1:    g.btnPrimary,
            color2:    g.bg,
            textColor: g.text,
            text:      g.btnLabel ?? g.label,
            css:       g.css,
            OnClick:   () => FilterSongs(g.css, g.folder),
        })),
        {
            color1: '#333', color2: '#111', textColor: 'white',
            text: '???',
            css:  '???',
            OnClick: () => window.location.replace('secret'),
        },
    ];

    let Fetching = false;
    let SongsInfo = {};
    $: SongCards = [];

    const GetSongsByGenre = (genre) => {return SongsInfo.filter(song => song["tjaGenreFolder"] === genre)}

    const FetchSongs = async () => {
        Fetching = true;

        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"));
        let text = (await songs_text.text()).valueOf();
        SongsInfo = JSON.parse(text);

        if (navigator.language === "zh-CN") {
            SongsInfo = SongsInfo.filter(song => song["uniqueId"] != "losTPEtAlSwANDERRBHLiXoUNdsetSUnaN")
        }

        Fetching = false;
    }

    const FilterSongs = async (genre, fil) => {
        activeGenre = genre;
        SongCards = [];
        GetSongsByGenre(fil).forEach(song => {
            const SInfo = {
                Genre: genre,
                Title: song["chartTitle"],
                Subtitle: song["chartSubtitle"],
                AudioFilePath: song['chartAudioFilePath'],
                Difficulties: [
                    song["chartDifficulties"]["Easy"] ?? -1,
                    song["chartDifficulties"]["Normal"] ?? -1,
                    song["chartDifficulties"]["Hard"] ?? -1,
                    song["chartDifficulties"]["Oni"] ?? -1,
                    song["chartDifficulties"]["Edit"] ?? -1,
                    song["chartDifficulties"]["Tower"] ?? -1,
                    song["chartDifficulties"]["Dan"] ?? -1
                ],
                UniqueId: song["uniqueId"],
            };

            SongCards.push(SInfo);
        });
    }

    onMount(async () => {
        await FetchSongs();
        FilterSongs("ch7", "07 OpenTaiko Chapter VII");
    });

    const bg_optk_slide = (id) => {
        requestAnimationFrame(slide)
        function slide() {
            const pos = (performance.now() / 90000) * window.screen.width
            const bg = document.getElementById(id)
            if (bg != null)
                bg.style.backgroundPositionX = -pos + "px"
            requestAnimationFrame(slide)
        }
    }
</script>

<div id="bg_optk" onload={bg_optk_slide("bg_optk")}></div>

<h1>Song List</h1>

<div class="content-row">
    <aside class="genre-panel">
        {#each AvailableGenres as GBox}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="genre-item"
                class:active={activeGenre === GBox.css}
                style="--swatch:{GBox.color2}; --active-bg:{GBox.color2}; --active-text:{GBox.textColor}"
                on:click={GBox.OnClick}
                role="button"
                tabindex="0"
            >
                <span class="genre-swatch"></span>
                <span class="genre-label">{GBox.text}</span>
            </div>
        {/each}
    </aside>

    <div id="songs">
        {#if Fetching === true}
            <h2 style="text-align:center; color:white;">Fetching Songs… Please wait.</h2>
            <img src="image/loading.gif" alt="Loading" style="display:block; margin:auto;">
        {:else}
            {#each SongCards as Card}
                {#key Card.AudioFilePath}
                    <SongBar
                        Title={Card.Title}
                        Subtitle={Card.Subtitle}
                        Difficulties={Card.Difficulties}
                        AudioFilePath={Card.AudioFilePath}
                        Genre={Card.Genre}
                        UniqueId={Card.UniqueId}
                    />
                {/key}
            {/each}
        {/if}
    </div>
</div>

<style>
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
        margin: 8px 0 12px;
    }

    /* ── Shared container — sidebar + songs in one box ── */
    .content-row {
        display: flex;
        gap: 0;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
        align-items: flex-start;
        background: rgba(10, 10, 22, 0.78);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        /* clip-path instead of overflow:hidden — lets sticky work inside */
        clip-path: inset(0 round 14px);
    }

    /* ── Genre sidebar ─────────────────────────────── */
    .genre-panel {
        width: 250px;
        flex-shrink: 0;
        position: sticky;
        top: 68pt;
        /* subtract fixed header (68pt) + footer clearance (76px) */
        height: calc(100vh - 68pt - 76px);
        box-sizing: border-box;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
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

    /* ── Song list ─────────────────────────────────── */
    #songs {
        flex: 1;
        min-width: 0;
        padding: 6px 16px 64px 8px;
    }
</style>
