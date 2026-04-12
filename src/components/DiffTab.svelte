<script>
    import { _ } from 'svelte-i18n';
    import ScoresTable from "../components/ScoresTable.svelte";

    export let SongCard;
    export let Difficulty;

    const ComputeMaxListPoints = (rank) => {
        if (SongCard.Rank[Difficulty] < 0) return 0;

        let base = 1000;
        let decreaseRatio = 0.95;
        return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    }
</script>

<div>
    {$_('songinfo.charter', { values: { name: SongCard.Charters[Difficulty] } })}
</div>

{#if SongCard.Rank[Difficulty] >= 0}
    <div>
        {$_('songinfo.hof_rank', { values: { rank: SongCard.Rank[Difficulty] } })}
    </div>
    <div>
        {$_('songinfo.max_list_points', { values: { points: ComputeMaxListPoints(SongCard.Rank[Difficulty]) } })}
    </div>
    <ScoresTable
        SongCard={SongCard}
        Difficulty={Difficulty}
    />
{:else}
    <div>
        {$_('songinfo.hof_unranked')}
    </div>
    <ScoresTable
        SongCard={SongCard}
        Difficulty={Difficulty}
    />
{/if}

<style>

</style>
