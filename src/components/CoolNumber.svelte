<script>
    export let number = 10.5;
    export let color = 'red';
  
    let intPart = Math.floor(number);
    let showPlus = number >= 10 && (number - intPart) >= 0.5;
  </script>
  
  <style>
    .number-container {
      position: relative;
      display: table;
      margin: 0 auto;
    }
  
    .number {
      font-size: 3rem;
      font-weight: bold;
      color: white;
      background: linear-gradient(150deg, white 15%, var(--color) 60%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.2em;
      padding-right: 0.2em;
    }
  
    .plus {
      font-size: 1.4rem;
      position: absolute;
      top: 0;
      right: -0.2rem;
      color: white;
      text-shadow: rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97998px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.5136px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px;
    }
  </style>
  
  <div class="number-container">
    <span class="number" style="--color: {color}">{intPart}</span>
    {#if showPlus}
      <span class="plus">+</span>
    {/if}
  </div>
  