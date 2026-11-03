<script>
    import { _ } from 'svelte-i18n';
    import ScoresTable from "../components/ScoresTable.svelte";
    import { computeMaxListPoints as ComputeMaxListPoints } from "../lib/listPoints.js";

    export let SongCard;
    export let Difficulty;
</script>

<div class="facts">
    {#if SongCard.Charters[Difficulty]}
        <span class="fact">{$_('songinfo.charter', { values: { name: SongCard.Charters[Difficulty] } })}</span>
    {/if}
    <!-- Tower (5) has no Hall of Fame / leaderboards for now — charter only. -->
    {#if Difficulty !== 5}
        {#if SongCard.Rank[Difficulty] >= 0}
            <span class="fact">{$_('songinfo.hof_rank', { values: { rank: SongCard.Rank[Difficulty] } })}</span>
            <span class="fact">{$_('songinfo.max_list_points', { values: { points: ComputeMaxListPoints(SongCard.Rank[Difficulty]) } })}</span>
        {:else}
            <span class="fact">{$_('songinfo.hof_unranked')}</span>
        {/if}
    {/if}
</div>

{#if Difficulty !== 5}
    <ScoresTable SongCard={SongCard} Difficulty={Difficulty} />
{/if}

<style>
    .facts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 14px;
    }
    .fact {
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--paper-soft);
        border: 2px solid var(--line);
        font-size: 13px;
        font-weight: 500;
    }
</style>
