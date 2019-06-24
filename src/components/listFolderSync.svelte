<script>
  import { directories, lists, cards } from "../stores";
  import db, { clearDirectory, addFromTree } from "../db";

  function handleClick(dir) {
    if (!dir.share || dir.owner) share(dir);
    else sync(dir);
  }

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
      let query = dir.share ? `?id=${dir.share}` : "";
      let owner = dir.owner || !dir.share;
      let body = new Blob([JSON.stringify(tree, null, 2)], {
        type: "application/json"
      });
      let res = await fetch(`share/${query}`, { method: "POST", body });
      let json = await res.json();

      await db.directory.update(dir.id, { share: json.id, owner });
      await navigator.clipboard.writeText(json.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function sync(dir) {
    try {
      let res = await fetch(`share/${dir.share}`);
      let tree = await res.json();
      tree.share = dir.share;

      await db.transaction("rw", db.directory, db.list, db.card, async () => {
        await clearDirectory(dir);
        await addFromTree(tree);
      });
    } catch (err) {
      console.error(err);
    }
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
      <span>{dir.label}{dir.owner ? '👑' : ''}</span>
      {#if dir.share}
        <span class="shareid">{dir.share}</span>
      {/if}
      <button class="button" on:click={e => handleClick(dir)}>
         {dir.share ? 'Syncroniser' : 'Partager'}
      </button>
    </li>
  {:else}
    <li>Chargement...</li>
  {/each}
</ul>
