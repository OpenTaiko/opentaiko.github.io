<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import Medallion from "../components/Medallion.svelte";
    import GradeMark from "../components/GradeMark.svelte";
    import { localizedTitle } from "../lib/localize.js";
    import { genreToCSS } from "../lib/genres.js";
    import { fetchSoundtrack } from "../lib/soundtrack.js";
    import { loadHof, rankedScores, topPlayers, songsByIdOf } from "../lib/hof.js";
    import { barArt, CROWN, STATUSES, GRADE_ORDER, rankArt, RANK_TINT } from "../lib/skin.js";
    import { statusKey } from "../i18n/index.js";

    export let Player;

    const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
    $: name = decode(Player ?? '');

    let Fetching = true;
    let all = [];
    let players = [];

    onMount(async () => {
        const [songs, hof] = await Promise.all([fetchSoundtrack(), loadHof()]);
        all = rankedScores(hof, songsByIdOf(songs));
        players = topPlayers(all);
        Fetching = false;
    });

    $: mine = all.filter(s => s.player === name);
    $: rank = players.findIndex(p => p.player === name) + 1;
    $: lp = mine.reduce((t, s) => t + s.lp, 0);
    $: statusCounts = STATUSES.map(st => ({ st, n: mine.filter(s => s.status === st).length }));
    $: gradeCounts = GRADE_ORDER.map(g => ({ g, n: mine.filter(s => s.grade === g).length })).filter(x => x.n > 0);
    // the hardest chart (lowest Hall of Fame rank) for each status
    $: feats = STATUSES.map(st => {
        const best = mine.filter(s => s.status === st).sort((a, b) => a.rank - b.rank)[0];
        return best ? { st, s: best } : null;
    }).filter(Boolean);
</script>

