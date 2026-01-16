<script>
    import CoolNumber from "../components/CoolNumber.svelte";

    export let Difficulty = -1;
    export let Level;

    const DifficultyColors = ["aqua", "lime", "orange", "red", "violet", "#FF8C00", "#00008B"];
</script>

<div class="difficulty_block">
    <img src="/image/difficulty/{Difficulty}.png" alt="{Difficulty}" />
    <CoolNumber
        number={Level}
        color={DifficultyColors[Difficulty]}
    />

</div>

<style>
    .difficulty_block {
        width: 60px;
        background-color: black;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        border: 2px solid rgb(26, 26, 26);
    }
</style>