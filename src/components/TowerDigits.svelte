<script>
    // A tower level in the tower select's song bar digits, tinted in the category's colour.
    // Each digit but the last advances half its width, and a ".5 or more" level gets the "+",
    // as the stage's barNumber() lays them out.
    import { towerDigit } from "../lib/skin.js";

    export let value = 0;
    export let cat = 'sweet';
    export let height = 28;     // digit height in px; the art is 68 × 81

    $: w = height * 68 / 81;
    $: digits = String(Math.floor(value)).split('');
    $: plus = (value % 1) >= 0.5;
    $: label = Math.floor(value) + (plus ? '+' : '');
</script>

<span class="digits" style="height:{height}px; padding-right:{plus ? w * 0.3 : 0}px" role="img" aria-label="Level {label}">
    {#each digits as d, i}
        <img src={towerDigit(cat, d)} alt="" style="width:{w}px; height:{height}px; margin-right:{i < digits.length - 1 ? -w / 2 : 0}px" />
    {/each}
    {#if plus}
        <img class="plus" src={towerDigit(cat, 'plus')} alt="" style="width:{height * 36 / 81}px; height:{height * 36 / 81}px" />
    {/if}
</span>

<style>
    .digits {
        position: relative;
        display: inline-flex;
        flex: none;
        vertical-align: middle;
    }
    .digits img {
        display: block;
    }
    .plus {
        position: absolute;
        right: 0;
        top: -12%;
    }
</style>
