<script>
  import db, { addFromTree } from "../db";

  let shareID = "";

  $: valid = shareID.length == 15;

  async function add() {
    try {
      let res = await fetch("share/" + shareID);
      let tree = await res.json();
      tree.share = shareID;

      await addFromTree(tree);
    } catch (err) {
      console.error(err);
      shareID = "ID Invalide";
    }
  }
</script>

<style>
  .addfolder {
    text-align: center;
  }

  .button {
    padding: 0.5rem;
  }
</style>

<div class="addfolder">
  <label>
    Ajouter un dossier
    <input
      placeholder="ID de partage"
      bind:value={shareID}
      minlength="15"
      maxlength="15" />
  </label>
  <button class="button" class:disabled={!valid} on:click={add}>Ajouter</button>
</div>
