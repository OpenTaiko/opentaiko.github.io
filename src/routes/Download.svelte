<script>
    import { onMount } from "svelte";
    import { _ } from 'svelte-i18n';
    import ButtonLink from "../components/ButtonLink.svelte";
    let Fetching = true;

    let download_version = ""
    let download_app = "#"
    let download_deb = "#"
    let download_exe = "#"
    let DownloadsInfo = {}

    let game_version = ""
    let game_win = "#"
    let game_linux = "#"
    let GamesInfo = {}

    let SkinsInfo = {}
    let skinver_owm = ""
    let skinver_simple = ""
    let skinver_simple1080 = ""

    const FetchDownloads = async () => {
        Fetching = true;

        let download_text = (await fetch("https://api.github.com/repos/OpenTaiko/OpenTaiko-Hub/releases/latest"));
        let download_text_value = (await download_text.text()).valueOf();
        DownloadsInfo = JSON.parse(download_text_value);

        download_version = DownloadsInfo["tag_name"]
        download_app = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".AppImage"))["browser_download_url"]
        download_deb = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".deb"))["browser_download_url"]
        download_exe = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".exe"))["browser_download_url"]

        let game_text = (await fetch("https://api.github.com/repos/0auBSQ/OpenTaiko/releases/latest"));
        let game_text_value = (await game_text.text()).valueOf();
        GamesInfo = JSON.parse(game_text_value);

        game_version = GamesInfo["tag_name"]
        game_win = GamesInfo["assets"].find(asset => asset["browser_download_url"].endsWith("Win.x64.zip"))["browser_download_url"]
        game_linux = GamesInfo["assets"].find(asset => asset["browser_download_url"].endsWith("Linux.x64.zip"))["browser_download_url"]

        let skin_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Skins/main/assets_info.json"));
        let skin_text_value = (await skin_text.text()).valueOf();
        SkinsInfo = JSON.parse(skin_text_value);

        skinver_owm = SkinsInfo["Skins"].find(skin => skin["skinFolder"] == "Open-World Memories")["skinVersion"]
        skinver_simple = SkinsInfo["Skins"].find(skin => skin["skinFolder"] == "SimpleStyle")["skinVersion"]
        skinver_simple1080 = SkinsInfo["Skins"].find(skin => skin["skinFolder"] == "SimpleStyle (1080p)")["skinVersion"]

        Fetching = false;
    }

    onMount(async () => {
        await FetchDownloads()
    })
</script>


<h1>{$_('download.title')}</h1>
<p>{$_('download.subtitle')}</p>

<separator/>

<h1>{$_('download.installer')}</h1>
<div class="split">
    <div class="content-center">
        <img src="image/optk-kun-box.png" alt="OpenTaiko-kun"/>
    </div>
    <div class="content-center">
        <h2>OpenTaiko Hub</h2>
        <p>{$_('download.hub_desc')}</p>
        <h3>{$_('download.current_version', { values: { version: Fetching ? $_('download.fetching') : download_version } })}</h3>

        <div class="buttons">
            {#if Fetching === true}
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" logo="image/windows.png" />
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" logo="image/linux.png" />
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" logo="image/linux.png" />
            {:else}
                <ButtonLink href={download_exe}  text={$_('download.download_exe')}       logo="image/windows.png" />
                <ButtonLink href={download_deb}  text={$_('download.download_deb')}       logo="image/linux.png" />
                <ButtonLink href={download_app}  text={$_('download.download_appimage')}  logo="image/linux.png" />
            {/if}
        </div>
    </div>
</div>
<separator/>

<h1>{$_('download.standalone')}</h1>
<div class="split">
    <div class="content-center" style="width: 25vw;">
        <h2>{$_('download.base_game')}</h2>
        <p>{$_('download.standalone_desc1')}</p>
        <p><i>{$_('download.standalone_desc2')}</i></p>
        <h3>{$_('download.current_version', { values: { version: Fetching ? $_('download.fetching') : game_version } })}</h3>
        <div class="buttons">
            {#if Fetching === true}
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" logo="image/windows.png" />
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" logo="image/linux.png" />
            {:else}
                <ButtonLink href={game_win}   text={$_('download.download_win')}   logo="image/windows.png" />
                <ButtonLink href={game_linux} text={$_('download.download_linux')} logo="image/linux.png" />
            {/if}
        </div>
    </div>
    <div class="content-center">
        <img width="350px" height="288px" src="image/optk-kun.png" alt="OpenTaiko-kun"/>
    </div>
    <div class="content-center" style="width: 25vw;">
        <h2>{$_('download.skins')}</h2>
        <p>{$_('download.skins_desc1')}</p>
        <p><i>{$_('download.skins_desc2')}</i></p>
        <h3>{$_('download.available_skins')}</h3>
        <div class="buttons">
            {#if Fetching === true}
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/Open-World.Memories.zip" />
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/SimpleStyle.1080p.zip" />
                <ButtonLink text={$_('download.fetching')} color1="rgb(80,80,80)" color2="rgb(60,60,60)" href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/SimpleStyle.zip" />
            {:else}
                <ButtonLink text="Open-World Memories (v{skinver_owm})"        href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/Open-World.Memories.zip" />
                <ButtonLink text="SimpleStyle (1080p) (v{skinver_simple1080})" href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/SimpleStyle.1080p.zip" />
                <ButtonLink text="SimpleStyle (v{skinver_simple})"             href="https://github.com/OpenTaiko/OpenTaiko-Skins/releases/download/system-assets/SimpleStyle.zip" />
            {/if}
        </div>
    </div>
</div>

<separator/>

<div class="split">
    <div class="content-center" style="width: 50vw;">
        <h2>{$_('download.source')}</h2>
        <p>{$_('download.source_desc')}</p>

        <div class="buttons">
            <ButtonLink href="https://github.com/0auBSQ/OpenTaiko" text={$_('download.main_repo')}  color1="rgb(53,157,255)" color2="rgb(42,117,255)" />
            <ButtonLink href="https://github.com/OpenTaiko"        text={$_('download.github_org')} color1="rgb(53,157,255)" color2="rgb(42,117,255)" />
        </div>
    </div>
</div>

<style>
    .buttons, .split {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        vertical-align: middle;
        margin: 0px auto;
        padding: 0px auto;
    }
    .split {
        width: 80%;
        flex-wrap: nowrap !important;
    }
    .split > * {
        margin: 0px 10pt;
    }
    .content-center {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        vertical-align: middle;
    }
    .content-center > * {
        margin: 12pt 0px;
    }
</style>
