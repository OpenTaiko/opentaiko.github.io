import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import en from './en.js';
import ja from './ja.js';
import zhHans from './zh-Hans.js';
import zhHant from './zh-Hant.js';

export function resolveLocale() {
    const nav = getLocaleFromNavigator() ?? '';

    if (/^zh(-Hans(-|$)|-(CN|SG|MY)(-|$))/i.test(nav) || /^zh$/i.test(nav)) {
        return 'zh-Hans';
    }
    if (/^zh(-Hant(-|$)|-(TW|HK|MO)(-|$))/i.test(nav)) {
        return 'zh-Hant';
    }
    if (/^ja(-|$)/i.test(nav)) return 'ja';

    return 'en';
}

export function setupI18n() {
    addMessages('en', en);
    addMessages('ja', ja);
    addMessages('zh-Hans', zhHans);
    addMessages('zh-Hant', zhHant);

    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;

    init({
        fallbackLocale: 'en',
        initialLocale: saved ?? resolveLocale(),
    });
}

/** Map a raw DB status string to its i18n key. */
export const statusKey = (s) => 'status.' + s.toLowerCase().replace(/ /g, '_');

export { locale };
