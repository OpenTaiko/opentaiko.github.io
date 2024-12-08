<script>
    export let color1 = "rgb(255, 133, 62)";
    export let color2 = "rgb(255, 102, 42)";
    export let href = "#";
    export let text = "";

    let isActive = false;
</script>


<div 
    class="button" 
    style="background-image: linear-gradient({isActive ? color2 : color1}, {isActive ? color1 : color2})"
    on:mousedown={() => (isActive = true)}
    on:mouseup={() => (isActive = false)}
    on:mouseleave={() => (isActive = false)}
>
    <a href={href} target="_blank">{text}</a>
</div>

<style>
    .button {
        font-size: 16pt;

        width: fit-content;
        border-radius: 4px;
        margin: 5px;
        padding: 5px;
        
        color: white;
        text-decoration: none;
        cursor: pointer;
    }
    .button a {
        color: white;
        text-decoration: none;
    }
</style>