<script>
  import { directories, lists } from "../../stores";
  import db from "../../db";

  $: tree = $directories.map(dir => ({
    ...dir,
    lists: $lists.filter(l => l.directory == dir.id)
  }));

  function update(collection, obj, label) {
    db[collection].update(obj.id, { label });
  }

  function addList(dir) {
    db.list.add({ directory: dir.id, label: "", nbCards: 0 });
  }

  function addDirectory() {
    db.directory.add({ label: "" });
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }

  .directory {
    width: 100%;
  }

  .listcontainer {
    margin: 0 0 1rem 2rem;
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 1px;
    padding: 0.25rem;
  }
</style>

<div class="container">
  {#each tree as dir}
    <input
      type="text"
      on:change={e => update('directory', dir, e.target.value)}
      value={dir.label}
      class="directory" />
    <div class="listcontainer">
      {#each dir.lists as list}
        <input
          type="text"
          on:change={e => update('list', list, e.target.value)}
          value={list.label}
          class="list" />
      {/each}
      <button class="button" on:click={e => addList(dir)}>
        Ajouter une liste
      </button>
    </div>
  {/each}
  <button class="button" on:click={addDirectory}>Ajouter un dossier</button>
</div>
