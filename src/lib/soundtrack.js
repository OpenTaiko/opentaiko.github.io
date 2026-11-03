/**
 * soundtrack_info.json from the soundtrack repository, fetched once per page load
 * and shared by every route.
 */
const SOUNDTRACK_URL = 'https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json';
export const AUDIO_BASE = 'https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/';

let pending = null;

export const fetchSoundtrack = () => {
    if (pending === null) {
        pending = fetch(SOUNDTRACK_URL)
            .then(res => res.json())
            .catch(err => { pending = null; throw err; });
    }
    return pending;
};

/** The one song the site hides from zh-CN browsers. */
export const hideForLocale = (songs) => navigator.language === 'zh-CN'
    ? songs.filter(s => s.uniqueId !== 'losTPEtAlSwANDERRBHLiXoUNdsetSUnaN')
    : songs;

export const audioUrl = (path) => path ? AUDIO_BASE + path : '';
