/**
 * Single source of truth for all genre/folder metadata.
 *
 * To add a new genre:
 *   1. Add an entry here.
 *   2. Add a matching bar image at /image/genreBar/<css>.png.
 *   3. That's it — Songlist buttons, SongBar styling, Artistinfo chips, and
 *      genre→CSS lookups all derive from this file.
 *
 * Fields:
 *   folder      – exact tjaGenreFolder string from soundtrack_info.json
 *   css         – CSS class / identifier used throughout the UI
 *   label       – short display label (chips, artist page song list)
 *   btnLabel    – label on the Songlist filter button (falls back to label)
 *   bg          – chip background colour
 *   text        – chip/button text colour
 *   btnPrimary  – lighter top colour for the Songlist gradient button
 *   accent      – SongBar accent colour (left border stripe, card border, --gc)
 *   overlay     – SongBar background overlay colour (rgba, 0.75 opacity / 80 % sat.)
 *   inSonglist  – whether a filter button is shown in the Songlist
 */
export const GENRES = [
    {
        folder:      '01 OpenTaiko Chapter I',
        css:         'ch1',
        label:       'Chapter I',
        btnLabel:    'OpenTaiko Chapter I',
        bg:          '#f76b20',
        text:        'black',
        btnPrimary:  '#ff8f53',
        accent:      '#f76b20',
        overlay:     'rgba(223,111,51,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '02 OpenTaiko Chapter II',
        css:         'ch2',
        label:       'Chapter II',
        btnLabel:    'OpenTaiko Chapter II',
        bg:          '#474ed6',
        text:        'white',
        btnPrimary:  '#575fff',
        accent:      '#575fff',
        overlay:     'rgba(99,105,233,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '03 OpenTaiko Chapter III',
        css:         'ch3',
        label:       'Chapter III',
        btnLabel:    'OpenTaiko Chapter III',
        bg:          '#48f7da',
        text:        'black',
        btnPrimary:  '#6effe7',
        accent:      '#48f7da',
        overlay:     'rgba(93,233,210,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '04 OpenTaiko Chapter IV',
        css:         'ch4',
        label:       'Chapter IV',
        btnLabel:    'OpenTaiko Chapter IV',
        bg:          '#ccd93a',
        text:        'black',
        btnPrimary:  '#f3ff87',
        accent:      '#ccd93a',
        overlay:     'rgba(195,206,78,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '05 OpenTaiko Chapter V',
        css:         'ch5',
        label:       'Chapter V',
        btnLabel:    'OpenTaiko Chapter V',
        bg:          '#f74848',
        text:        'black',
        btnPrimary:  '#ff87ab',
        accent:      '#f74848',
        overlay:     'rgba(224,84,84,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '06 OpenTaiko Chapter VI',
        css:         'ch6',
        label:       'Chapter VI',
        btnLabel:    'OpenTaiko Chapter VI',
        bg:          '#47c1f5',
        text:        'black',
        btnPrimary:  '#a6daff',
        accent:      '#47c1f5',
        overlay:     'rgba(91,188,230,0.75)',
        inSonglist:  true,
    },
    {
        folder:      '07 OpenTaiko Chapter VII',
        css:         'ch7',
        label:       'Chapter VII',
        btnLabel:    'OpenTaiko Chapter VII',
        bg:          '#47f57b',
        text:        'black',
        btnPrimary:  '#a6ffb9',
        accent:      '#47f57b',
        overlay:     'rgba(86,225,128,0.75)',
        inSonglist:  true,
    },
    {
        folder:      "C10 Deceiver's Defiances",
        css:         'deceiver',
        label:       "Deceiver's Defiances",
        bg:          '#700b0b',
        text:        'white',
        btnPrimary:  '#700b0b',
        accent:      '#c01212',
        overlay:     'rgba(169,30,30,0.75)',
        inSonglist:  true,
    },
    {
        // The folder on disk is still "C12 Dashy's Secrets";
        // we display it as "Dashy's Depictions" everywhere.
        folder:      "C12 Dashy's Secrets",
        css:         'dashy',
        label:       "Dashy's Depictions",
        bg:          '#aaaaaa',
        text:        'black',
        btnPrimary:  '#ffffff',
        accent:      '#cccccc',
        overlay:     'rgba(204,204,204,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'E01 Rainy Memories',
        css:         'rainy',
        label:       'Rainy Memories',
        bg:          '#092d02',
        text:        'white',
        btnPrimary:  '#0c3803',
        accent:      '#1a5c0a',
        overlay:     'rgba(29,82,17,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'E02 OpenTaiko Headquarters',
        css:         'hq',
        label:       'OPTK-HQ',
        btnLabel:    'OpenTaiko Headquarters',
        bg:          '#777777',
        text:        'black',
        btnPrimary:  '#cccccc',
        accent:      '#aaaaaa',
        overlay:     'rgba(170,170,170,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'E03 Classical Arrangements',
        css:         'classical',
        label:       'Classical',
        btnLabel:    'Classical Arrangements',
        bg:          '#b8970a',
        text:        'black',
        btnPrimary:  'gold',
        accent:      'gold',
        overlay:     'rgba(235,203,31,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C01 Project Outfox Serenity',
        css:         'outfox',
        label:       'Project Outfox',
        btnLabel:    'Project Outfox Serenity',
        bg:          '#040a85',
        text:        'white',
        btnPrimary:  '#040a85',
        accent:      '#1a2cc4',
        overlay:     'rgba(39,53,175,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C02 Touhou Arrangements',
        css:         'touhou',
        label:       'Touhou Arr. Vol.1',
        btnLabel:    'Touhou Arrangements Vol.1',
        bg:          '#6028aa',
        text:        'white',
        btnPrimary:  '#6028aa',
        accent:      '#7e3dcc',
        overlay:     'rgba(127,75,189,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C03 OpenTaiko Karting',
        css:         'kart',
        label:       'OpenTaiko Karting',
        btnLabel:    'OpenTaiko Karting',
        bg:          'pink',
        text:        'black',
        btnPrimary:  'pink',
        accent:      'hotpink',
        overlay:     'rgba(240,120,180,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C04 Project Pentjet',
        css:         'pentjet',
        label:       'Project Pentjet',
        bg:          '#7a3510',
        text:        'white',
        btnPrimary:  '#994314',
        accent:      '#c45519',
        overlay:     'rgba(177,88,40,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C05 Touhou Arrangements Vol.2',
        css:         'touhou2',
        label:       'Touhou Arr. Vol.2',
        btnLabel:    'Touhou Arrangements Vol.2',
        bg:          '#aa2844',
        text:        'white',
        btnPrimary:  'rgb(236, 0, 32)',
        accent:      '#ec0020',
        overlay:     'rgba(207,18,43,0.75)',
        inSonglist:  true,
    },
    {
        folder:      'C06 OWYRSILOE Academy',
        css:         'owyrsiloe',
        label:       'OWYRSILOE Academy',
        btnLabel:    'OWYRSILOE Academy',
        bg:          '#c94b85',
        text:        'white',
        btnPrimary:  '#c94b85',
        accent:      '#e060a0',
        overlay:     'rgba(211,109,160,0.75)',
        inSonglist:  true,
    },
    // Special categories — appear in Artistinfo chips but not in Songlist filters
    {
        folder:      'S1 Dan-i Dojo',
        css:         'hq',
        label:       'Dan-i Dojo',
        bg:          '#333333',
        text:        'white',
        inSonglist:  false,
    },
    {
        folder:      'S2 Taiko Towers',
        css:         'hq',
        label:       'Taiko Towers',
        bg:          '#444444',
        text:        'white',
        inSonglist:  false,
    },
    {
        folder:      'L1 Collaborations',
        css:         'hq',
        label:       'Collaborations',
        bg:          '#555566',
        text:        'white',
        inSonglist:  false,
    },
];

// ── Fast lookup maps ────────────────────────────────────────────────────────

const _byFolder = Object.fromEntries(GENRES.map(g => [g.folder, g]));
const _fallback = { css: 'hq', bg: '#666666', text: 'white', label: '?' };

/** Returns the full genre object for a tjaGenreFolder string. */
export const genreInfo = (folder) =>
    _byFolder[folder] ?? { ..._fallback, label: folder ?? '?' };

/** Returns the SongBar CSS class name for a tjaGenreFolder string. */
export const genreToCSS = (folder) =>
    _byFolder[folder]?.css ?? 'hq';

/** Genres shown as filter buttons in the Songlist (preserves declaration order). */
export const SONGLIST_GENRES = GENRES.filter(g => g.inSonglist);
