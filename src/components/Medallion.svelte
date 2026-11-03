<script>
    /**
     * A course's level in its difficulty emblem, drawn as the song select's song info draws it
     * (song_select_core draw_songselect.lua, drawInfoLevel):
     *   - the emblem is sinfo_difficulties_N.png (120 × 100); a missing course shows
     *     sinfo_difficulties_missing.png, the grey disc, as the game does;
     *   - the level is in the SinfoLevel digits, centred on the emblem's centre, each digit after the
     *     first starting half the previous digit's width later (drawNumberCentered);
     *   - a plus level's "+" (SinfoLevel/plus.png) is centred 8 px left of the number's right edge and
     *     14 px above its middle (layout.json song_info plus_dx / plus_dy).
     * Everything is laid out in the art's own pixels and scaled as one, so it stays exact at any size.
     *
     * Tower (5) and Dan (6) have no emblem in the skin: they get a disc in the same frame, in the
     * Tower category's box.def colour or the Dan colour, with the course name under the number
     * as the medallions carry theirs.
     */
    import { medallion, COURSE_NAMES, IMG } from "../lib/skin.js";

    export let course = 0;      // 0 Easy … 4 Edit, 5 Tower, 6 Dan
    export let level = -1;
    export let size = 58;       // displayed width in px
    export let towerCat = 'sweet';

    const W = 120, H = 100;
    const DIGIT_W = [36, 27, 34, 34, 35, 35, 36, 35, 36, 36];   // SinfoLevel/N.png widths; all 51 tall
    const DIGIT_H = 51, PLUS = 20, PLUS_DX = -8, PLUS_DY = -14;

    const SPECIAL = {
        sweet: { ring: '#f6ff00', disc: '#b3a400', name: 'Tower' },
        spicy: { ring: '#ff8a3d', disc: '#c44200', name: 'Tower' },
        challenge: { ring: '#dcdcdc', disc: '#7d7d7d', name: 'Tower' },
        dan: { ring: '#7f95e0', disc: '#3b55a5', name: 'Dan' },
    };

    $: missing = level === undefined || level === null || level < 0;
    $: special = course >= 5 ? SPECIAL[course === 6 ? 'dan' : (SPECIAL[towerCat] ? towerCat : 'sweet')] : null;
    $: whole = missing ? 0 : Math.floor(level);
    $: plus = !missing && (level % 1) >= 0.5;
    $: digits = String(whole).split('').map(Number);
    // drawNumberCentered: cursor advances half of the previous digit's width
    $: placed = (() => {
        let x = 0;
        return digits.map((d, i) => {
            if (i > 0) x += DIGIT_W[digits[i - 1]] * 0.5;
            return { d, x };
        });
    })();
    $: total = placed.length ? placed[placed.length - 1].x + DIGIT_W[digits[digits.length - 1]] : 0;
    $: left0 = W / 2 - total / 2;
    $: name = course >= 5 ? special.name : COURSE_NAMES[course];
    $: label = missing ? '' : `${name} ${whole}${plus ? '+' : ''}`;
</script>

<div class="medallion" style="width:{size}px; height:{size * H / W}px" title={label} role="img" aria-label={label}>
    <div class="art" style="transform:scale({size / W})">
        {#if special}
            <span class="disc" class:missing style="--ring:{special.ring}; --disc:{special.disc}">
                <span class="disc-name">{special.name}</span>
            </span>
        {:else}
            <img class="emblem" src={missing ? `${IMG}/medallion/missing.png` : medallion(course)} alt="" />
        {/if}
        {#if !missing}
            {#each placed as p}
                <img class="digit" src="{IMG}/sinfo-level/{p.d}.png" alt=""
                     style="left:{left0 + p.x}px; top:{H / 2 - DIGIT_H / 2}px; width:{DIGIT_W[p.d]}px" />
            {/each}
            {#if plus}
                <img class="digit" src="{IMG}/sinfo-level/plus.png" alt=""
                     style="left:{W / 2 + total / 2 + PLUS_DX - PLUS / 2}px; top:{H / 2 + PLUS_DY - PLUS / 2}px; width:{PLUS}px" />
            {/if}
        {/if}
    </div>
</div>

<style>
    .medallion {
        position: relative;
        flex: none;
    }
    .art {
        position: absolute;
        left: 0;
        top: 0;
        width: 120px;
        height: 100px;
        transform-origin: 0 0;
    }
    .emblem {
        position: absolute;
        left: 0;
        top: 0;
        width: 120px;
        height: 100px;
    }
    .digit {
        position: absolute;
        height: auto;
    }
    /* Tower / Dan: a ring in the colour over a darker disc, the name in small letterspaced caps */
    .disc {
        position: absolute;
        left: 13px;
        top: 3px;
        width: 94px;
        height: 94px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 8px solid var(--ring);
        background: var(--disc);
        box-shadow: 0 0 0 2px #0d2440;
    }
    .disc.missing {
        filter: grayscale(1);
        opacity: 0.5;
    }
    .disc-name {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 9px;
        text-align: center;
        font-size: 9px;
        letter-spacing: 0.18em;
        color: #ffffff;
    }
</style>
