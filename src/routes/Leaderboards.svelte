<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _ } from 'svelte-i18n';
    import ScoreRow from "../components/ScoreRow.svelte";
    import { fetchSoundtrack } from "../lib/soundtrack.js";
    import { loadHof, rankedScores, topPlayers, songsByIdOf } from "../lib/hof.js";
    import { CROWN, STATUSES, rankArt } from "../lib/skin.js";
    import { statusKey } from "../i18n/index.js";

    let Fetching = true;
    let scores = [];
    let players = [];

    onMount(async () => {
        const [songs, hof] = await Promise.all([fetchSoundtrack(), loadHof()]);
        scores = rankedScores(hof, songsByIdOf(songs));
        players = topPlayers(scores);
        Fetching = false;
    });

    const playerUrl = (p) => `/playerinfo/${encodeURIComponent(p)}`;
</script>

<h1 class="sky-title">{$_('leaderboards.title')}</h1>
{#if !Fetching}
    <p class="sky-sub">{$_('leaderboards.subtitle', { values: { players: players.length, scores: scores.length } })}</p>
{/if}

<div class="page-wrap">
    {#if Fetching}
        <p class="loading-note">{$_('common.loading')}</p>
    {:else}
        <!-- the top three: the replay list's 1 / 2 / 3, their points, their clear badges -->
        <div class="podium">
            {#each players.slice(0, 3) as p, i}
                <Link to={playerUrl(p.player)} class="top-card top-{i + 1}">
                    <img class="top-rank" class:first={i === 0} src={rankArt(i + 1)} alt="#{i + 1}" />
                    <div class="top-body">
                        <div class="top-name ell" title={p.player}>{p.player}</div>
                        <div class="top-lp"><b>{p.lp.toLocaleString('en-US')}</b> <span>{$_('leaderboards.lp_scores', { values: { count: p.count } })}</span></div>
                        <div class="marks">
                            {#each STATUSES as st}
                                <span class="mark"><img src={CROWN[st]} alt={$_(statusKey(st))} title={$_(statusKey(st))} />{p.statuses[st]}</span>
                            {/each}
                        </div>
                    </div>
                </Link>
            {/each}
        </div>

        <div class="columns">
            <!-- everyone else, each with their clear badges -->
            <div class="panel players">
                <h2>{$_('leaderboards.top_players')}</h2>
                {#each players.slice(3) as p, i}
                    <Link to={playerUrl(p.player)} class="player-row">
                        <span class="pr-rank">#{i + 4}</span>
                        <div class="pr-main">
                            <div class="pr-name ell" title={p.player}>{p.player}</div>
                            <div class="pr-marks">
                                {#each STATUSES as st}
                                    <span><img src={CROWN[st]} alt={$_(statusKey(st))} title={$_(statusKey(st))} />{p.statuses[st]}</span>
                                {/each}
                            </div>
                        </div>
                        <div class="pr-lp">
                            <b>{p.lp.toLocaleString('en-US')}</b>
                            <small>{$_('leaderboards.scores', { values: { count: p.count } })}</small>
                        </div>
                    </Link>
                {/each}
            </div>

            <!-- every score, best first -->
            <div class="panel best">
                <h2>{$_('leaderboards.best_scores')}</h2>
                {#each scores as s (s.scoreId)}
                    <ScoreRow {s} />
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .podium {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-bottom: 20px;
        text-align: left;
    }
    .podium :global(.top-card) {
        flex: 1 1 260px;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        border-radius: 22px;
        border: 2px solid var(--ink);
        color: var(--ink);
        text-decoration: none;
        box-shadow: 0 5px 0 var(--ink);
    }
    .podium :global(.top-card:hover) {
        color: var(--ink);
        transform: translateY(-1px);
    }
    .podium :global(.top-1) { flex-grow: 1.25; background: #fff4d1; }
    .podium :global(.top-2) { background: #eef2f6; }
    .podium :global(.top-3) { background: #fbe6d4; }
    .top-rank {
        height: 64px;
        flex: none;
        filter: drop-shadow(0 2px 0 rgba(13, 36, 64, 0.35));
    }
    .top-rank.first { height: 78px; }
    .top-body {
        min-width: 0;
        flex: 1;
    }
    .top-name {
        font-size: 19px;
        font-weight: 500;
    }
    .top-lp b {
        font-size: 28px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .top-lp span {
        font-size: 13px;
        color: var(--ink-soft);
    }
    .marks {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 12px;
        margin-top: 2px;
    }
    .mark {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 15px;
        font-weight: 500;
    }
    .mark img {
        width: 44px;
        height: 43px;
    }

    .columns {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: flex-start;
    }
    .panel h2 {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 10px;
    }
    .players {
        flex: 1 1 320px;
        max-width: 420px;
        min-width: 0;
        box-sizing: border-box;
        padding: 14px 12px 10px 14px;
        position: sticky;
        top: calc(var(--header-h) + 14px);
        max-height: calc(100vh - var(--header-h) - var(--footer-h) - 28px);
        overflow-y: auto;
        scrollbar-width: thin;
    }
    .players :global(.player-row) {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        border-radius: 12px;
        color: var(--ink);
        text-decoration: none;
    }
    .players :global(.player-row:nth-child(even)) {
        background: var(--paper-soft);
    }
    .players :global(.player-row:hover) {
        background: #e3f1fc;
        color: var(--ink);
    }
    .pr-rank {
        width: 32px;
        flex: none;
        font-size: 15px;
        font-weight: 500;
        color: var(--ink-soft);
    }
    .pr-main {
        flex: 1;
        min-width: 0;
    }
    .pr-name {
        font-size: 15px;
        font-weight: 500;
    }
    .pr-marks {
        display: flex;
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
    }
    .pr-marks span {
        display: inline-flex;
        align-items: center;
        gap: 1px;
    }
    .pr-marks img {
        width: 26px;
        height: 26px;
    }
    .pr-lp {
        text-align: right;
        line-height: 1.15;
    }
    .pr-lp b {
        display: block;
        font-size: 15px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .pr-lp small {
        font-size: 11px;
        color: var(--ink-soft);
        white-space: nowrap;
    }
    .best {
        flex: 999 1 560px;
        min-width: 0;
        padding: 14px 12px 6px;
    }

    @media (max-width: 900px) {
        .players { position: static; max-height: none; max-width: none; }
    }
</style>
