<script>
    import CoolNumber from "../components/CoolNumber.svelte";

    export let Difficulty = -1;
    export let Level;
    export let ghost = false;
    export let roundLeft = false;

    const DifficultyColors = ["aqua", "lime", "orange", "red", "violet", "#FF8C00", "#00008B"];
    $: color = DifficultyColors[Difficulty];
</script>

<div class="difficulty_block" class:ghost class:round-left={roundLeft} style="--dc:{color}">
    {#if !ghost}
        <img src="/image/difficulty/{Difficulty}.png" alt="{Difficulty}" />
        <CoolNumber number={Level} color={color} />
    {/if}
</div>

<style>
    .difficulty_block {
        width: 60px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        overflow: hidden;
        background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--dc) 30%, #000) 0%,
            #080808 60%
        );
        border-left: 3px solid color-mix(in srgb, var(--dc) 65%, transparent);
    }

    .round-left {
        border-radius: 12px 0 0 12px;
    }

    .ghost {
        background: linear-gradient(
            160deg,
            color-mix(in srgb, var(--dc) 55%, #0a0a0a) 0%,
            color-mix(in srgb, var(--dc) 20%, #050505) 50%,
            color-mix(in srgb, var(--dc) 40%, #080808) 100%
        );
        border-left-color: color-mix(in srgb, var(--dc) 50%, transparent);
    }
</style>
