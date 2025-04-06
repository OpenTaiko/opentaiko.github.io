<script>
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
Charter: {SongCard.Charters[Difficulty]}
</div>

{#if SongCard.Rank[Difficulty] >= 0}
    <div>
        Hall of Fame: #{SongCard.Rank[Difficulty]}
    </div>
    <div>
        Max List Points: {ComputeMaxListPoints(SongCard.Rank[Difficulty])}
    </div>
    <ScoresTable
        SongCard={SongCard}
        Difficulty={Difficulty}
    />
{:else}
    <div>
        Hall of Fame: Unranked
    </div>
{/if}

<style>

</style>