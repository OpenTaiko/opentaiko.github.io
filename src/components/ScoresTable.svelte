<script>
    // The scores on one chart, best List Points first, each as a row: position, player,
    // clear badge, grade, score (with its screenshot on hover when there is one), judgements,
    // accuracy, List Points and video.
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _ } from 'svelte-i18n';
    import GradeMark from "./GradeMark.svelte";
    import { statusKey } from '../i18n/index.js';
    import { loadHof, scoreRow } from "../lib/hof.js";
    import { CROWN, rankArt } from "../lib/skin.js";

    export let SongCard;
    export let Difficulty;

    let scores = [];
    let previewImg;

    onMount(async () => {
        const hof = await loadHof();
        const rank = SongCard.Rank[Difficulty];
        scores = hof.scores
            .filter(r => r[1] === SongCard.UniqueId && r[2] === Difficulty)
            .map(r => scoreRow(r, rank))
            .sort((a, b) => b.lp !== a.lp ? b.lp - a.lp : b.score - a.score);
    });

    $: ranked = SongCard.Rank[Difficulty] >= 0;

    // each row's status, as a wash from its left edge that starts half transparent and is gone by the middle
    const STATUS_WASH = {
        'Clear': 'linear-gradient(90deg, rgba(255, 143, 171, 0.5), rgba(255, 143, 171, 0) 50%)',
        'Full Combo': 'linear-gradient(90deg, rgba(255, 194, 36, 0.5), rgba(255, 194, 36, 0) 50%)',
        'Perfect': 'linear-gradient(90deg, rgba(255, 77, 77, 0.5) 0%, rgba(255, 194, 36, 0.42) 12%, rgba(88, 222, 133, 0.32) 24%, rgba(81, 192, 253, 0.22) 36%, rgba(144, 101, 226, 0.12) 44%, rgba(144, 101, 226, 0) 50%)',
    };
    const washOf = (status) => STATUS_WASH[status] ? `${STATUS_WASH[status]}, var(--paper-soft)` : 'var(--paper-soft)';

    const showPreview = (src) => { previewImg.src = src; previewImg.style.display = 'block'; };
    const hidePreview = () => { previewImg.style.display = 'none'; };
    const movePreview = (event) => {
        previewImg.style.left = `${event.pageX}px`;
        previewImg.style.top = `${event.pageY - 94}px`;
    };

    const OpenSubmitForm = () => {
        const url = `https://docs.google.com/forms/d/e/1FAIpQLSc-35dkvrUNdzBaoVP5JoGwpruiaypqU6IV2LV28ORlP7Bong/viewform?usp=pp_url&entry.618863437=${encodeURIComponent(SongCard.Title)}&entry.1494222525=${encodeURIComponent(SongCard.UniqueId)}&entry.1320089911=${encodeURIComponent(Difficulty)}`;
        window.open(url, '_blank');
    };
</script>

<button type="button" class="sun-button submit" on:click={OpenSubmitForm}>{$_('scores.submit')}</button>

{#if scores.length === 0}
    <p class="empty">{$_('scores.empty')}</p>
{/if}

{#each scores as s, idx (s.scoreId)}
    <div class="row" style="background:{washOf(s.status)}">
        <span class="pos">
            {#if rankArt(idx + 1)}<img src={rankArt(idx + 1)} alt="#{idx + 1}" />{:else}#{idx + 1}{/if}
        </span>
        <div class="who">
            <Link to="/playerinfo/{encodeURIComponent(s.player)}" class="player ell" title={s.player}>{s.player}</Link>
            <div class="judges">
                <span>{$_('table.good')} {s.good}</span>
                <span>{$_('table.ok')} {s.ok}</span>
                <span>{$_('table.bad')} {s.bad}</span>
                <span>{s.accuracy.toFixed(2)}%</span>
                {#if s.video}<a href={s.video} target="_blank" rel="noopener noreferrer">▶ {$_('table.video')}</a>{/if}
            </div>
        </div>
        <div class="right">
            {#if CROWN[s.status]}
                <img class="crown" src={CROWN[s.status]} alt={$_(statusKey(s.status))} title={$_(statusKey(s.status))} />
            {:else}
                <span class="failed">{$_(statusKey(s.status))}</span>
            {/if}
            <GradeMark grade={s.grade} />
            <div class="numbers">
                {#if s.image}
                    <b class="has-image" on:mouseenter={() => showPreview(s.image)} on:mouseleave={hidePreview} on:mousemove={movePreview}>{s.score.toLocaleString('en-US')}</b>
                {:else}
                    <b>{s.score.toLocaleString('en-US')}</b>
                {/if}
                {#if ranked}<small>{s.lp} LP</small>{/if}
            </div>
        </div>
    </div>
{/each}

<img bind:this={previewImg} class="preview-image" alt="" />

<style>
    .submit {
        margin: 0 0 14px;
    }
    .empty {
        color: var(--ink-soft);
        margin: 4px 0 0;
    }
    .row {
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        padding: 6px 12px 6px 8px;
        margin-bottom: 8px;
        border: 2px solid var(--ink);
        border-radius: 16px;
        background: var(--paper-soft);
    }
    .pos {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: var(--ink-soft);
    }
    .pos img {
        height: 34px;
        display: block;
        margin: 0 auto;
    }
    .who {
        min-width: 0;
    }
    .who :global(.player) {
        display: block;
        font-size: 15px;
        font-weight: 500;
        color: var(--ink);
        text-decoration: none;
    }
    .who :global(.player:hover) {
        text-decoration: underline;
    }
    .judges {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 10px;
        font-size: 12px;
        color: var(--ink-soft);
    }
    .judges a {
        color: var(--sky-1);
        font-weight: 500;
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
    .numbers b {
        display: block;
        font-size: 15px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }
    .has-image {
        cursor: zoom-in;
        text-decoration: underline dotted;
    }
    .numbers small {
        font-size: 12px;
        color: var(--ink-soft);
    }
    .preview-image {
        position: absolute;
        pointer-events: none;
        display: none;
        z-index: 1000;
        max-width: 200px;
        border: 2px solid var(--ink);
        border-radius: 10px;
        box-shadow: 0 4px 14px rgba(13, 36, 64, 0.25);
    }

    @media (max-width: 560px) {
        .row { grid-template-columns: 36px minmax(0, 1fr); }
        .right { grid-column: 1 / -1; justify-content: flex-end; }
    }
</style>
