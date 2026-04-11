<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import initSqlJs from "sql.js";
    import { genreInfo } from "../lib/genres.js";

    export let ArtistId;

    let loading = true;
    let artist = null;
    let songs = [];

    // ── Link helpers ───────────────────────────────────────────────────────
    const LINK_DEFS = [
        { key: 'youtube',    label: 'YouTube',    color: '#ff0000' },
        { key: 'soundcloud', label: 'SoundCloud', color: '#ff5500' },
        { key: 'spotify',    label: 'Spotify',    color: '#1db954' },
        { key: 'bandcamp',   label: 'Bandcamp',   color: '#1da0c3' },
        { key: 'bilibili',   label: 'Bilibili',   color: '#00a1d6' },
    ];

    const otherLabel = (url) => {
        if (!url) return 'Link';
        const u = url.toLowerCase();
        if (u.includes('twitter.com') || u.includes('x.com')) return 'X / Twitter';
        if (u.includes('linktr.ee'))   return 'Linktree';
        if (u.includes('bsky.app'))    return 'Bluesky';
        if (u.includes('newgrounds'))  return 'Newgrounds';
        if (u.includes('bmssearch'))   return 'BMS Search';
        if (u.includes('instagram'))   return 'Instagram';
        if (u.includes('bandcamp'))    return 'Bandcamp';
        if (u.includes('nicovideo'))   return 'NicoNico';
        if (u.includes('musescore'))   return 'MuseScore';
        return 'Website';
    };

    // ── Data loading ───────────────────────────────────────────────────────
    onMount(async () => {
        const numId = Number(ArtistId);

        const [SQL, artistsBuf, soundtrackResp] = await Promise.all([
            initSqlJs({ locateFile: () => '/sql-wasm.wasm' }),
            fetch('/artists_info.db3').then(r => r.arrayBuffer()),
            fetch('https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json'),
        ]);

        const artistsDb = new SQL.Database(new Uint8Array(artistsBuf));

        // Artist row
        const aRes = artistsDb.exec(
            `SELECT entryId, artist, youtube, soundcloud, spotify, bandcamp, bilibili, other
             FROM artists WHERE entryId = ${numId}`
        );
        if (aRes[0]) {
            const [cols, vals] = [aRes[0].columns, aRes[0].values[0]];
            artist = Object.fromEntries(cols.map((c, i) => [c, vals[i]]));
        }

        // Song UIDs for this artist
        const sRes = artistsDb.exec(
            `SELECT songUid FROM songs
             WHERE EXISTS (SELECT 1 FROM json_each(artists) WHERE value = ${numId})`
        );
        const uidSet = new Set((sRes[0]?.values ?? []).map(r => r[0]));

        artistsDb.close();

        // Match to soundtrack metadata
        const soundtrack = await soundtrackResp.json();
        songs = soundtrack
            .filter(s => uidSet.has(s.uniqueId))
            .map(s => ({
                uniqueId:  s.uniqueId,
                title:     s.chartTitle,
                subtitle:  s.chartSubtitle,
                folder:    s.tjaGenreFolder,
            }));

        loading = false;
    });
</script>

<div class="bg_optk"></div>

<h1 style="color:white;">Artist Info</h1>

<div id="container">
    {#if loading}
        <div class="card">
            <p style="text-align:center;">Loading…</p>
            <img src="/image/loading.gif" alt="Loading"
                 style="display:block;margin:0 auto;">
        </div>
    {:else if artist}
        <div class="card">
            <h2 class="artist-name">{artist.artist}</h2>

            <!-- Links -->
            {#if LINK_DEFS.some(l => artist[l.key]) || artist.other}
            <div class="links-section">
                <h3 class="section-title">Links</h3>
                <div class="links-row">
                    {#each LINK_DEFS as { key, label, color }}
                        {#if artist[key]}
                        <a class="link-btn"
                           href={artist[key].trim()}
                           target="_blank"
                           rel="noopener noreferrer"
                           style="background:{color}">
                            {label}
                        </a>
                        {/if}
                    {/each}
                    {#if artist.other}
                    <a class="link-btn"
                       href={artist.other.trim()}
                       target="_blank"
                       rel="noopener noreferrer"
                       style="background:#555">
                        {otherLabel(artist.other)}
                    </a>
                    {/if}
                </div>
            </div>
            {/if}

            <!-- Song list -->
            <div class="songs-section">
                <h3 class="section-title">
                    {songs.length} song{songs.length !== 1 ? 's' : ''}
                </h3>
                {#if songs.length === 0}
                    <p style="color:#666;">No songs found.</p>
                {:else}
                <div class="song-list">
                    {#each songs as song}
                    {@const gi = genreInfo(song.folder)}
                    <Link to="/songinfo/{song.uniqueId}" class="song-row"
                          style="--genre-bg:{gi.bg}">
                        <span class="genre-chip"
                              style="background:{gi.bg};color:{gi.text}">
                            {gi.label}
                        </span>
                        <span class="song-title">{song.title}</span>
                        <span class="song-sub"
                              title={song.subtitle && song.subtitle !== artist.artist ? song.subtitle : ''}>
                            {song.subtitle && song.subtitle !== artist.artist ? song.subtitle : ''}
                        </span>
                    </Link>
                    {/each}
                </div>
                {/if}
            </div>
        </div>
    {:else}
        <div class="card">
            <p>Artist not found.</p>
        </div>
    {/if}
</div>

<style>
    @keyframes slide {
        from { background-position-x: 0px; }
        to   { background-position-x: -1920px; }
    }
    .bg_optk {
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
        animation: slide 90s linear infinite;
    }

    h1 {
        text-align: center;
    }

    #container {
        margin: auto;
        padding: 0 100px 64px;
        max-width: 900px;
    }

    .card {
        background: rgba(255, 255, 255, 0.88);
        border-radius: 8px;
        padding: 24px 32px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.18);
    }

    .artist-name {
        margin: 0 0 16px;
        font-size: 2em;
        color: #222;
    }

    .section-title {
        margin: 16px 0 8px;
        font-size: 1em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #555;
        border-bottom: 1px solid #ddd;
        padding-bottom: 4px;
    }

    /* Links */
    .links-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
    }
    .link-btn {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 4px;
        color: white;
        text-decoration: none;
        font-size: 0.9em;
        font-weight: bold;
        transition: opacity 0.15s;
    }
    .link-btn:hover {
        opacity: 0.82;
    }

    /* Song list — shared grid so all chip cells use the widest chip's width */
    .song-list {
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        row-gap: 6px;
        column-gap: 10px;
    }

    /* Each Link spans all 3 columns and inherits column widths via subgrid */
    :global(.song-row) {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        align-items: center;
        padding: 6px 10px;
        border-radius: 4px;
        text-decoration: none;
        color: #222;
        background: rgba(0,0,0,0.04);
        transition: background 0.15s;
    }
    :global(.song-row:hover) {
        background: color-mix(in srgb, var(--genre-bg) 22%, rgba(255,255,255,0.7));
        color: #222;
    }

    .genre-chip {
        display: block;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 0.75em;
        font-weight: bold;
        white-space: nowrap;
        text-align: center;
    }

    .song-title {
        font-weight: 600;
        text-align: center;
    }

    .song-sub {
        font-size: 0.82em;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
        /* Cap at ~chip width so the two side columns stay symmetric */
        max-width: 150px;
        cursor: default;
    }
</style>
