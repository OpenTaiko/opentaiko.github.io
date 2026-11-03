<script>
    import { onMount, tick } from "svelte";
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import PlayButton from "../components/PlayButton.svelte";
    import { claimPreview } from "../components/AudioPlayer.svelte";
    import TowerDigits from "../components/TowerDigits.svelte";
    import { localizedTitle, localizedSubtitle } from "../lib/localize.js";
    import { fetchSoundtrack, audioUrl } from "../lib/soundtrack.js";
    import { IMG, TOWER_CATEGORIES, TOWER_TINT, towerTag } from "../lib/skin.js";

    /**
     * Taiko Towers, drawn as the game's tower select draws them: each chart is its own tower
     * (three floors of its look and the roof) standing on a plaza along the road, its name tag
     * over it, the chosen one's box at the top.
     *
     * Only what soundtrack_info.json carries is shown: the folder number (TSW01 -> Tower 1),
     * title, subtitle, Tower level and charter. Lives and floor counts live in the charts
     * themselves, so they are not shown.
     */
    const EDGE = 140;     // px from the field's ends to the first and last plaza
    const STEP = 262;     // px between plazas (a tag is 231 px wide, 254 when chosen)

    let activeKey = 'sweet';
    let SongsInfo = [];
    let Fetching = true;
    let chosen = {};      // category -> tower number

    /** Tower number from the TSW01 / TSP07 / TCH01 prefix of the chart's folder. */
    const floorOf = (song) => {
        const name = (song.tjaFolderPath ?? '').replace(/\\/g, '/').replace(/\/+$/, '').split('/').pop() ?? '';
        const m = name.match(/^[A-Z]+(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    };

    $: cat = TOWER_CATEGORIES.find(c => c.key === activeKey);
    $: towers = SongsInfo
        .filter(s => s.tjaGenreFolder === cat.folder)
        .map(s => ({
            n: floorOf(s), song: s, uid: s.uniqueId,
            level: s.chartDifficulties?.Tower ?? 0,
            charter: s.chartMakers?.Tower ?? '',
            audio: s.chartAudioFilePath,
        }))
        .sort((a, b) => a.n - b.n);
    $: current = towers.find(t => t.n === chosen[activeKey]) ?? towers[0];
    $: sceneW = EDGE * 2 + Math.max(0, towers.length - 1) * STEP;

    // the preview of the chosen tower's song. Its play / pause state follows the element's own
    // events (a bound `paused` stays stuck at "playing" when the source changes under it), and
    // choosing another tower or category stops it first.
    let audio;
    let playing = false;
    $: currentAudio = current ? audioUrl(current.audio) : '';
    const sync = () => { playing = !!audio && !audio.paused; };
    const stopPreview = () => { if (audio && !audio.paused) audio.pause(); playing = false; };
    const togglePreview = () => {
        if (!audio) return;
        if (audio.paused) { claimPreview(audio); audio.play().catch(sync); }
        else audio.pause();
    };

    const choose = (t) => {
        if (current && t.n === current.n) return;
        stopPreview();
        chosen = { ...chosen, [activeKey]: t.n };
    };
    const switchCategory = (key) => {
        if (key === activeKey) return;
        stopPreview();
        activeKey = key;
    };

    // where a tag's name starts: after its level digits (28 px tall, each but the last overlapping by half)
    const nameLeft = (level) => {
        const w = 28 * 68 / 81, len = String(Math.floor(level)).length;
        return 10 + w * (0.5 * (len - 1) + 1) + ((level % 1) >= 0.5 ? w * 0.3 : 0) + 6;
    };


    // keep the chosen tower in view; an action, so the scroll stays out of the reactive graph
    const followChosen = (el, n) => {
        const go = (smooth) => tick().then(() => {
            const stop = el.querySelector('.stop.on');
            if (!stop) return;
            const x = stop.offsetLeft - el.clientWidth / 2;
            el.scrollTo({ left: Math.max(0, x), behavior: smooth ? 'smooth' : 'auto' });
        });
        go(false);
        return { update: () => go(true) };
    };

    onMount(async () => {
        SongsInfo = await fetchSoundtrack();
        Fetching = false;
    });
</script>

<h1 class="sky-title">{$_('towers.title')}</h1>

<div class="page-wrap">
    <!-- categories: the tower select's own 甘口 / 辛口 pills -->
    <div class="cats">
        {#each TOWER_CATEGORIES as c}
            {#if c.pill}
                <button type="button" class="cat-pill" class:on={activeKey === c.key} aria-pressed={activeKey === c.key} on:click={() => switchCategory(c.key)}>
                    <img src={c.pill} alt={$_(`towers.${c.key}`)} />
                </button>
            {:else}
                <button type="button" class="cat-chip" class:on={activeKey === c.key} aria-pressed={activeKey === c.key} on:click={() => switchCategory(c.key)}>{$_(`towers.${c.key}`)}</button>
            {/if}
        {/each}
    </div>
    <p class="sky-sub">{$_(`towers.${activeKey}_desc`)}{#if !Fetching} · {$_('towers.count', { values: { count: towers.length } })}{/if}</p>

    {#if Fetching}
        <p class="loading-note">{$_('common.loading')}</p>
    {:else if towers.length === 0}
        <p class="loading-note">{$_('towers.empty')}</p>
    {:else}
        <!-- the chosen tower's box, at the top as the tower select puts it -->
        <audio bind:this={audio} src={currentAudio} preload="none"
               on:play={sync} on:pause={sync} on:ended={sync} on:emptied={sync}></audio>
        <div class="info-wrap">
            <div class="info" style="--tint:{TOWER_TINT[activeKey]}">
                <div class="info-head"></div>
                <Link to="/songinfo/{current.uid}" class="info-title ell" title={localizedTitle(current.song, $locale)}>{localizedTitle(current.song, $locale)}</Link>
                <div class="info-strip"></div>
                <div class="info-artist ell" title={localizedSubtitle(current.song, $locale)}>{localizedSubtitle(current.song, $locale)}</div>
                <div class="info-charter ell" title={current.charter}>{current.charter}</div>
                <div class="info-rule" style="left:33%"></div>
                <div class="info-rule" style="left:66.5%"></div>
                {#if cat.pill}
                    <img class="info-pill" src={cat.pill} alt={$_(`towers.${activeKey}`)} />
                {:else}
                    <span class="info-chip">{$_(`towers.${activeKey}`)}</span>
                {/if}
                <span class="info-level"><TowerDigits value={current.level} cat={activeKey} height={36} /></span>
                <span class="info-play"><PlayButton playing={playing} label={localizedTitle(current.song, $locale)} size={40} on:click={togglePreview} /></span>
                <span class="info-play-label">{$_('towers.preview')}</span>
                <span class="info-n-label">{$_('towers.floor_short')}</span>
                <span class="info-n"><b>{current.n}</b> <small>{$_('towers.of', { values: { total: towers.length } })}</small></span>
            </div>
        </div>

        <!-- the field: one tower per chart along the road, Tower 1 on the left -->
        <div class="field-frame">
            <div class="field-scroll" use:followChosen={current.n}>
                <div class="field" style="width:{sceneW}px; background-image:url({IMG}/tower/grass.jpg)">
                    <div class="horizon"></div>
                    <div class="road"></div>
                    {#each towers as t, i (t.uid)}
                        <button
                            type="button"
                            class="stop"
                            class:on={t.n === current.n}
                            style="left:{EDGE + i * STEP}px"
                            aria-label="{$_('towers.floor_short')} {t.n}: {localizedTitle(t.song, $locale)}"
                            aria-pressed={t.n === current.n}
                            on:click={() => choose(t)}
                        >
                            <span class="plaza" style="background-image:url({IMG}/tower/rim.jpg)"><span style="background-image:url({IMG}/tower/pave.jpg)"></span></span>
                            <img class="tower" src="{IMG}/tower/tower_day.png" alt="" decoding="async" loading="lazy" />
                            <span class="tag" style="background-image:url({towerTag(activeKey)})">
                                <span class="tag-level"><TowerDigits value={t.level} cat={activeKey} height={28} /></span>
                                <span class="tag-name ell" style="left:{nameLeft(t.level)}px" title={localizedTitle(t.song, $locale)}>{localizedTitle(t.song, $locale)}</span>
                            </span>
                            <span class="plate">{$_('towers.floor_short')} {t.n}</span>
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .cats {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        margin: 10px 0 4px;
    }
    .cat-pill {
        position: relative;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
    }
    .cat-pill img {
        height: 46px;
        display: block;
        opacity: 0.55;
    }
    .cat-pill.on img {
        opacity: 1;
        filter: drop-shadow(0 4px 0 rgba(13, 36, 64, 0.3));
    }
    .cat-pill.on::after, .cat-chip.on::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -9px;
        transform: translateX(-50%);
        width: 34px;
        height: 4px;
        border-radius: 999px;
        background: var(--sun);
    }
    .cat-chip {
        position: relative;
        height: 40px;
        margin: 0;
        padding: 0 18px;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #e4e4e4;
        color: var(--ink);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        opacity: 0.7;
    }
    .cat-chip.on {
        opacity: 1;
        box-shadow: 0 3px 0 var(--ink);
    }
    .sky-sub {
        margin-top: 16px;
    }

    /* ── the chosen tower's box (tower_select's info box: light fill, ink edge, header in the category colour) ── */
    .info-wrap {
        max-width: 680px;
        margin: 0 auto 16px;
    }
    .info {
        container-type: inline-size;
        position: relative;
        width: 100%;
        aspect-ratio: 880 / 250;
        box-sizing: border-box;
        border: 2.5px solid var(--ink);
        border-radius: 3.6cqw;
        background: #ebebeb;
        overflow: hidden;
        color: #343434;
        text-align: left;
        box-shadow: 0 10px 22px rgba(13, 36, 64, 0.22);
    }
    .info > * {
        position: absolute;
    }
    .info-head {
        left: 0; right: 0; top: 0;
        height: 46%;
        background: var(--tint);
    }
    .info :global(.info-title) {
        position: absolute;
        left: 50%;
        top: 19%;
        transform: translate(-50%, -50%);
        width: 90%;
        text-align: center;
        font-size: 4.545cqw;
        font-weight: 500;
        color: #343434;
        text-decoration: none;
    }
    .info :global(.info-title:hover) {
        text-decoration: underline;
    }
    .info-strip {
        left: 4%; right: 4%; top: 31%;
        height: 10.5%;
        border-radius: 999px;
        background: #ebebeb;
    }
    .info-artist {
        left: 43.18%; top: 36.2%;
        transform: translate(-50%, -50%);
        width: 58%;
        text-align: center;
        font-size: 2.159cqw;
    }
    .info-charter {
        right: 6.36%; top: 36.2%;
        transform: translateY(-50%);
        max-width: 24%;
        text-align: right;
        font-size: 1.705cqw;
        color: #828282;
    }
    .info-rule {
        top: 54%; bottom: 9%;
        border-left: 2px dotted #343434;
    }
    .info-pill {
        left: 6.59%; top: 73.6%;
        height: 4.43cqw;
        transform: translateY(-50%);
    }
    .info-chip {
        left: 5%; top: 73.6%;
        transform: translateY(-50%);
        padding: 0.4cqw 1.6cqw;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #e4e4e4;
        font-size: 1.9cqw;
        font-weight: 500;
    }
    .info-level {
        left: 19.55%; top: 73.6%;
        transform: translateY(-50%);
    }
    .info-play {
        left: 37.5%; top: 73.6%;
        transform: translateY(-50%);
        display: flex;
    }
    .info-play-label {
        left: 46%; top: 73.6%;
        transform: translateY(-50%);
        font-size: 2.27cqw;
    }
    .info-n-label {
        left: 71%; top: 66%;
        transform: translateY(-50%);
        font-size: 1.818cqw;
        color: #828282;
    }
    .info-n {
        left: 71%; top: 81%;
        transform: translateY(-50%);
        white-space: nowrap;
    }
    .info-n b {
        font-size: 4.318cqw;
        font-weight: 500;
    }
    .info-n small {
        font-size: 2.05cqw;
        color: #828282;
    }

    /* ── the field ── */
    .field-frame {
        border: 2px solid var(--ink);
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 14px 34px rgba(13, 36, 64, 0.22);
    }
    .field-scroll {
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
    }
    .field {
        position: relative;
        height: 470px;
        background-color: #6aa64d;
        background-size: 160px 160px;
        background-repeat: repeat;
    }
    .horizon {
        position: absolute;
        left: 0; right: 0; top: 0;
        height: 250px;
        background: linear-gradient(180deg, #51c0fd 0%, #a8f0ff 48%, rgba(168, 240, 255, 0) 100%);
    }
    .road {
        position: absolute;
        left: 0; right: 0; top: 357px;
        height: 40px;
        background: #c4b58c;
        border-top: 3px solid #464e5a;
        border-bottom: 3px solid #464e5a;
    }
    .stop {
        position: absolute;
        top: 380px;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        font-family: inherit;
    }
    .plaza {
        position: absolute;
        left: -88px; top: -28px;
        width: 176px; height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px solid #464e5a;
        background-color: #7f7f83;
        background-size: 90px 90px;
    }
    .plaza span {
        position: absolute;
        inset: 5px;
        border-radius: 50%;
        border: 1.5px solid #464e5a;
        background-color: #ababb2;
        background-size: 70px 70px;
    }
    .tower {
        position: absolute;
        left: -75px;
        bottom: 4px;
        width: 150px;
        height: 191px;
    }
    .tag {
        position: absolute;
        left: -115.5px;
        bottom: 206px;
        width: 231px;
        height: 45px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        transform-origin: 50% 100%;
        transition: transform 0.15s;
    }
    .tag-level {
        position: absolute;
        left: 10px;
        top: 11px;
        display: flex;
    }
    .tag-name {
        position: absolute;
        right: 10px;
        top: 23.8px;
        transform: translateY(-50%);
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        color: #343434;
    }
    .plate {
        position: absolute;
        left: 0;
        top: 33px;
        transform: translateX(-50%);
        white-space: nowrap;
        padding: 2px 11px;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #ffffff;
        font-size: 12px;
        font-weight: 500;
        color: var(--ink);
    }
    .stop:hover .tag {
        transform: translateY(-3px);
    }
    .stop.on .tag {
        transform: scale(1.1);
    }
    .stop.on .plate {
        background: var(--sun);
    }
    .stop:focus-visible .plate {
        outline: 3px solid var(--sky-1);
        outline-offset: 2px;
    }
</style>
