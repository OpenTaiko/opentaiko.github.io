<script>
    import { onMount } from "svelte";
    export let SongCard;
    export let Difficulty;

    let previewImg;

    const showPreview = (src) => {
        previewImg.src = src;
        previewImg.style.display = 'block';
    }

    const hidePreview = () => {
        previewImg.style.display = 'none';
    }

    const movePreview = (event) => {
        previewImg.style.left = `${event.pageX}px`;
        previewImg.style.top = `${event.pageY - 94}px`;
    }

    let BestScores = [];

    const ComputeMaxListPoints = (rank) => {
        let base = 1000;
        let decreaseRatio = 0.95;
        return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    }

    const ScoreToListPointsRatio = (score) => {
        let _ratio = 1;

        _ratio = _ratio * Math.pow(score.Accuracy, 6);

        switch (score.Status) {
            case "Full Combo":
                {
                    _ratio *= 0.9;
                    break;
                }
            case "Clear":
                {
                    _ratio *= 0.7;
                    break;
                }
            case "Failed":
            default:
                {
                    _ratio = 0;
                    break;
                }
        }

        return _ratio;
    }

    const FetchBestScores = async () => {
        BestScores = [];

        let _sample = {
            Player: "Komi is testing stuff",
            Status: "Clear",
            Score: 923000,
            Grade: "A",
            Good: 910,
            Ok: 102,
            Bad: 12,
            Video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            Image: "https://i.imgur.com/a5BmHTT.png",
        }

        _sample.Accuracy = (_sample.Good + _sample.Ok * 0.5) / (_sample.Good + _sample.Ok + _sample.Bad);
        _sample.LP = parseInt(ScoreToListPointsRatio(_sample) * ComputeMaxListPoints(SongCard.Rank[Difficulty]));
        _sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);

        BestScores.push(_sample);
    }

    onMount(async () => {
        await FetchBestScores();

        console.log(BestScores);
    });

</script>


<table id="scores">
    <tr>
        <th>Player</th>
        <th>Status</th>
        <th>Score</th>
        <th>Grade</th>
        <th>Good</th>
        <th>Ok</th>
        <th>Bad</th>
        <th>Accuracy</th>
        <th>List Points</th>
        <th>Video</th>
    </tr>
    {#each BestScores as BestScore}
        <tr>
            <td>{BestScore.Player}</td>
            <td>{BestScore.Status}</td>
            <td
                on:mouseenter={() => showPreview(BestScore.Image)}
                on:mouseleave={hidePreview}
                on:mousemove={movePreview}
            >{BestScore.Score}</td>
            <td>{BestScore.Grade}</td>
            <td>{BestScore.Good}</td>
            <td>{BestScore.Ok}</td>
            <td>{BestScore.Bad}</td>
            <td>{BestScore.Accuracy}</td>
            <td>{BestScore.LP}</td>
            <td>
                {#if BestScore.Video !== ""}
                    <a href={BestScore.Video} target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                            <path d="M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                    </a>
                {:else}
                X
                {/if}
            </td>
        </tr>
    {/each}
</table>

<img bind:this={previewImg} class="preview-image" />

<style>
    #scores {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    #scores td, #scores th {
        border: 1px solid #ddd;
        padding: 8px;
    }

    #scores tr:nth-child(even){background-color: #f2f2f2;}

    #scores tr:hover {background-color: #ddd;}

    #scores th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04AA6D;
        color: white;
    }

    .preview-image {
        position: absolute;
        pointer-events: none;
        display: none;
        z-index: 1000;
        max-width: 200px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
</style>