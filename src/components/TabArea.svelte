<script>
    export let items = [];
    export let activeTabValue = 1;

    const handleClick = tabValue => () => (activeTabValue = tabValue);
</script>

<div class="tabs" role="tablist">
    {#each items as item}
        <button
            type="button"
            role="tab"
            class="tab"
            class:on={activeTabValue === item.value}
            aria-selected={activeTabValue === item.value}
            style="--tab:{item.color}; --tab-ink:{item.ink ?? '#0d2440'}"
            on:click={handleClick(item.value)}
        >{item.label}</button>
    {/each}
</div>
{#each items as item}
    {#if activeTabValue == item.value}
        <div class="panel box" role="tabpanel">
            <svelte:component this={item.component} {...item.props}/>
        </div>
    {/if}
{/each}

<style>
    .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 16px 0 10px;
    }
    .tab {
        margin: 0;
        padding: 6px 16px;
        border-radius: 999px;
        border: 2px solid var(--ink);
        background: #ffffff;
        color: var(--ink);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
    .tab:hover {
        background: #eef7fe;
    }
    .tab.on {
        background: var(--tab);
        color: var(--tab-ink);
        box-shadow: 0 3px 0 var(--ink);
    }
    .box {
        padding: 18px;
        margin-bottom: 10px;
    }
</style>
