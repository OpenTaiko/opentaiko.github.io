<script>
    // A song as a bar: the genre's song select overlay art underneath, a white title card laid
    // over it, and the level emblems beside the card on the art (never under it).
    // In the Hall of Fame it also carries the chart's rank, its List Points, a stripe for the best
    // status anyone has on it, and its play count.
    import { _ } from 'svelte-i18n';
    import AudioPlayer from "./AudioPlayer.svelte";
    import Medallion from "./Medallion.svelte";
    import { barArt, rankArt, RANK_TINT, STATUS_STRIPE, towerCategoryByCss } from "../lib/skin.js";
    import { audioUrl } from "../lib/soundtrack.js";

    export let Rank = undefined;
    export let Title;
    export let Subtitle;
    export let Difficulties = [-1, -1, -1, -1, -1, -1, -1];
    export let AudioFilePath;
    export let Genre;
    export let MaxListPoints = undefined;
    export let UniqueId = undefined;
    export let BestStatus = null;
    export let Plays = undefined;

    $: isHof = Rank !== undefined;
    $: courses = isHof
        ? Difficulties.map((lv, i) => ({ i, lv })).filter(d => d.i <= 4 && d.lv >= 0)
        : [0, 1, 2, 3, 4].map(i => ({ i, lv: Difficulties[i] ?? -1 }));
    $: tower = (Difficulties[5] ?? -1) >= 0 ? Difficulties[5] : null;
    $: dan = (Difficulties[6] ?? -1) >= 0 ? Difficulties[6] : null;
    $: special = tower !== null || dan !== null;
    $: towerCat = towerCategoryByCss(Genre)?.key ?? 'sweet';

    const openSongInfo = (e) => {
        if (UniqueId === undefined) return;
        if (e.target.closest('button, .slider')) return;
        window.open(`/songinfo/${UniqueId}`, '_blank');
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="bar" class:clickable={UniqueId !== undefined} class:hof={isHof} style="background:{barArt(Genre)}" on:click={openSongInfo}>
    {#if isHof}
        <div class="rank" style="background:{RANK_TINT[Rank - 1] ?? '#ffffff'}">
            {#if rankArt(Rank)}
                <img src={rankArt(Rank)} alt="#{Rank}" />
            {:else}
                <span class="rank-n">#{Rank}</span>
            {/if}
            <span class="rank-lp">{MaxListPoints} LP</span>
        </div>
        {#if BestStatus === 'Perfect'}
            <div class="stripe perfect" title="Best: Perfect"></div>
        {:else}
            <div class="stripe" style="background:{STATUS_STRIPE[BestStatus] ?? '#b9c7d4'}" title={BestStatus ? `Best: ${BestStatus}` : ''}></div>
        {/if}
    {/if}

    <div class="inner">
        <div class="card">
            <AudioPlayer Title={Title} Subtitle={Subtitle} AudioLink={audioUrl(AudioFilePath)} />
            {#if Plays !== undefined}
                <span class="plays">{$_('hof.plays', { values: { count: Plays } })}</span>
            {/if}
        </div>

        <div class="emblems">
            {#if special && !isHof}
                {#if tower !== null}<Medallion course={5} level={tower} {towerCat} />{/if}
                {#if dan !== null}<Medallion course={6} level={dan} />{/if}
            {:else}
                {#each courses as c}
                    <Medallion course={c.i} level={c.lv} />
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .bar {
        /* long lists: bars off screen are skipped until scrolled to */
        content-visibility: auto;
        contain-intrinsic-size: auto 78px;
        display: flex;
        align-items: stretch;
        margin: 0 0 10px;
        border: 2px solid var(--ink);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 4px 0 rgba(13, 36, 64, 0.16);
        text-align: left;
        color: var(--ink);
    }
    .clickable {
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
    }
    .clickable:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 0 rgba(13, 36, 64, 0.2);
    }

    .rank {
        width: 92px;
        flex: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 6px 0;
        border-right: 2px solid var(--ink);
        line-height: 1.05;
    }
    .rank img {
        height: 40px;
        display: block;
    }
    .rank-n {
        font-size: 24px;
        font-weight: 500;
    }
    .rank-lp {
        font-size: 12px;
        color: var(--ink-soft);
    }
    .stripe {
        width: 10px;
        flex: none;
        border-right: 2px solid var(--ink);
    }
    /* a Perfect's rainbow keeps flowing down the stripe, as it did on the old bars. The gradient
       starts and ends on the same red and repeats, so shifting it by one tile (300% of the stripe,
       i.e. a background-position of 150%) loops without a seam. */
    .stripe.perfect {
        background-image: linear-gradient(180deg, #ff4d4d, #ffc224, #58de85, #51c0fd, #9065e2, #ff4d4d);
        background-size: 100% 300%;
        background-repeat: repeat-y;
        animation: rainbow-stripe 3s linear infinite;
    }
    @keyframes rainbow-stripe {
        from { background-position: 50% 0%; }
        to { background-position: 50% 150%; }
    }
    @media (prefers-reduced-motion: reduce) {
        .stripe.perfect { animation: none; }
    }

    .inner {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px 6px 6px;
    }
    .card {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 12px 7px 10px;
        border: 2px solid var(--ink);
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.86);
    }
    .plays {
        flex: none;
        font-size: 12px;
        font-weight: 500;
        padding: 3px 10px;
        border-radius: 999px;
        background: #eef7fe;
        border: 1.5px solid var(--line);
        white-space: nowrap;
    }
    .emblems {
        flex: none;
        display: flex;
        align-items: center;
        gap: 2px;
    }

    /* phones: the medallions move under the title card */
    @media (max-width: 700px) {
        .inner { flex-wrap: wrap; justify-content: flex-end; }
        .card { flex-basis: 100%; }
        .rank { width: 70px; }
        .rank img { height: 32px; }
    }
</style>
