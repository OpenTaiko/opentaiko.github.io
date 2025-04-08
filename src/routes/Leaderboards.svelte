<script>
    import { navigate } from 'svelte-routing';
    import { onMount } from "svelte";
    import SongBar from "../components/SongBar.svelte";
    import TabArea from "../components/TabArea.svelte";
    import DiffTab from "../components/DiffTab.svelte";
    import initSqlJs from "sql.js";

    export let UniqueId;

    let db;
    let rows = [];

    let entries = [];
    let scores = [];

    const loadDatabase = async () => {
        const sqlPromise = await initSqlJs({
            locateFile: file => `/sql-wasm.wasm`
        });

        const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const db = new SQL.Database(new Uint8Array(buf));

        const result_e = db.exec("SELECT * FROM entries ORDER BY internalDifficultyIndex DESC");
        entries = result_e[0] ? result_e[0].values : [];

        const result_s = db.exec(`SELECT * FROM scores`);
        scores = result_s[0] ? result_s[0].values : [];
    };

    let Fetching = false;
    let SongsInfo = {};
    $: SongDict = {};
    $: BestScores = [];
    $: TopPlayers = [];

    const GetSongByUniqueId = (uid) => {return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null}

    const FetchSongs = async () => {
        Fetching = true;

        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"));
        let text = (await songs_text.text()).valueOf();
        SongsInfo = JSON.parse(text);

        Fetching = false;
    }

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

    const GetSongInfo = () => {
        SongDict = {};


        entries.forEach((row, idx) => {
            const uid = row[1];
            const difficulty = row[2];
            const rank = idx + 1;

            const song = GetSongByUniqueId(uid);

            let SInfo = {};

            if (song !== null) {
                const _arr = ["Easy","Normal","Hard","Oni","Edit","",""];

                SInfo = {
                    Rank: rank,
                    UniqueId: row[1],
                    Title: song["chartTitle"],
                    Subtitle: song["chartSubtitle"],
                    Level: song["chartDifficulties"]?.[_arr[difficulty]] ?? -1,
                    MaxListPoints: ComputeMaxListPoints(rank),
                };
            }
            else {
                SInfo = {
                    Rank: rank,
                    UniqueId: row[1],
                    Title: `#${idx+1}. Not Found`,
                    Subtitle: "",
                    Level: -1,
                    MaxListPoints: ComputeMaxListPoints(rank),
                };
            }

            if (SongDict[uid] === undefined) SongDict[uid] = {};
            SongDict[uid][difficulty] = SInfo;
        });

        console.log(SongDict);
    }

    const ProcessBestScores = () => {
        BestScores = [];

        scores.forEach((score) => {
            const _songInfo = SongDict?.[score[1]]?.[score[2]] ?? {};

            let _sample = {
                Rank: _songInfo?.Rank ?? -1,
                SongTitle: _songInfo?.Title ?? "[Not Found]",
                SongUid: _songInfo?.UniqueId ?? "[Not Found]",
                SongLevel: _songInfo?.Level ?? -1,
                SongDifficulty: ["EZ","NM","HD","EX","EXEX"]?.[score[2]] ?? "EX",
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
            _sample.LP = parseInt(ScoreToListPointsRatio(_sample) * ComputeMaxListPoints(_sample.Rank));
            _sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);

            BestScores.push(_sample);
        });

        BestScores.sort((a, b) => b.LP - a.LP);

        console.log(BestScores);
    }

    const ProcessTopPlayers = () => {
        TopPlayers = [];

        let _tmpDict = {};

        BestScores.forEach((score) => {
            if (_tmpDict[score.Player] === undefined) {
                _tmpDict[score.Player] = {
                    Player: score.Player,
                    LP: score.LP
                };
            }
            else {
                _tmpDict[score.Player].LP += score.LP;
            }

        })

        TopPlayers = Object.values(_tmpDict).sort((a, b) => b.LP - a.LP);
        console.log(TopPlayers);
    }

    onMount(async () => {
        await FetchSongs();
        await loadDatabase();

        GetSongInfo();
        ProcessBestScores();
        ProcessTopPlayers();
    });

    $: SongDetailsUrl = (UniqueId) => `/songinfo/${UniqueId}`;

    const MoveToSongInfo = (e, uid) => {
        if (uid === undefined) return;
        window.open(SongDetailsUrl(uid), '_blank');
    }


