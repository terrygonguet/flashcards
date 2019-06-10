<script>
  import CardEditor from "../../components/cardEditor.svelte";
  import { selectedCard } from "../../stores";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  onMount(() => {
    if (!$selectedCard) goto("editor/cards");
  });
</script>

{#if $selectedCard}
  <CardEditor card={$selectedCard} />
{:else}
  <p>Pas de carte sélectionnée.</p>
{/if}
