<script>
  import { selectedLists, cards, showNotion, seriesLength } from "../../stores";
  import Flashcard from "../../components/flashcard.svelte";
  import { goto } from "@sapper/app";
  import { onMount, tick } from "svelte";
  import db from "../../db";

  onMount(() => {
    if (!$selectedLists.length) goto(".", { replaceState: true });
    if (!series.length) goto(".", { replaceState: true }); // beurk deso
  });

  let i = 0;
  let displayCard = true;
  let allCards = $cards
    .filter(c => $selectedLists.includes(c.list))
    .flatMap(c => Array(clamp(1, Infinity, 8 - c.level)).fill(c));
  let series;

  if (!allCards.length) series = [];
  // if only one card, only show one
  else if (!allCards.some(c => c.id != allCards[0].id)) series = [allCards[0]];
  else
    series = Array($seriesLength)
      .fill(0) // because JS
      .reduce((acc, cur, i) => {
        while (true) {
          // scramble and prevent same card twice
          let j = Math.floor(Math.random() * allCards.length);
          let c = allCards[j];
          if (!acc.length || acc[i - 1].id != c.id) return [...acc, c];
          else continue;
        }
      }, []);

  // force flashcard destroy/create
  $: {
    i; // trigger when i changes
    displayCard = false;
    tick().then(() => (displayCard = true));
  }

  function handleKeydown(e) {
    if (e.key == "Escape") {
      goto(".");
    }
  }

  function next(e) {
    let card = series[i];
    card.level = clamp(1, 8, (card.level || 1) + (e.detail ? 1 : -1));
    db.card.update(card.id, { level: card.level });
    if (i + 1 >= series.length) goto(".");
    else i++;
  }

  function clamp(min, max, n) {
    return n < min ? min : n > max ? max : n;
  }
</script>

<style>
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: auto;
  }

  .button {
    width: 100%;
    margin-top: 0.5rem;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
    }
  }
</style>

<svelte:window on:keydown={handleKeydown} />
<svelte:head>
  <title>Get Learned - Flash Me</title>
</svelte:head>

<div class="container">
  {#if series.length}
    {#if displayCard}
      <Flashcard
        card={series[i]}
        startOnNotion={$showNotion}
        on:answer={next} />
    {/if}
  {:else}
    <p>Chargement...</p>
  {/if}
  <a class="button" href=".">Retour</a>
</div>