</script>

<div class="bg_optk"></div>

<h1 style="color:white;">Leaderboards</h1>

<h2 style="color:white;">Top Players</h2>

<div id="top_players">
    <table id="scores">
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>List Points</th>
        </tr>
        {#each TopPlayers as TopPlayer, idx}
            <tr>
                <td style="font-weight:bold" class="top{idx+1}">#{idx+1}</td>
                <td>{TopPlayer.Player}</td>
                <td>{TopPlayer.LP}</td>
            </tr>
        {/each}
    </table>

</div>

<h2 style="color:white;">Best Scores</h2>

<div id="songs">
    {#if Fetching === true}
        <h1 style="text-align: center; color:white;">Fetching Songs... Please wait.</h1>
        <img src="image/loading.gif" alt="Loading" style="display:block; margin-left:auto; margin-right:auto;">
    {:else}
        <table id="scores">
            <tr>
                <th>Song</th>
                <th>Difficulty</th>
                <th>Level</th>
                <th>Player</th>
                <th>Status</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Accuracy</th>
                <th>List Points</th>
                <th>Video</th>
            </tr>
            {#each BestScores as BestScore}
                <tr>
                    <td class="pointer" on:click={(e) => MoveToSongInfo(e, BestScore.SongUid)} title={SongDetailsUrl(BestScore.SongUid)}>{BestScore.SongTitle}</td>
                    <td class="difficulty{BestScore.SongDifficulty}">{BestScore.SongDifficulty}</td>
                    <td>★{Math.floor(BestScore.SongLevel)}{BestScore.SongLevel % 1 >= 0.5 ? '+' : ''}</td>
                    <td>{BestScore.Player}</td>
                    <td class="status{BestScore.Status.replace(/\s/g, "")}">{BestScore.Status}</td>
                    <td title="{BestScore.Good}/{BestScore.Ok}/{BestScore.Bad}" class="pointer">{BestScore.Score}</td>
                    <td class="grade{BestScore.Grade}">{BestScore.Grade}</td>
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
    {/if}
</div>


<style>
    @keyframes slide {
        from {
            background-position-x: 0px;
        }
        to {
            background-position-x: -1920px;
        }
    }

    .bg_optk {
        float: right;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: -64px;
        z-index: -1;
        background-color: rgb(150, 150, 150);
        background-image: url("/image/bg_songs.png");
        background-blend-mode: multiply;
        background-size: cover;
        background-repeat: repeat-x;
        background-attachment: fixed;
        animation: slide 90s linear infinite;
    }

    #songs, #top_players {
        text-align: left;
        margin: auto;
        padding: 0px 100px;
        padding-bottom: 64px;
        max-width: 900px;
    }

    .buttons {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        vertical-align: middle;
        margin: 0px auto;
        padding: 0px auto;
    }

    td.top1 {
        background-color: #faf3b7;
    }

    td.top2 {
        background-color: #e9e9e9;
    }

    td.top3 {
        background-color: #e4cfb1;
    }

    td.difficultyEXEX {
        background-color: #e2c2fc;
    }

    td.difficultyEX {
        background-color: #fcc2c2;
    }

    td.gradeΩ {
        background-color: #c1b7fa;
    }

    td.gradeS {
        background-color: #cbf9ff;
    }

    td.gradeA {
        background-color: #b5f8e0;
    }

    td.gradeB {
        background-color: #f9ffc2;
    }

    td.gradeC {
        background-color: #ffe5c3;
    }

    td.gradeD {
        background-color: #fcc2c2;
    }

    td.statusPerfect {
        background-color: #dbc2fc;
    }

    td.statusFullCombo {
        background-color: #fff4b4;
    }

    td.statusClear {
        background-color: #fcc2c2;
    }

    td.statusFailed {
        background-color: #c2e0fc;
    }

    td.pointer {
        cursor: pointer;
    }

    #scores {
        border-collapse: collapse;
        width: 100%;
        text-align: center;
    }

    #scores td, #scores th {
        border: 1px solid #ddd;
        padding: 8px;
    }

    #scores tr:nth-child(even){background-color: #f2f2f2;}
    #scores tr:nth-child(odd){background-color: rgb(236, 236, 236)}

    #scores tr:hover {background-color: #ddd;}

    #scores th {
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: #6455e6;
        color: white;
    }

</style>