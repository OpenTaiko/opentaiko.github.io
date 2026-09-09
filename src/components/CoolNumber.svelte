<script>
    export let number = 10.5;
    export let color = 'red';
  
    // A "+" is shown for any level whose decimal part is .5 or more,
    // at every level (7.5 -> 7+, not just 10+).
    $: intPart = Math.floor(number);
    $: showPlus = (number - intPart) >= 0.5;
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
      /* keeps the outline layer's negative z-index inside this element */
      isolation: isolate;
    }

    /* Outline for the "+". A text-shadow stack can't be a gradient, so the
       glyph is drawn a second time behind: a transparent text-stroke plus
       background-clip:text makes the gradient paint only in the stroke band,
       and the white glyph on top hides the fill. */
    .plus::before {
      content: '+';
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      -webkit-text-stroke: 3px transparent;
      /* 45deg starts the gradient at the bottom-left, so the tinted end sits
         there and fades to black toward the top-right. The tint holds a wide
         solid band so it covers more of the outline than the black does. */
      background: #000;   /* fallback where color-mix is unsupported */
      background: linear-gradient(45deg,
                  color-mix(in srgb, var(--color) 55%, #000) 0%,
                  color-mix(in srgb, var(--color) 55%, #000) 55%,
                  #000 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  </style>
  
  <div class="number-container" style="--color: {color}">
    <span class="number">{intPart}</span>
    {#if showPlus}
      <span class="plus">+</span>
    {/if}
  </div>
  