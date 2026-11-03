<script>
    // A score's grade: a tile in the colours of the game's grade art, the letter outlined in a deeper shade.
    import { gradeStyle } from "../lib/skin.js";

    export let grade = 'E';
    export let size = 30;
</script>

<span
    class="grade"
    style="{gradeStyle(grade)}; width:{size}px; height:{size}px; font-size:{Math.round(size * 0.57)}px"
    title="Grade {grade}"
>{grade}</span>

<style>
    .grade {
        flex: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border-radius: 9px;
        border: 2px solid var(--ink);
        color: #ffffff;
        font-weight: 500;
        line-height: 1;
        box-shadow: 0 2px 0 rgba(13, 36, 64, 0.25);
    }
</style>
