/**
 * Localized song titles from the soundtrack metadata.
 *
 * Songs in soundtrack_info.json carry optional `chartTitles` / `chartSubtitles`
 * maps keyed by an UPPERCASE locale code (JA, ZH, EN, KO, ES, FR, RU, ...), e.g.
 *
 *   chartTitle:  "Yami"          chartTitles:    { JA: "闇", ZH_TW: "闇" }
 *   chartSubtitle: "SiLiS ft. Karin Natsuki"
 *   chartSubtitles: { JA: "SiLiS ft. 夏色花梨", ZH_TW: "SiLiS ft. 夏色花梨" }
 *
 * The site's locales are svelte-i18n tags ('en', 'ja', 'zh-Hans', 'zh-Hant'),
 * tag is uppercased and '-' replaced by '_' to find a match,
 * and fall backs with less-specified tags or alternative fallback tags.
 * That maps zh-Hans to ZH_HANS, ZH_CN/SG/MY, and then ZH;
 * zh-Hant to ZH_HANT, ZH_TW/HK/MO, and then also ZH;
 * and means any single-tag locale added to the site later
 * (ko / es / fr / ru) starts working here with no change.
 *
 * Everything falls back to the default chartTitle / chartSubtitle, so songs
 * without a translation are unaffected.
 *
 * NOTE: pass the locale in from `$locale` at the point of use so the value is
 * re-evaluated when the language selector changes it (it does not reload).
 */

const locToDefaultScript = { // mostly-used script in each region
    ZH_CN: 'ZH_HANS', ZH_SG: 'ZH_HANS', ZH_MY: 'ZH_HANS',
    ZH_TW: 'ZH_HANT', ZH_HK: 'ZH_HANT', ZH_MO: 'ZH_HANT',
};

const locToFallbacks = {}; // one-time fall back

// given script and region together not localized, ignore given script if default in region
for (let loc in locToDefaultScript) {
    const region = loc.split('_').pop();
    const langScript = locToDefaultScript[loc];
    const langScriptReg = langScript + region;
    const locfs = locToFallbacks[langScriptReg] = (locToFallbacks[langScriptReg] ?? []);
    locfs.push(loc);
}

// given region not localized, fallbacks to given region's default script
for (let loc in locToDefaultScript) {
    const langScript = locToDefaultScript[loc];
    const locfs = locToFallbacks[loc] = (locToFallbacks[loc] ?? []);
    locfs.push(langScript);
}

// given script not localized, fallbacks to regions where the given script is the default script
for (let loc in locToDefaultScript) {
    const langScript = locToDefaultScript[loc];
    const locfs = locToFallbacks[langScript] = (locToFallbacks[langScript] ?? []);
    locfs.push(loc);
}

/** soundtrack_info.json language key candicates for a svelte-i18n locale. */
export const localeKeys = function* (loc) {
    const parts = String(loc || 'en').split('-');
    for (let n = parts.length; n > 0; --n) {
        let locn = parts.slice(0, n).join('_').toUpperCase();
        yield locn;
        let locfs = locToFallbacks[locn];
        for (let locf of locToFallbacks[locn] ?? [])
            yield locf;
    }
};

export const resolveLocale = (localized, loc) => {
    if ((localized ?? null) === null)
        return null;
    for (let key of localeKeys(loc)) {
        if ((localized[key] ?? null) !== null)
            return localized[key];
    }
    return null;
};

/** Localized title of a raw soundtrack_info.json song object. */
export const localizedTitle = (song, loc) =>
    (song && (resolveLocale(song.chartTitles, loc) || song.chartTitle)) || '';

/** Localized subtitle of a raw soundtrack_info.json song object. */
export const localizedSubtitle = (song, loc) =>
    (song && (resolveLocale(song.chartSubtitles, loc) || song.chartSubtitle)) || '';

/**
 * Title for a row that has a raw song when it was found in the soundtrack and
 * a literal fallback string (e.g. "#3. Not Found") when it wasn't.
 */
export const pickTitle = (song, fallback, loc) =>
    song ? localizedTitle(song, loc) : (fallback ?? '');

export const pickSubtitle = (song, fallback, loc) =>
    song ? localizedSubtitle(song, loc) : (fallback ?? '');
