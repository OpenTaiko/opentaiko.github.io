<script>
    import { onMount } from "svelte";
    import { _ } from 'svelte-i18n';
    import { statusKey } from '../i18n/index.js';
    export let SongCard;
    export let Difficulty;
    import initSqlJs from "sql.js";

    let db;
    let rows = [];

    const loadDatabase = async () => {
        const sqlPromise = await initSqlJs({
            locateFile: file => `/sql-wasm.wasm`
        });

        const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const db = new SQL.Database(new Uint8Array(buf));
        const result = db.exec(`SELECT * FROM scores WHERE entryId='${SongCard.UniqueId}' AND difficulty=${Difficulty}`);

        rows = result[0] ? result[0].values : [];
    };

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
        if (rank < 0) return 0;
        let base = 1000;
        let decreaseRatio = 0.95;
        return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    }

    const ScoreToListPointsRatio = (score, badRatio) => {
        let _ratio = 1;
        _ratio *= Math.pow(score.Accuracy, 6);
        _ratio *= Math.pow(1 - badRatio, 18);
        switch (score.Status) {
            case "Perfect":    break;
            case "Full Combo": _ratio *= 0.9; break;
            case "Clear":      _ratio *= 0.7; break;
            case "Failed":
            default:           _ratio = 0; break;
        }
        return _ratio;
    }

    const FetchBestScores = async () => {
        BestScores = [];

        let _sample = {};

        rows.forEach((score) => {
            _sample = {
                Player: score[3],
                Status: score[4],
                Score: score[5],
                Grade: score[6],
                Good: score[7],
                Ok: score[8],
                Bad: score[9],
                Video: score[10],
                Image: score[11],
            }

            _sample.Accuracy = (_sample.Good + _sample.Ok * 0.5) / (_sample.Good + _sample.Ok + _sample.Bad);
            const _br = _sample.Bad / (_sample.Good + _sample.Ok + _sample.Bad);
            _sample.LP = parseInt(ScoreToListPointsRatio(_sample, _br) * ComputeMaxListPoints(SongCard.Rank[Difficulty]));
            _sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);

            BestScores.push(_sample);
        })

        BestScores.sort((a, b) => b.LP !== a.LP ? b.LP - a.LP : b.Score - a.Score);

        if (rows.length === 0) {
            _sample = {
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
            const _br = _sample.Bad / (_sample.Good + _sample.Ok + _sample.Bad);
            _sample.LP = parseInt(ScoreToListPointsRatio(_sample, _br) * ComputeMaxListPoints(SongCard.Rank[Difficulty]));
            _sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);

            BestScores.push(_sample);
        }
    }

    onMount(async () => {
        await loadDatabase();
        await FetchBestScores();
    });

    const OpenSubmitForm = (e) => {
        const _url = `https://docs.google.com/forms/d/e/1FAIpQLSc-35dkvrUNdzBaoVP5JoGwpruiaypqU6IV2LV28ORlP7Bong/viewform?usp=pp_url&entry.618863437=${SongCard.Title}&entry.1494222525=${SongCard.UniqueId}&entry.1320089911=${Difficulty}`;
        window.open(_url, '_blank');
    }
</script>


<button on:click={OpenSubmitForm}>
    {$_('scores.submit')}
</button>

<table id="scores">
    <tr>
        <th>#</th>
        <th>{$_('table.player')}</th>
        <th>{$_('table.status')}</th>
        <th>{$_('table.score')}</th>
        <th>{$_('table.grade')}</th>
        <th>{$_('table.good')}</th>
        <th>{$_('table.ok')}</th>
        <th>{$_('table.bad')}</th>
        <th>{$_('table.accuracy')}</th>
        {#if SongCard.Rank[Difficulty] >= 0}
            <th>{$_('table.list_points')}</th>
        {/if}
        <th>{$_('table.video')}</th>
    </tr>
    {#each BestScores as BestScore, idx}
        <tr>
            <td class={idx < 3 ? `top${idx + 1}` : ''}>#{idx + 1}</td>
            <td>{BestScore.Player}</td>
            <td class="status{BestScore.Status.replace(/\s/g, "")}">{$_(statusKey(BestScore.Status))}</td>
            {#if BestScore.Image !== ""}
                <td
                    on:mouseenter={() => showPreview(BestScore.Image)}
                    on:mouseleave={hidePreview}
                    on:mousemove={movePreview}
                >{BestScore.Score}</td>
            {:else}
                <td>{BestScore.Score}</td>
            {/if}
            <td class="grade{BestScore.Grade}">{BestScore.Grade}</td>
            <td>{BestScore.Good}</td>
            <td>{BestScore.Ok}</td>
            <td>{BestScore.Bad}</td>
            <td>{BestScore.Accuracy}</td>
            {#if SongCard.Rank[Difficulty] >= 0}
                <td>{BestScore.LP}</td>
            {/if}
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

<img bind:this={previewImg} class="preview-image" alt="" />

<style>
    #scores { border-collapse: collapse; width: 100%; text-align: center; }
    #scores td, #scores th { border: 1px solid #ddd; padding: 8px; }
    #scores tr:nth-child(even) { background-color: #f2f2f2; }
    #scores tr:nth-child(odd)  { background-color: rgb(236,236,236); }
    #scores tr:hover { background-color: #ddd; }
    #scores th { padding-top: 12px; padding-bottom: 12px; background-color: #6455e6; color: white; white-space: nowrap; }

    .preview-image {
        position: absolute;
        pointer-events: none;
        display: none;
        z-index: 1000;
        max-width: 200px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
</style>
