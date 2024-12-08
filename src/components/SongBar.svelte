<script>
    export let Title;
    export let Subtitle;
    export let Difficulties = [-1, -1, -1, -1, -1, -1, -1];
    export let AudioFilePath;
    export let Genre;

    const DifficultyNames = ["Easy", "Normal", "Hard", "Extreme", "Extra", "Tower", "Dan"];

    const IsDecimalAtLeastHalf = (num) => (num % 1) >= 0.5;
    const HandleDecimalDiff = (diff) => {
        if (diff < 10) return Math.floor(diff);
        return Math.floor(diff) + (IsDecimalAtLeastHalf(diff) ? "+" : "");
    };

    $: DiffString = Difficulties.map((v, i) => v !== -1 ? `${DifficultyNames[i]}: ${HandleDecimalDiff(v)}` : "").filter(Boolean).join(" / ");
    $: AudioLink = `https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/${AudioFilePath}`

</script>

<div class="{Genre} song_bar">
    <h3>{Title}</h3>
    <h4>{Subtitle}</h4>
    <span>{DiffString}</span>
    <div><audio controls preload='none'><source src={AudioLink}></audio></div>
</div>

<style>
    .ch1 {
        border: 2px solid #994314;
        background-color: #f76b20;
        color: white;
    }
    .ch2 {
        border: 2px solid #282c75;
        background-color: #474ed6;
        color: white;
    }
    .ch3 {
        border: 2px solid #2c9684;
        background-color: #48f7da;
        color: black;
    }
    .ch4 {
        border: 2px solid #85912a;
        background-color: #e5f748;
        color: black;
    }
    .deceiver {
        border: 2px solid #2e0404;
        background-color: #700b0b;
        color: white;
    }
    .dashy {
        border: 2px solid #888888;
        background-color: #ffffff;
        color: black;
    }
    .rainy {
        border: 2px solid #030f01;
        background-color: #092d02;
        color: white;
    }
    .hq {
        border: 2px solid #696969;
        background-color: #999999;
        color: black;
    }

    .song_bar {
        margin: 8px;
        padding: 1px 8px;
        border-radius: 4px;
    }
    .song_bar h3, .song_bar h4 {
        margin: 4px 0px;
    }
</style>