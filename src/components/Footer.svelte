<script>
    import { _ } from 'svelte-i18n';
</script>

<footer>
    <a href="https://github.com/OpenTaiko" target="_blank" rel="noopener noreferrer" title="GitHub"><img src="/image/github.png" alt="GitHub" /></a>
    <a href="https://x.com/OpenTaiko" target="_blank" rel="noopener noreferrer" title="Twitter"><img src="/image/twitter.png" alt="Twitter" /></a>
    <a href="https://bsky.app/profile/opentaiko.bsky.social" target="_blank" rel="noopener noreferrer" title="Bluesky"><img src="/image/bluesky.png" alt="Bluesky" /></a>
    <a href="https://discord.gg/aA8scTvZ6B" target="_blank" rel="noopener noreferrer" title="Discord"><img src="/image/discord.png" alt="Discord" /></a>
    <span class="sep" aria-hidden="true"></span>
    <!-- the wiki: an open book -->
    <a href="https://opentaiko.wiki.gg" target="_blank" rel="noopener noreferrer" title={$_('nav.wiki')} aria-label={$_('nav.wiki')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.2C10.3 4.9 7.9 4.3 5 4.3c-1 0-1.9.1-2.6.2a1 1 0 0 0-.9 1v12.3a1 1 0 0 0 1.2 1c.7-.1 1.5-.2 2.3-.2 2.7 0 4.8.6 6.4 1.9a1 1 0 0 0 1.2 0c1.6-1.3 3.7-1.9 6.4-1.9.8 0 1.6.1 2.3.2a1 1 0 0 0 1.2-1V5.5a1 1 0 0 0-.9-1c-.7-.1-1.6-.2-2.6-.2-2.9 0-5.3.6-7 1.9zm-1 11.4c-1.6-.9-3.6-1.3-6-1.3-.5 0-1 0-1.5.1V6.4l1.5-.1c2.6 0 4.6.6 6 1.7zm2 0V8c1.4-1.1 3.4-1.7 6-1.7l1.5.1v9.9c-.5-.1-1-.1-1.5-.1-2.4 0-4.4.4-6 1.4z"/></svg>
    </a>
    <!-- the blog: a page being written -->
    <a href="https://opentaiko.blogspot.com/" target="_blank" rel="noopener noreferrer" title={$_('nav.blog')} aria-label={$_('nav.blog')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h9l5 5v4.5h-2V9h-4V5H5v14h6v2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 8h8v2H7zm0 4h5v2H7zm13.7-.3 1.6 1.6a1 1 0 0 1 0 1.4L17 23h-3v-3l5.3-5.3a1 1 0 0 1 1.4 0z"/></svg>
    </a>
</footer>

<style>
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--footer-h);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        background: linear-gradient(180deg, #2a86da, #1d75ce);
        border-top: 2px solid rgba(13, 36, 64, 0.35);
    }
    footer img, footer svg {
        height: 28px;
        width: auto;
        display: block;
    }
    footer svg {
        width: 28px;
        fill: #ffffff;
    }
    footer a {
        display: flex;
        padding: 3px;
        opacity: 0.82;
        transition: opacity 0.15s, transform 0.15s;
    }
    footer a:hover, footer a:focus-visible {
        opacity: 1;
        transform: translateY(-2px);
        outline: none;
    }
    .sep {
        width: 2px;
        height: 24px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.45);
    }
</style>
