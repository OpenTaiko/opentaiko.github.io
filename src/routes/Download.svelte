<script>
    import ButtonLink from "../components/ButtonLink.svelte";
</script>


<h1>Download</h1>
<p>OpenTaiko is available for Windows, and is also available for Linux under experimental builds.</p>
<h2>OpenTaiko Hub</h2>
<p>Installer & updater for the base game, songs, skins, characters, and more.</p>
<div class="buttons">
    <ButtonLink
        href="https://github.com/OpenTaiko/OpenTaiko-Hub/releases/latest"
        text="Download (GitHub)"

    />
</div>
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