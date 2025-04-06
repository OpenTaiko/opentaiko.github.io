<script>
    export let items = [];
    export let activeTabValue = 1;
  
    const handleClick = tabValue => () => (activeTabValue = tabValue);
</script>
  
  <ul>
  {#each items as item}
      <li class={activeTabValue === item.value ? 'active' : ''} 
      style="{activeTabValue === item.value ? `background-color:${item.color}` : ''}">
          <span on:click={handleClick(item.value)}>{item.label}</span>
      </li>
  {/each}
  </ul>
  {#each items as item}
      {#if activeTabValue == item.value}
      <div class="box">
          <svelte:component this={item.component} {...item.props}/>
      </div>
      {/if}
  {/each}

  <style>
    .box {
      margin-bottom: 10px;
      padding: 40px;
      border: 1px solid #dee2e6;
      border-radius: 0 0 .5rem .5rem;
      border-top: 0;
      background-color: rgba(255,255,255,0.7);
      }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
      border-bottom: 1px solid #dee2e6;
    }
    li {
      margin-bottom: -1px;
    }
  
    span {
      border: 1px solid transparent;
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      display: block;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  
    span:hover {
      border-color: #e9ecef #e9ecef #dee2e6;
    }

    li > span {
      background-color: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.4);
    }
  
    li.active > span {
      color: #495057;
      border-color: rgba(255,255,255,0.4);
    }
  </style>