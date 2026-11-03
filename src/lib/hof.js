/**
 * Hall of Fame data (public/hof.db3) and the List Points every score is worth.
 *
 * entries: one row per ranked chart, hardest first (internalDifficultyIndex DESC);
 *          a chart's rank is its position in that order.
 * scores:  one row per submitted play.
 */
import initSqlJs from 'sql.js';
import { computeMaxListPoints } from './listPoints.js';
import { COURSE_KEYS } from './skin.js';

let pending = null;

export const loadHof = () => {
    if (pending === null) {
        pending = Promise.all([
            initSqlJs({ locateFile: () => '/sql-wasm.wasm' }),
            fetch('/hof.db3').then(res => res.arrayBuffer()),
        ]).then(([SQL, buf]) => {
            const db = new SQL.Database(new Uint8Array(buf));
            const e = db.exec('SELECT * FROM entries ORDER BY internalDifficultyIndex DESC');
            const s = db.exec('SELECT * FROM scores');
            db.close();
            return { entries: e[0]?.values ?? [], scores: s[0]?.values ?? [] };
        }).catch(err => { pending = null; throw err; });
    }
    return pending;
};

const STATUS_RANK = { 'Perfect': 3, 'Full Combo': 2, 'Clear': 1, 'Failed': 0 };

/** A score's share of its chart's max List Points. */
export const scoreToListPointsRatio = (accuracy, badRatio, status) => {
    let r = Math.pow(accuracy, 6) * Math.pow(1 - badRatio, 18);
    switch (status) {
        case 'Perfect': return r;
        case 'Full Combo': return r * 0.9;
        case 'Clear': return r * 0.7;
        default: return 0;
    }
};

/** A raw scores row as an object, with accuracy (0-100) and LP for a chart of the given rank. */
export const scoreRow = (row, rank) => {
    const [scoreId, uid, course, player, status, score, grade, good, ok, bad, video, image] = row;
    const total = good + ok + bad;
    const acc = total > 0 ? (good + ok * 0.5) / total : 0;
    const lp = rank > 0 ? parseInt(scoreToListPointsRatio(acc, total > 0 ? bad / total : 0, status) * computeMaxListPoints(rank)) : 0;
    return { scoreId, uid, course, player, status, score, grade, good, ok, bad, video, image, accuracy: 100 * acc, lp };
};

/**
 * The Hall of Fame list: every entry with its song, level, max LP, best status and play count.
 * songsById maps uniqueId -> soundtrack_info.json entry.
 */
export const hofRows = (hof, songsById) => {
    const plays = new Map(), best = new Map();
    for (const row of hof.scores) {
        const key = row[1] + ':' + row[2];
        plays.set(key, (plays.get(key) ?? 0) + 1);
        if ((STATUS_RANK[row[4]] ?? -1) > (STATUS_RANK[best.get(key)] ?? -1)) best.set(key, row[4]);
    }
    return hof.entries.map((entry, idx) => {
        const [, uid, course] = entry;
        const key = uid + ':' + course;
        const song = songsById.get(uid) ?? null;
        return {
            rank: idx + 1, uid, course, song,
            level: song?.chartDifficulties?.[COURSE_KEYS[course]] ?? -1,
            maxLp: computeMaxListPoints(idx + 1),
            best: best.get(key) ?? null,
            plays: plays.get(key) ?? 0,
        };
    });
};

/**
 * Every score on a ranked chart, best List Points first, as Leaderboards and PlayerInfo list them:
 * each with its chart's rank, song and level; scores on charts the soundtrack no longer has are left out.
 */
export const rankedScores = (hof, songsById) => {
    const charts = new Map(hofRows(hof, songsById).map(r => [r.uid + ':' + r.course, r]));
    const out = [];
    for (const row of hof.scores) {
        const chart = charts.get(row[1] + ':' + row[2]);
        if (!chart || chart.song === null || chart.level < 0) continue;
        out.push({ ...scoreRow(row, chart.rank), rank: chart.rank, song: chart.song, level: chart.level });
    }
    return out.sort((a, b) => b.lp - a.lp);
};

/** Players by total List Points, with their score count and Perfect / Full Combo / Clear counts. */
export const topPlayers = (scores) => {
    const by = new Map();
    for (const s of scores) {
        const p = by.get(s.player) ?? { player: s.player, lp: 0, count: 0, statuses: { 'Perfect': 0, 'Full Combo': 0, 'Clear': 0 } };
        p.lp += s.lp;
        p.count += 1;
        if (p.statuses[s.status] !== undefined) p.statuses[s.status] += 1;
        by.set(s.player, p);
    }
    return [...by.values()].sort((a, b) => b.lp - a.lp);
};

export const songsByIdOf = (songs) => new Map(songs.map(s => [s.uniqueId, s]));
