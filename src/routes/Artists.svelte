<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _ } from 'svelte-i18n';
    import initSqlJs from "sql.js";

    let loading = true;
    let artists = [];
    let search = '';

    $: filtered = search.trim() === ''
        ? artists
        : artists.filter(a => a.name.toLowerCase().includes(search.trim().toLowerCase()));

    onMount(async () => {
        const [SQL, buf, songsRaw] = await Promise.all([
            initSqlJs({ locateFile: () => '/sql-wasm.wasm' }),
            fetch('/artists_info.db3').then(r => r.arrayBuffer()),
            fetch('https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json').then(r => r.json()),
        ]);

        let songs = songsRaw;
        if (navigator.language === 'zh-CN') {
            songs = songs.filter(s => s['uniqueId'] !== 'losTPEtAlSwANDERRBHLiXoUNdsetSUnaN');
        }
        const validUids = new Set(songs.map(s => s['uniqueId']));

        const db = new SQL.Database(new Uint8Array(buf));
        const songRows  = db.exec('SELECT songUid, artists FROM songs');
        const artistRows = db.exec('SELECT entryId, artist FROM artists');
        db.close();

        const counts = new Map();
        if (songRows[0]) {
            for (const [uid, artistsJson] of songRows[0].values) {
                if (!validUids.has(uid)) continue;
                for (const id of JSON.parse(artistsJson)) {
                    counts.set(id, (counts.get(id) ?? 0) + 1);
                }
            }
        }

        if (artistRows[0]) {
            artists = artistRows[0].values
                .map(([id, name]) => ({ id, name, cnt: counts.get(id) ?? 0 }))
                .filter(a => a.cnt > 0)
                .sort((a, b) => b.cnt - a.cnt || a.name.localeCompare(b.name));
        }
        loading = false;
    });
</script>

<div class="bg_optk"></div>

<h1 style="color:white;">{$_('artists.title')}</h1>

<div id="container">
    {#if loading}
        <div class="card">
            <p style="text-align:center;">{$_('artists.loading')}</p>
            <img src="/image/loading.gif" alt="Loading"
                 style="display:block;margin:0 auto;">
        </div>
    {:else}
        <div class="card">
            <div class="toolbar">
                <p class="count-info">{$_('artists.count', { values: { filtered: filtered.length, total: artists.length } })}</p>
                <input
                    class="search-input"
                    type="search"
                    placeholder={$_('artists.search')}
                    bind:value={search}
                />
            </div>
            <ul class="artist-list">
                {#each filtered as a}
                <li>
                    <Link to="/artistinfo/{a.id}" class="artist-row">
                        <span class="artist-name">{a.name}</span>
                        <span class="song-count">{$_('artists.songs', { values: { count: a.cnt } })}</span>
                    </Link>
                </li>
                {/each}
                {#if filtered.length === 0}
                <li class="no-results">{$_('artists.no_results', { values: { search } })}</li>
                {/if}
            </ul>
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

    h1 { text-align: center; }

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

    .toolbar {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
    }

    .count-info {
        margin: 0;
        color: #888;
        font-size: 0.9em;
        white-space: nowrap;
    }

    .search-input {
        flex: 1;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.95em;
        outline: none;
        transition: border-color 0.15s;
    }
    .search-input:focus {
        border-color: #f76b20;
    }

    .artist-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    :global(.artist-row) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-radius: 4px;
        text-decoration: none;
        color: #222;
        background: rgba(0,0,0,0.04);
        transition: background 0.12s, color 0.12s;
    }
    :global(.artist-row:hover) {
        background: #f76b20;
        color: #222;
    }

    .artist-name {
        font-weight: 600;
    }

    .song-count {
        font-size: 0.85em;
        color: #666;
        transition: color 0.12s;
    }

    :global(.artist-row:hover) .song-count {
        color: rgba(0,0,0,0.6);
    }

    .no-results {
        padding: 12px;
        color: #888;
        font-style: italic;
    }
</style>
