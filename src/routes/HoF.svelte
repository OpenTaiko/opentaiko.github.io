<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { _, locale } from 'svelte-i18n';
    import { pickTitle, pickSubtitle } from "../lib/localize.js";
    import SongBar from "../components/SongBar.svelte";
    import { genreToCSS } from "../lib/genres.js";
    import { fetchSoundtrack } from "../lib/soundtrack.js";
    import { loadHof, hofRows, songsByIdOf } from "../lib/hof.js";
    import { STATUS_STRIPE } from "../lib/skin.js";

    let Fetching = true;
    let rows = [];
    let playCount = 0;

    const legend = ['Clear', 'Full Combo', 'Perfect'];

    onMount(async () => {
        const [songs, hof] = await Promise.all([fetchSoundtrack(), loadHof()]);
        rows = hofRows(hof, songsByIdOf(songs));
        playCount = hof.scores.length;
        Fetching = false;
    });

    // the bar shows only the ranked course
    const coursesOf = (r) => [0, 1, 2, 3, 4, 5, 6].map(i => (i === r.course && r.level >= 0) ? r.level : -1);
</script>

<h1 class="sky-title">{$_('hof.title')}</h1>
{#if !Fetching}
    <p class="sky-sub">{$_('hof.subtitle', { values: { charts: rows.length, plays: playCount } })}</p>
{/if}

<div class="page-wrap hof">
    <div class="top">
        <!-- the stripe on each bar: the best status anyone has on that chart -->
        <div class="legend">
            {#each legend as st}
                <span class="key"><span class="key-stripe" style="background:{STATUS_STRIPE[st]}"></span>{$_(`status.${st.toLowerCase().replace(/ /g, '_')}`)}</span>
            {/each}
        </div>
        <Link to="/leaderboards" class="sun-button">{$_('leaderboards.title')}</Link>
    </div>

    {#if Fetching}
        <p class="loading-note">{$_('common.loading')}</p>
    {:else}
        {#each rows as r (r.uid + ':' + r.course)}
            <SongBar
                Rank={r.rank}
                Title={r.song ? pickTitle(r.song, '', $locale) : $_('common.not_found')}
                Subtitle={r.song ? pickSubtitle(r.song, '', $locale) : ''}
                Difficulties={coursesOf(r)}
                AudioFilePath={r.song?.chartAudioFilePath ?? ''}
                Genre={r.song ? genreToCSS(r.song.tjaGenreFolder) : 'hq'}
                MaxListPoints={r.maxLp}
                UniqueId={r.uid}
                BestStatus={r.best}
                Plays={r.plays}
            />
        {/each}
    {/if}
</div>

<style>
    .hof {
        max-width: 980px;
    }
    .top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 4px 0 14px;
    }
    .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .key {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 4px 12px 4px 5px;
        border-radius: 999px;
        background: #ffffff;
        border: 2px solid var(--ink);
        font-size: 12px;
        font-weight: 500;
    }
    .key-stripe {
        width: 8px;
        height: 18px;
        border-radius: 4px;
        border: 1.5px solid var(--ink);
    }
</style>
