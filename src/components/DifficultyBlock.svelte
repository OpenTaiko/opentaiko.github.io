<script>
    import CoolNumber from "../components/CoolNumber.svelte";

    export let Difficulty = -1;
    export let Level;
    export let ghost = false;
    export let roundLeft = false;

    const DifficultyColors = ["aqua", "lime", "orange", "red", "violet", "#FF8C00", "#4169E1"];
    // Dan (6) has no icon image yet — render a text badge instead.
    const DifficultyBadges = [null, null, null, null, null, null, "DAN"];
    $: color = DifficultyColors[Difficulty];
    $: badge = DifficultyBadges[Difficulty];
</script>

<div class="difficulty_block" class:ghost class:round-left={roundLeft} style="--dc:{color}">
    {#if !ghost}
        {#if badge}
            <div class="badge"><span>{badge}</span></div>
        {:else}
            <img src="/image/difficulty/{Difficulty}.png" alt="{Difficulty}" />
        {/if}
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

    /* Text stand-in for the missing 5.png/6.png icons — same square footprint. */
    .badge {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .badge span {
        font-size: 0.62em;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: white;
        text-shadow: 0 0 8px var(--dc), 0 1px 2px rgba(0,0,0,0.8);
        transform: rotate(-12deg);
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
