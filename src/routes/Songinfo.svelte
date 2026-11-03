<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import initSqlJs from "sql.js";
    import { pickTitle, pickSubtitle } from "../lib/localize.js";
    import SongBar from "../components/SongBar.svelte";
    import TabArea from "../components/TabArea.svelte";
    import DiffTab from "../components/DiffTab.svelte";
    import { genreToCSS } from "../lib/genres.js";
    import { fetchSoundtrack } from "../lib/soundtrack.js";
    import { loadHof } from "../lib/hof.js";

    export let UniqueId;

    const KEYS = ['Easy', 'Normal', 'Hard', 'Oni', 'Edit', 'Tower', 'Dan'];
    // the course colours of the skin (Easy … Edit), then Tower and Dan
    const TAB_COLORS = ['#88d2fd', '#58de85', '#ffc224', '#d80b2c', '#9065e2', '#e9943b', '#3b55a5'];
    const TAB_INK = ['#0d2440', '#0d2440', '#0d2440', '#ffffff', '#ffffff', '#0d2440', '#ffffff'];

    let Fetching = true;
    let SongCard = {};
    let songArtists = [];
    let initialTab = 1;

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const d = params.get('d');
        if (d !== null) initialTab = Number(d) + 1;

        const [songs, hof] = await Promise.all([fetchSoundtrack(), loadHof()]);
        const song = songs.find(s => s.uniqueId === UniqueId) ?? null;

        // per-course Hall of Fame rank: the chart's position in the hardest-first list
        const ranks = [-1, -1, -1, -1, -1, -1, -1];
        hof.entries.forEach((row, idx) => {
            if (row[1] === UniqueId && row[2] >= 0 && row[2] <= 4) ranks[row[2]] = idx + 1;
        });

        SongCard = song !== null
            ? {
                Rank: ranks, UniqueId, Song: song,
                Genre: genreToCSS(song.tjaGenreFolder),
                Title: song.chartTitle, Subtitle: song.chartSubtitle,
                AudioFilePath: song.chartAudioFilePath,
                Difficulties: KEYS.map(k => song.chartDifficulties?.[k] ?? -1),
                Charters: KEYS.map(k => song.chartMakers?.[k] ?? ''),
            }
            : {
                Rank: ranks, UniqueId, Song: null, Genre: 'hq',
                Title: $_('common.not_found'), Subtitle: '', AudioFilePath: '',
                Difficulties: [-1, -1, -1, -1, -1, -1, -1], Charters: ['', '', '', '', '', '', ''],
            };
        Fetching = false;

        // the song's composers
        try {
            const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
            const buf = await fetch('/artists_info.db3').then(r => r.arrayBuffer());
            const db = new SQL.Database(new Uint8Array(buf));
            const sRes = db.exec('SELECT artists FROM songs WHERE songUid = $uid', { $uid: UniqueId });
            if (sRes[0]?.values?.[0]?.[0]) {
                const ids = JSON.parse(sRes[0].values[0][0]).map(Number).filter(Number.isInteger);
                if (ids.length > 0) {
                    const aRes = db.exec(`SELECT entryId, artist FROM artists WHERE entryId IN (${ids.join(',')})`);
                    if (aRes[0]) {
                        songArtists = aRes[0].values
                            .map(([id, name]) => ({ id, name }))
                            .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
                    }
                }
            }
            db.close();
        } catch (e) {
            console.error('Failed to load artist info:', e);
        }
    });

    let tabs = [];
    $: tabs = SongCard.Difficulties && $_
        ? ['easy', 'normal', 'hard', 'extreme', 'extra', 'tower', 'dan']
            .map((k, idx) => ({ k, idx }))
            .filter(({ idx }) => SongCard.Difficulties[idx] >= 0)
            .map(({ k, idx }) => ({
                label: $_(`difficulty.${k}`),
                value: idx + 1,
                component: DiffTab,
                color: TAB_COLORS[idx],
                ink: TAB_INK[idx],
                props: { SongCard, Difficulty: idx },
            }))
        : [];

    // snap to the first available tab when the default (or an invalid ?d=) doesn't exist,
    // e.g. Tower-only charts whose single tab has value 6
    $: if (tabs.length > 0 && !tabs.some(t => t.value === initialTab)) {
        initialTab = tabs[0].value;
    }
</script>

<h1 class="sky-title">{$_('songinfo.title')}</h1>

<div class="page-wrap songinfo">
    {#if Fetching}
        <p class="loading-note">{$_('common.loading')}</p>
    {:else}
        {#key SongCard.UniqueId}
            <SongBar
                Title={pickTitle(SongCard.Song, SongCard.Title, $locale)}
                Subtitle={pickSubtitle(SongCard.Song, SongCard.Subtitle, $locale)}
                Difficulties={SongCard.Difficulties}
                AudioFilePath={SongCard.AudioFilePath}
                Genre={SongCard.Genre}
            />

            {#if songArtists.length > 0}
                <div class="artists">
                    <span class="artists-label">{$_('songinfo.artists')}</span>
                    {#each songArtists as a}
                        <Link to="/artistinfo/{a.id}" class="artist-chip">{a.name}</Link>
                    {/each}
                </div>
            {/if}

            <TabArea items={tabs} activeTabValue={initialTab}/>
        {/key}
    {/if}
</div>

<style>
    .songinfo {
        max-width: 980px;
        text-align: left;
    }
    .artists {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 6px 0 0;
    }
    .artists-label {
        font-size: 13px;
        font-weight: 500;
        color: #ffffff;
        text-shadow: 0 1px 0 rgba(13, 36, 64, 0.28);
        margin-right: 2px;
    }
    .artists :global(.artist-chip) {
        display: inline-block;
        padding: 4px 14px;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #ffffff;
        color: var(--ink);
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        box-shadow: 0 2px 0 var(--ink);
    }
    .artists :global(.artist-chip:hover) {
        background: #fff4d1;
        color: var(--ink);
    }
</style>
