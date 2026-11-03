<script>
    import { locale } from 'svelte-i18n';

    const LANGS = [
        { code: 'en',      label: 'English' },
        { code: 'ja',      label: '日本語' },
        { code: 'zh-Hans', label: '中文 (简体)' },
        { code: 'zh-Hant', label: '中文 (繁體)' },
    ];

    function setLang(code) {
        locale.set(code);
        localStorage.setItem('locale', code);
    }
</script>

<div class="lang-selector">
    <select value={$locale} on:change={(e) => setLang(e.target.value)}>
        {#each LANGS as lang}
        <option value={lang.code}>{lang.label}</option>
        {/each}
    </select>
</div>

<style>
    .lang-selector {
        flex: none;
        margin-left: auto;
    }

    select {
        margin: 0;
        background: rgba(255, 255, 255, 0.18);
        border: 2px solid rgba(255, 255, 255, 0.45);
        border-radius: 999px;
        color: white;
        font-size: 13px;
        font-weight: 500;
        padding: 4px 12px;
        cursor: pointer;
        outline: none;
    }

    select option {
        background: #ffffff;
        color: #0d2440;
    }

    select:hover {
        background: rgba(255, 255, 255, 0.28);
    }
</style>
