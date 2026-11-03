<script>
    // One score as a bar: its song's genre art across the whole row (washed toward white),
    // the course medallion, the title (wrapping when long) over the player, accuracy and video,
    // and on the right the clear badge, grade, score and List Points.
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import Medallion from "./Medallion.svelte";
    import GradeMark from "./GradeMark.svelte";
    import { localizedTitle } from "../lib/localize.js";
    import { genreToCSS } from "../lib/genres.js";
    import { barArtWashed, CROWN } from "../lib/skin.js";
    import { statusKey } from "../i18n/index.js";

    export let s;               // a score from lib/hof.js rankedScores()
    export let showPlayer = true;

    $: statusName = $_(statusKey(s.status));
</script>

<div class="row" style="background:{barArtWashed(genreToCSS(s.song.tjaGenreFolder))}">
    <Medallion course={s.course} level={s.level} size={50} />
    <div class="main">
        <Link to="/songinfo/{s.uid}?d={s.course}" class="title">{localizedTitle(s.song, $locale)}</Link>
        <div class="meta">
            {#if showPlayer}<Link to="/playerinfo/{encodeURIComponent(s.player)}" class="player">{s.player}</Link>{/if}
            <span>{s.accuracy.toFixed(2)}%</span>
            <span>{$_('leaderboards.hof_rank', { values: { rank: s.rank } })}</span>
            {#if s.video}
                <a class="video" href={s.video} target="_blank" rel="noopener noreferrer">▶ {$_('table.video')}</a>
            {/if}
        </div>
    </div>
    <div class="right">
        {#if CROWN[s.status]}
            <img class="crown" src={CROWN[s.status]} alt={statusName} title={statusName} />
        {:else}
            <span class="failed">{statusName}</span>
        {/if}
        <GradeMark grade={s.grade} />
        <div class="numbers">
            <div class="score" title="{$_('table.good')} {s.good} / {$_('table.ok')} {s.ok} / {$_('table.bad')} {s.bad}">{s.score.toLocaleString('en-US')}</div>
            <div class="lp">{s.lp} LP</div>
        </div>
    </div>
</div>

<style>
    .row {
        content-visibility: auto;
        contain-intrinsic-size: auto 64px;
        display: grid;
        grid-template-columns: 50px minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        padding: 6px 12px 6px 8px;
        margin-bottom: 8px;
        border: 2px solid var(--ink);
        border-radius: 16px;
        text-align: left;
    }
    .main {
        min-width: 0;
    }
    .main :global(.title) {
        display: block;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.25;
        color: var(--ink);
        text-decoration: none;
        overflow-wrap: anywhere;
    }
    .main :global(.title:hover) {
        text-decoration: underline;
    }
    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 10px;
        margin-top: 2px;
        font-size: 12px;
        color: var(--ink-soft);
    }
    .meta :global(.player) {
        font-weight: 500;
        color: var(--ink);
        text-decoration: none;
    }
    .meta :global(.player:hover) {
        text-decoration: underline;
    }
    .video {
        font-weight: 500;
        color: var(--sky-1);
        text-decoration: none;
    }
    .right {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .crown {
        width: 44px;
        height: 44px;
        flex: none;
    }
    .failed {
        font-size: 12px;
        font-weight: 500;
        color: var(--ink-soft);
    }
    .numbers {
        width: 84px;
        text-align: right;
        line-height: 1.15;
    }
    .score {
        font-size: 15px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .lp {
        font-size: 12px;
        color: var(--ink-soft);
        font-variant-numeric: tabular-nums;
    }

    @media (max-width: 560px) {
        .row { grid-template-columns: 44px minmax(0, 1fr); }
        .right { grid-column: 1 / -1; justify-content: flex-end; }
    }
</style>
