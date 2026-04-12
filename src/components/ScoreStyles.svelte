<!--
    Shared score/grade/rank visual styles.
    Mounted once in App.svelte — edit here to affect all tables site-wide.
-->
<style>
    /* ── Keyframes ─────────────────────────────────────────────────────────── */
    @keyframes -global-rainbow {
        0%   { background-position:   0% center; }
        100% { background-position: 300% center; }
    }
    @keyframes -global-shimmer-gold {
        0%   { background-position:   0% center; }
        100% { background-position: 200% center; }
    }
    @keyframes -global-shimmer-silver {
        0%   { background-position:   0% center; }
        100% { background-position: 200% center; }
    }
    @keyframes -global-shimmer-bronze {
        0%   { background-position:   0% center; }
        100% { background-position: 200% center; }
    }
    @keyframes -global-shimmer-blue {
        0%   { background-position:   0% center; }
        100% { background-position: 200% center; }
    }

    /* ── Leaderboard rank 1 / 2 / 3 ───────────────────────────────────────── */
    :global(td.top1) { background: linear-gradient(90deg, #ffd700, #ffe066, #ffd700); background-size: 200% auto; animation: shimmer-gold   2s linear infinite; font-weight: bold; }
    :global(td.top2) { background: linear-gradient(90deg, #b0b0b0, #d8d8d8, #b0b0b0); background-size: 200% auto; animation: shimmer-silver 2s linear infinite; font-weight: bold; }
    :global(td.top3) { background: linear-gradient(90deg, #b87333, #d4956a, #b87333); background-size: 200% auto; animation: shimmer-bronze 2s linear infinite; font-weight: bold; }

    /* ── Grade (rank letter) cells ─────────────────────────────────────────── */
    :global(td.gradeΩ) { background: linear-gradient(90deg, #1a237e, #3949ab, #5c6bc0, #3949ab, #1a237e); background-size: 200% auto; animation: shimmer-blue 2s linear infinite; color: white; }
    :global(td.gradeS) { background: linear-gradient(90deg, #56ccf2, #4a95f7, #56ccf2); background-size: 200% auto; animation: shimmer-blue 2s linear infinite; }
    :global(td.gradeA) { background-color: #b5f8e0; }
    :global(td.gradeB) { background-color: #f9ffc2; }
    :global(td.gradeC) { background-color: #ffe5c3; }
    :global(td.gradeD) { background-color: #fcc2c2; }

    /* ── Play status cells ─────────────────────────────────────────────────── */
    :global(td.statusPerfect)   { background: linear-gradient(90deg, #ffd0d6, #ffe2ad, #ffffb8, #b3ffb3, #c2e0ff, #dbc2ff, #ffd0d6); background-size: 300% auto; animation: rainbow 3s linear infinite; white-space: nowrap; font-weight: bold; }
    :global(td.statusFullCombo) { background: linear-gradient(90deg, #ffd700, #fffacd, #ffd700); background-size: 200% auto; animation: shimmer-gold 2s linear infinite; white-space: nowrap; font-weight: bold; }
    :global(td.statusClear)     { background-color: #fcc2c2; white-space: nowrap; }
    :global(td.statusFailed)    { background-color: #c2e0fc; white-space: nowrap; }

    /* ── Difficulty badge cells ────────────────────────────────────────────── */
    :global(td.difficultyEXEX) { background-color: #e2c2fc; }
    :global(td.difficultyEX)   { background-color: #fcc2c2; }
</style>
