<script>
  import { directories, lists, cards } from "../stores";
  import db from "../db";

  async function share(dir) {
    let _lists = $lists
      .filter(l => l.directory == dir.id)
      .map(l => ({
        label: l.label,
        cards: $cards
          .filter(c => c.list == l.id)
          .map(c => ({ ...c, level: 1, list: undefined, id: undefined }))
      }));
    let tree = {
      label: dir.label,
      lists: _lists
    };

    try {
      let body = new Blob([JSON.stringify(tree)], { type: "application/json" });
      let res = await fetch("share/", { method: "POST", body });
      let json = await res.json();

      await db.directory.update(dir.id, { share: json.id });
      await navigator.clipboard.writeText(json.id);
    } catch (err) {
      console.error(err);
    }
  }

  function selectID(e) {
    let range = document.createRange();
    range.selectNode(e.target);
  }
</script>

<style>
  .folderlist {
    list-style-type: none;
    width: 100%;
  }

  .folderlist li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0.25rem;
  }

  .shareid {
    font-size: 0.65rem;
  }

  .button {
    padding: 0.5rem;
  }
</style>

<ul class="folderlist">
  {#each $directories as dir}
    <li>
      <span>{dir.label}</span>
      {#if dir.share}
        <span on:click={selectID} class="shareid">{dir.share}</span>
      {/if}
      <button class="button" on:click={e => share(dir)}>
         {dir.share ? 'Syncroniser' : 'Partager'}
      </button>
    </li>
  {:else}
    <li>Chargement...</li>
  {/each}
</ul>
