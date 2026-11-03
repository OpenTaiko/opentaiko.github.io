/**
 * Art and colours taken from the Open-World Memories skin (public/image/skin).
 *
 *   medallion/0-4.png   song_select_core/Textures/sinfo_difficulties_N.png
 *   overlay/<css>.jpg   song_select_core/Textures/Overlay/<genre>.png, its middle band
 *   crown/*.png         results_regular/Textures/CrownEffect.png, first frame of each badge
 *   rank/1-3.png        song_select_core/Textures/Replay/rank_gold|silver|bronze.png
 *   tower/*             tower_select (tags, digits, pills, field) and Lib/TowerArt (the Day tower)
 *   logo/*              the Hub's wordmark and the game icon
 */
import { GENRES } from './genres.js';

export const IMG = '/image/skin';

// ── Difficulty medallions ──────────────────────────────────────────────────
export const COURSE_KEYS = ['Easy', 'Normal', 'Hard', 'Oni', 'Edit'];
export const COURSE_NAMES = ['Easy', 'Normal', 'Hard', 'Extreme', 'Extreme!!'];
export const medallion = (course) => `${IMG}/medallion/${course}.png`;

/** 10.7 -> "10+", 9.2 -> "9": the level as the game prints it. */
export const fmtLevel = (v) => Math.floor(v) + ((v % 1) >= 0.5 ? '+' : '');

// ── Genre bar art ──────────────────────────────────────────────────────────
// genres.js css ids that have a song select overlay in the skin
const OVERLAYS = new Set([
    'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8',
    'classical', 'dashy', 'deceiver', 'hq', 'kart', 'outfox', 'pentjet', 'rainy', 'touhou', 'touhou2',
]);

const accentOf = (css) => GENRES.find(g => g.css === css)?.accent ?? '#cfe4f5';

/** CSS background for a song bar: the genre's overlay art, or its accent colour when it has none. */
export const barArt = (css) => OVERLAYS.has(css)
    ? `#ffffff url(${IMG}/overlay/${css}.jpg) center / cover no-repeat`
    : accentOf(css);

/** The same art across a whole row, washed toward white so a row of text stays readable. */
const WASH = 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.86) 100%)';
export const barArtWashed = (css) => OVERLAYS.has(css)
    ? `${WASH}, #ffffff url(${IMG}/overlay/${css}.jpg) center / cover no-repeat`
    : `${WASH}, ${accentOf(css)}`;

// ── Results ────────────────────────────────────────────────────────────────
export const CROWN = {
    'Clear': `${IMG}/crown/clear.png`,
    'Full Combo': `${IMG}/crown/fc.png`,
    'Perfect': `${IMG}/crown/perfect.png`,
};
export const STATUSES = ['Perfect', 'Full Combo', 'Clear'];

/** The best status anyone has on a Hall of Fame chart, as a stripe colour. */
export const STATUS_STRIPE = {
    'Perfect': 'linear-gradient(180deg, #ff4d4d, #ffc224, #58de85, #51c0fd, #9065e2)',
    'Full Combo': 'linear-gradient(180deg, #fff1a8, #ffc224 50%, #e9943b)',
    'Clear': '#fcc2c2',
};

/** The replay list's 1 / 2 / 3 numbers; null past third place. */
export const rankArt = (rank) => (rank >= 1 && rank <= 3) ? `${IMG}/rank/${rank}.png` : null;
export const RANK_TINT = ['#fff4d1', '#eef2f6', '#fbe6d4'];

/** Grade marks: colours sampled from the song select's ScoreRank art, the letter outlined in a deeper shade. */
const GRADE = {
    'E': ['linear-gradient(135deg, #ffffff, #c7dde4)', '#6f8797'],
    'D': ['linear-gradient(135deg, #ffbaac, #ff6f56)', '#b8382a'],
    'C': ['linear-gradient(135deg, #ffd765, #ffae4f)', '#c0661a'],
    'B': ['linear-gradient(135deg, #fefe68, #ffd73c)', '#b98a00'],
    'A': ['linear-gradient(135deg, #c8fead, #79f4ba)', '#1f9a6e'],
    'S': ['linear-gradient(135deg, #6ef2fd, #61a8f5 55%, #82a2ff)', '#2a4fb8'],
    'Ω': ['linear-gradient(135deg, #ff9a9a, #ffd75a 30%, #9ef0a8 55%, #7fd8ff 75%, #c39bff)', '#6b4bb8'],
};
export const GRADE_ORDER = ['Ω', 'S', 'A', 'B', 'C', 'D', 'E'];
export const gradeStyle = (letter) => {
    const [bg, ink] = GRADE[letter] ?? GRADE.E;
    const outline = ['-1.5px -1.5px', '1.5px -1.5px', '-1.5px 1.5px', '1.5px 1.5px', '0 2px']
        .map(o => `${o} 0 ${ink}`).join(', ');
    return `background:${bg}; text-shadow:${outline}`;
};

// ── Towers ─────────────────────────────────────────────────────────────────
export const TOWER_CATEGORIES = [
    { key: 'sweet', folder: '01 - Sweet', css: 'tower-sweet', pill: `${IMG}/tower/pill_sweet.png` },
    { key: 'spicy', folder: '02 - Spicy', css: 'tower-spicy', pill: `${IMG}/tower/pill_spicy.png` },
    { key: 'challenge', folder: '03 - Challenges', css: 'tower-challenge', pill: null },
];
export const towerCategoryOf = (folder) => TOWER_CATEGORIES.find(c => c.folder === folder) ?? null;
export const towerCategoryByCss = (css) => TOWER_CATEGORIES.find(c => c.css === css) ?? null;

/** Each category's box.def colour lightened halfway to white, as the tower select tints its tags and digits. */
export const TOWER_TINT = { sweet: '#fbff80', spicy: '#ffaf80', challenge: '#e4e4e4' };
export const towerDigit = (cat, d) => `${IMG}/tower/digits/${cat}/${d}.png`;
export const towerTag = (cat) => `${IMG}/tower/tag_${cat}.png`;
