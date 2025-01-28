<script>
    import { onMount } from "svelte";
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

        Fetching = false;
    }

    onMount(async () => {
        await FetchDownloads()
    })
</script>


<h1>Download</h1>
<p>OpenTaiko is available for Windows, and is also available for Linux under experimental builds.</p>

<separator/>

<h2>OpenTaiko Hub</h2>
<p>Installer & updater for the base game, songs, skins, characters, and more.</p>
<h3>{#if Fetching}Current Version: Fetching...{:else}Current Version: {download_version}{/if}</h3>

<div class="buttons">
    {#if Fetching === true}
        <ButtonLink
            text="Fetching..."
            color1="rgb(80, 80, 80)"
            color2="rgb(60, 60, 60)"
            logo="image/windows.png"
        />
        <ButtonLink
            text="Fetching..."
            color1="rgb(80, 80, 80)"
            color2="rgb(60, 60, 60)"
            logo="image/linux.png"
        />
        <ButtonLink
            text="Fetching..."
            color1="rgb(80, 80, 80)"
            color2="rgb(60, 60, 60)"
            logo="image/linux.png"
        />
    {:else}
        <ButtonLink
            href={download_exe}
            text="Download (.exe)"
            logo="image/windows.png"
        />
        <ButtonLink
            href={download_deb}
            text="Download (.deb)"
            logo="image/linux.png"
        />
        <ButtonLink
            href={download_app}
            text="Download (.AppImage)"
            logo="image/linux.png"
        />
    {/if}
</div>

<separator/>

<h2>Standalone</h2>
<p>If you prefer to not use the installer, you can download OpenTaiko by itself here.</p>
<p><i>This download does not come with any skins. You must download a skin separately, or else the game will not launch.</i></p>
<h3>{#if Fetching}Current Version: Fetching...{:else}Current Version: {game_version}{/if}</h3>
<div class="buttons">
    {#if Fetching === true}
        <ButtonLink
            text="Fetching..."
            color1="rgb(80, 80, 80)"
            color2="rgb(60, 60, 60)"
            logo="image/windows.png"
        />
        <ButtonLink
            text="Fetching..."
            color1="rgb(80, 80, 80)"
            color2="rgb(60, 60, 60)"
            logo="image/linux.png"
        />
    {:else}
        <ButtonLink
            href={game_win}
            text="Download (Windows x64)"
            logo="image/windows.png"
        />
        <ButtonLink
            href={game_linux}
            text="Download (Linux x64)"
            logo="image/linux.png"
        />
    {/if}
</div>

<separator/>

<h2>Source Code & Assets</h2>
<p>Open-source repositories used for OpenTaiko. The main project is licensed under the MIT License, but other assets may have differing licenses. Please refer to each project's README for further details.</p>

<div class="buttons">
    <ButtonLink
        href="https://github.com/0auBSQ/OpenTaiko"
        text="Main Repository"
        color1="rgb(53, 157, 255)"
        color2="rgb(42, 117, 255)"
    />
    <ButtonLink
        href="https://github.com/OpenTaiko"
        text="GitHub Organization"
        color1="rgb(53, 157, 255)"
        color2="rgb(42, 117, 255)"
    />
</div>

<style>
    .buttons {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        vertical-align: middle;
        margin: 0px auto;
        padding: 0px auto;
    }   
</style>