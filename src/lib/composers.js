/**
 * Composers (public/artists_info.db3) and the song boxes listed under each.
 *
 * A box is what a composer's page shows and what their song count counts:
 *   - a regular song: one box per chart folder;
 *   - a tower: counted only when it is a tower-only song, i.e. it has no chartDependencies in
 *     soundtrack_info.json (a tower built from another song's chart is that song, already
 *     counted). Its Sweet and Spicy instances share one box, with a button for each;
 *   - a Challenge tower: its own box.
 */
import initSqlJs from 'sql.js';
import { fetchSoundtrack, hideForLocale } from './soundtrack.js';

const TOWER_FOLDERS = { '01 - Sweet': 'sweet', '02 - Spicy': 'spicy', '03 - Challenges': 'challenge' };

export const songBoxes = (songs) => {
    const boxes = [];
    const pairs = new Map();    // Sweet / Spicy instances of one tower song, by title
    for (const s of songs) {
        const cat = TOWER_FOLDERS[s.tjaGenreFolder];
        if (!cat) {
            boxes.push({ kind: 'song', key: s.uniqueId, song: s, uids: [s.uniqueId] });
            continue;
        }
        if ((s.chartDependencies ?? []).length > 0) continue;
        if (cat === 'challenge') {
            boxes.push({ kind: 'challenge', key: s.uniqueId, song: s, uids: [s.uniqueId] });
            continue;
        }
        let box = pairs.get(s.chartTitle);
        if (!box) {
            box = { kind: 'tower', key: 'tower:' + s.chartTitle, song: s, uids: [], sweet: null, spicy: null };
            pairs.set(s.chartTitle, box);
            boxes.push(box);
        }
        box[cat] = s;
        box.uids.push(s.uniqueId);
        if (cat === 'sweet') box.song = s;
    }
    return boxes;
};

let pending = null;

/**
 * { artists: [{ id, name, count, links }], boxesOf: Map artistId -> boxes }, composers with
 * no counted song left out, most songs first.
 */
export const loadComposers = () => {
    if (pending === null) {
        pending = Promise.all([
            initSqlJs({ locateFile: () => '/sql-wasm.wasm' }),
            fetch('/artists_info.db3').then(r => r.arrayBuffer()),
            fetchSoundtrack(),
        ]).then(([SQL, buf, songsRaw]) => {
            const db = new SQL.Database(new Uint8Array(buf));
            const songRows = db.exec('SELECT songUid, artists FROM songs')[0]?.values ?? [];
            const artistRows = db.exec('SELECT entryId, artist, youtube, soundcloud, spotify, bandcamp, bilibili, other FROM artists')[0]?.values ?? [];
            db.close();

            const artistsOfUid = new Map();
            for (const [uid, json] of songRows) {
                try { artistsOfUid.set(uid, JSON.parse(json)); } catch { /* a malformed row credits no one */ }
            }

            const boxesOf = new Map();
            for (const box of songBoxes(hideForLocale(songsRaw))) {
                const ids = new Set(box.uids.flatMap(uid => artistsOfUid.get(uid) ?? []));
                for (const id of ids) {
                    if (!boxesOf.has(id)) boxesOf.set(id, []);
                    boxesOf.get(id).push(box);
                }
            }

            const artists = artistRows
                .map(([id, name, youtube, soundcloud, spotify, bandcamp, bilibili, other]) => ({
                    id, name, count: boxesOf.get(id)?.length ?? 0,
                    links: { youtube, soundcloud, spotify, bandcamp, bilibili, other },
                }))
                .filter(a => a.count > 0)
                .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

            return { artists, boxesOf };
        }).catch(err => { pending = null; throw err; });
    }
    return pending;
};

// the site's own brand colour per link; "other" is named from its URL
export const LINK_DEFS = [
    { key: 'youtube', label: 'YouTube', color: '#ff0000' },
    { key: 'soundcloud', label: 'SoundCloud', color: '#ff5500' },
    { key: 'spotify', label: 'Spotify', color: '#1db954' },
    { key: 'bandcamp', label: 'Bandcamp', color: '#1da0c3' },
    { key: 'bilibili', label: 'Bilibili', color: '#00a1d6' },
];

export const otherLabel = (url) => {
    if (!url) return 'Link';
    const u = url.toLowerCase();
    if (u.includes('twitter.com') || u.includes('x.com')) return 'X / Twitter';
    if (u.includes('linktr.ee')) return 'Linktree';
    if (u.includes('bsky.app')) return 'Bluesky';
    if (u.includes('newgrounds')) return 'Newgrounds';
    if (u.includes('bmssearch')) return 'BMS Search';
    if (u.includes('instagram')) return 'Instagram';
    if (u.includes('bandcamp')) return 'Bandcamp';
    if (u.includes('nicovideo')) return 'NicoNico';
    if (u.includes('musescore')) return 'MuseScore';
    return 'Website';
};
