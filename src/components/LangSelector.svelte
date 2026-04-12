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
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
    }

    select {
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 5px;
        color: white;
        font-size: 0.78em;
        font-weight: 600;
        padding: 4px 8px;
        cursor: pointer;
        outline: none;
    }

    select option {
        background: #333;
        color: white;
    }

    select:hover {
        background: rgba(255, 255, 255, 0.28);
    }
</style>
