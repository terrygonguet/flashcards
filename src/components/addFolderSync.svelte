<script>
  import db from "../db";

  let shareID = "";

  $: valid = shareID.length == 15;

  async function add() {
    try {
      let res = await fetch("share/" + shareID);
      let tree = await res.json();

      await db.transaction("rw", db.directory, db.list, db.card, async () => {
        let directory = await db.directory.add({ label: tree.label });
        for (const l of tree.lists) {
          let list = await db.list.add({ directory, label: l.label });
          await Promise.all(l.cards.map(c => db.card.add({ ...c, list })));
        }
      });
    } catch (err) {
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
