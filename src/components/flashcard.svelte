<script>
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Cardfigure from "./cardfigure.svelte";

  export let card;
  export let startOnNotion = true;

  let dispatch = createEventDispatcher();
  let answered = false;
  let first, second;
  $: {
    // keep data up to date for some reason
    first = {
      label: startOnNotion ? card.notion : card.explication,
      image: startOnNotion ? null : card.image
    };
    second = {
      label: startOnNotion ? card.explication : card.notion,
      image: startOnNotion ? card.image : null
    };
  }

  function handleClick(e) {
    if (!answered) {
      answered = true;
    }
  }

  function handleKeydown(e) {
    if (answered) {
      if (e.key == "Enter") answer(true)
      else if (e.key == "Backspace") answer(false)
    } else handleClick()
  }

  function answer(value)  {
    dispatch("answer", value)
  }
</script>

<style>
  .flashcard {
    padding: 0.25rem;
    border: 1px solid grey;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    max-height: 40rem;
    background-color: #eee;
    text-align: center;
    flex-grow: 1;
  }

  .right {
    border-color: green;
    background-color: forestgreen;
  }

  .wrong {
    border-color: red;
    background-color: crimson;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="flashcard" on:click={handleClick}>
  {#if !answered}
    <Cardfigure data={first} />
  {:else}
    <Cardfigure data={second} />
    <div>
      <button class="right button" on:click={e => answer(true)}>Juste</button>
      <button class="wrong button" on:click={e => answer(false)}>Faux</button>
    </div>
  {/if}
</div>
