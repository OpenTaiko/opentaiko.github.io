/**
 * Localized song titles from the soundtrack metadata.
 *
 * Songs in soundtrack_info.json carry optional `chartTitles` / `chartSubtitles`
 * maps keyed by an UPPERCASE language code (JA, ZH, EN, KO, ES, FR, RU), e.g.
 *
 *   chartTitle:  "Yami"          chartTitles:    { JA: "闇" }
 *   chartSubtitle: "SiLiS ft. Karin Natsuki"
 *   chartSubtitles: { JA: "SiLiS ft. 夏色花梨" }
 *
 * The site's locales are svelte-i18n tags ('en', 'ja', 'zh-Hans', 'zh-Hant'),
 * so the primary subtag is uppercased to find a match. That maps zh-Hans and
 * zh-Hant both to ZH, and means any locale added to the site later
 * (ko / es / fr / ru) starts working here with no change.
 *
 * Everything falls back to the default chartTitle / chartSubtitle, so songs
 * without a translation are unaffected.
 *
 * NOTE: pass the locale in from `$locale` at the point of use so the value is
 * re-evaluated when the language selector changes it (it does not reload).
 */

/** soundtrack_info.json language key for a svelte-i18n locale. */
export const localeKey = (loc) => String(loc || 'en').split('-')[0].toUpperCase();

/** Localized title of a raw soundtrack_info.json song object. */
export const localizedTitle = (song, loc) =>
    (song && (song.chartTitles?.[localeKey(loc)] || song.chartTitle)) || '';

/** Localized subtitle of a raw soundtrack_info.json song object. */
export const localizedSubtitle = (song, loc) =>
    (song && (song.chartSubtitles?.[localeKey(loc)] || song.chartSubtitle)) || '';

/**
 * Title for a row that has a raw song when it was found in the soundtrack and
 * a literal fallback string (e.g. "#3. Not Found") when it wasn't.
 */
export const pickTitle = (song, fallback, loc) =>
    song ? localizedTitle(song, loc) : (fallback ?? '');

export const pickSubtitle = (song, fallback, loc) =>
    song ? localizedSubtitle(song, loc) : (fallback ?? '');