<div class="page-wrap player-page">
    <div class="back"><Link to="/leaderboards">‹ {$_('leaderboards.title')}</Link></div>

    {#if Fetching}
        <p class="loading-note">{$_('common.loading')}</p>
    {:else if mine.length === 0}
        <div class="panel head"><div class="who"><div class="name">{name}</div><div class="sub">{$_('playerinfo.no_scores')}</div></div></div>
    {:else}
        <!-- who, where they stand, what they have -->
        <div class="panel head" style="background:{RANK_TINT[rank - 1] ?? '#ffffff'}">
            {#if rankArt(rank)}<img class="rank-art" src={rankArt(rank)} alt="#{rank}" />{/if}
            <div class="who">
                <div class="name ell">{name}</div>
                <div class="sub">{$_('playerinfo.rank_of', { values: { rank, total: players.length } })}</div>
            </div>
            <div class="stats">
                <div><span>{$_('playerinfo.list_points')}</span><b>{lp.toLocaleString('en-US')}</b></div>
                <div><span>{$_('playerinfo.scores')}</span><b>{mine.length}</b></div>
            </div>
            <div class="marks">
                {#each statusCounts as c}
                    <span class="mark"><img src={CROWN[c.st]} alt={$_(statusKey(c.st))} title={$_(statusKey(c.st))} />{c.n}</span>
                {/each}
                <span class="sep"></span>
                {#each gradeCounts as c}
                    <span class="mark"><GradeMark grade={c.g} />{c.n}</span>
                {/each}
            </div>
        </div>

        <!-- the hardest chart for each status -->
        <h2 class="section">{$_('playerinfo.hardest')}</h2>
        <div class="feats">
            {#each feats as f}
                <div class="bar" style="background:{barArt(genreToCSS(f.s.song.tjaGenreFolder))}">
                    <div class="card column">
                        <div class="feat-top">
                            <img src={CROWN[f.st]} alt={$_(statusKey(f.st))} />
                            <span>{$_('leaderboards.hof_rank', { values: { rank: f.s.rank } })}</span>
                        </div>
                        <Link to="/songinfo/{f.s.uid}?d={f.s.course}" class="song ell" title={localizedTitle(f.s.song, $locale)}>{localizedTitle(f.s.song, $locale)}</Link>
                    </div>
                    <Medallion course={f.s.course} level={f.s.level} />
                </div>
            {/each}
        </div>

        <!-- every score -->
        <h2 class="section">{$_('playerinfo.all_scores')}</h2>
        {#each mine as s (s.scoreId)}
            <div class="bar" style="background:{barArt(genreToCSS(s.song.tjaGenreFolder))}">
                <div class="card">
                    <div class="score-main">
                        <Link to="/songinfo/{s.uid}?d={s.course}" class="song">{localizedTitle(s.song, $locale)}</Link>
                        <div class="score-meta">
                            <span>{$_('leaderboards.hof_rank', { values: { rank: s.rank } })}</span>
                            <span>{s.accuracy.toFixed(2)}%</span>
                            {#if s.video}<a href={s.video} target="_blank" rel="noopener noreferrer">▶ {$_('table.video')}</a>{/if}
                        </div>
                    </div>
                    {#if CROWN[s.status]}<img class="crown" src={CROWN[s.status]} alt={$_(statusKey(s.status))} title={$_(statusKey(s.status))} />{/if}
                    <GradeMark grade={s.grade} />
                    <div class="numbers">
                        <b title="{$_('table.good')} {s.good} / {$_('table.ok')} {s.ok} / {$_('table.bad')} {s.bad}">{s.score.toLocaleString('en-US')}</b>
                        <small>{s.lp} LP</small>
                    </div>
                </div>
                <Medallion course={s.course} level={s.level} />
            </div>
        {/each}
    {/if}
</div>

<style>
    .player-page {
        max-width: 1040px;
        text-align: left;
    }
    .back {
        margin: 16px 0 8px;
    }
    .back :global(a) {
        color: #ffffff;
        font-size: 14px;
        text-decoration: none;
        text-shadow: 0 1px 0 rgba(13, 36, 64, 0.28);
    }

    .head {
        padding: 18px 20px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px 28px;
    }
    .rank-art {
        height: 84px;
        flex: none;
        filter: drop-shadow(0 3px 0 rgba(13, 36, 64, 0.35));
    }
    .who {
        min-width: 0;
        flex: 1 1 220px;
    }
    .name {
        font-size: 34px;
        font-weight: 500;
        line-height: 1.15;
    }
    .sub {
        font-size: 14px;
        color: var(--ink-soft);
    }
    .stats {
        display: flex;
        gap: 26px;
        flex-wrap: wrap;
    }
    .stats span {
        display: block;
        font-size: 12px;
        color: var(--ink-soft);
    }
    .stats b {
        font-size: 30px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .marks {
        flex-basis: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 22px;
        padding-top: 12px;
        border-top: 2px dashed #b9c7d4;
    }
    .mark {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 16px;
        font-weight: 500;
    }
    .mark img {
        width: 47px;
        height: 46px;
    }
    .sep {
        width: 2px;
        height: 30px;
        background: #b9c7d4;
        border-radius: 2px;
    }

    .section {
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
        margin: 22px 0 10px;
        text-shadow: 0 1px 0 rgba(13, 36, 64, 0.28);
    }
    .feats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
    }
    .feats .bar {
        margin: 0;
    }

    /* the song bar, as everywhere: art underneath, card over it, emblem beside it */
    .bar {
        content-visibility: auto;
        contain-intrinsic-size: auto 72px;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 9px;
        padding: 6px 8px 6px 6px;
        border: 2px solid var(--ink);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 4px 0 rgba(13, 36, 64, 0.16);
    }
    .card {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 7px 12px 7px 10px;
        border: 2px solid var(--ink);
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.86);
    }
    .card.column {
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
    }
    .feat-top {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--ink-soft);
    }
    .feat-top img {
        width: 40px;
        height: 40px;
    }
    .card :global(.song) {
        display: block;
        font-size: 16px;
        font-weight: 500;
        color: var(--ink);
        text-decoration: none;
        overflow-wrap: anywhere;
    }
    .card :global(.song:hover) {
        text-decoration: underline;
    }
    .score-main {
        min-width: 0;
        flex: 1;
    }
    .score-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 10px;
        font-size: 12px;
        color: var(--ink-soft);
    }
    .score-meta a {
        color: var(--sky-1);
        font-weight: 500;
        text-decoration: none;
    }
    .crown {
        width: 45px;
        height: 44px;
        flex: none;
    }
    .numbers {
        width: 92px;
        flex: none;
        text-align: right;
        line-height: 1.1;
    }
    .numbers b {
        display: block;
        font-size: 16px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .numbers small {
        font-size: 12px;
        color: var(--ink-soft);
    }

    @media (max-width: 600px) {
        .card { flex-wrap: wrap; }
        .score-main { flex-basis: 100%; }
    }
</style>
