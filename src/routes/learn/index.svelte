<script>
  import { selectedLists, cards, showNotion } from "../../stores";
  import Flashcard from "../../components/flashcard.svelte";
  import { goto } from "@sapper/app";
  import { onMount, tick } from "svelte";

  onMount(() => {
    if (!$selectedLists.length)
      goto(process.env.BASE_PATH, { replaceState: true });
  });

  let i = 0;
  let answered = false;
  let displayCard = true;
  let allCards;

  $: allCards = $cards
    .filter(c => $selectedLists.includes(c.list))
    .sort(() => Math.random() - 0.5);
  // force flashcard destroy/create
  $: {
    i; // trigger when i changes
    displayCard = false;
    tick().then(() => (displayCard = true));
  }

  function handleKeydown(e) {
    if (answered && (e.key == "Enter" || e.key == "Tab")) {
      e.preventDefault();
      next();
    } else if (e.key == "Escape") {
      goto(process.env.BASE_PATH);
    }
  }

  function next() {
    i = (i + 1) % allCards.length;
    answered = false;
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
  {#if allCards.length}
    {#if displayCard}
      <Flashcard
        card={allCards[i]}
        startOnNotion={$showNotion}
        on:answer={e => (answered = true)}
        on:click={e => answered && next()} />
    {/if}
  {:else}
    <p>Pas de cartes sélectionnées</p>
  {/if}
  <a class="button" href={process.env.BASE_PATH}>Retour</a>
</div>
