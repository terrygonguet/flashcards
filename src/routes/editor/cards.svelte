<script>
  import { lists, cards, selectedCard, selectedList } from "../../stores";
  import db, { clearTrash } from "../../db";
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";

  onMount(() => {
    if (!$selectedList) goto("editor", { replaceState: true });
  });

  let cardsInList = [];
  $: {
    if ($selectedList == "trash") {
      cardsInList = cardsInList = $cards.filter(
        c => !$lists.find(l => l.id == c.list)
      );
    } else if ($selectedList) {
      cardsInList = $cards.filter(c => c.list == $selectedList.id);
    } else cardsInList = [];
  }

  function add(e) {
    db.card
      .add({ notion: "", explication: "", level: 1, list: $selectedList.id })
      .then(id => {
        let card = $cards.find(c => c.id == id);
        $selectedCard = card;
        goto("editor/card");
      });
  }

  function clear() {
    if (
      confirm(
        "Ceci va supprimer définitivement toutes les cartes dans la corbeille"
      )
    )
      clearTrash();
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-auto-rows: max-content;
    grid-gap: 0.5rem;
    width: 100%;
  }

  .card {
    width: 100%;
    height: 100%;
  }

  .card img {
    display: block;
    border-radius: 0.25rem;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .add {
    border: 1px solid grey;
    border-radius: 0.25rem;
    padding: 1rem;
    text-decoration: none;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>

<div class="container">
  {#each cardsInList as card}
    <a
      href="editor/card"
      on:click={e => ($selectedCard = card)}
      class:card={card.image}
      class:add={!card.image}>
      {#if card.image}
        <img src={card.image} alt="image" />
      {:else}
        {@html card.notion}
      {/if}
    </a>
  {:else}
    <a href="editor" class="add">Retour</a>
  {/each}
  {#if $selectedList != 'trash'}
    <a href="editor/card" class="add" on:click={add}>Ajouter une carte</a>
  {:else}
    <span class="add" on:click={clear}>Vider la corbeille</span>
  {/if}
</div>
