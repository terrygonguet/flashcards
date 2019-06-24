<script>
  import { directories, lists, selectedList, selectedCard } from "../../stores";
  import db, { clearDirectory } from "../../db";
  import { tick, onMount } from "svelte";
  import ensureQuill from "./_ensureQuill";

  onMount(() => {
    // reset "parameter" stores
    $selectedCard = null;
    $selectedList = null;
    ensureQuill();
  });

  $: tree = $directories.map(dir => ({
    ...dir,
    lists: $lists.filter(l => l.directory == dir.id)
  }));

  function update(collection, obj, label) {
    return db[collection].update(obj.id, { label });
  }

  async function addList(dir) {
    let id = await db.list.add({ directory: dir.id, label: "", nbCards: 0 });
    await tick();
    document.querySelector("#list" + id).focus();
  }

  async function addDirectory() {
    let id = await db.directory.add({ label: "" });
    await tick();
    document.querySelector("#dir" + id).focus();
  }

  async function handleKeydown(collection, obj, e) {
    if (!e.target.value && e.key == "Backspace") {
      if (collection == "directory") await clearDirectory(obj);
      else await db[collection].delete(obj.id);
      await tick();
      focusClosestTo(obj);
    } else if (e.key == "Enter") {
      let id = obj.directory || obj.id;
      await update(collection, obj, e.target.value);
      await addList({ id });
    }
  }

  function focusClosestTo(obj) {
    let target = obj.id - 1;
    if (obj.directory) {
      // if obj is a list
      let dir = tree.find(d => d.id == obj.directory);
      if (!dir.lists.length)
        document.querySelector("#dir" + obj.directory).focus();
      else {
        let closest = dir.lists.reduce(
          (acc, cur) => (cur.id < obj.id && cur.id > acc.id ? cur : acc),
          dir.lists[0]
        );
        document.querySelector("#list" + closest.id).focus();
      }
    } else {
      if (!tree.length) return;
      let closest = tree.reduce(
        (acc, cur) => (cur.id < obj.id && cur.id > acc.id ? cur : acc),
        tree[0]
      );
      document.querySelector("#dir" + closest.id).focus();
    }
  }
</script>

<style>
  .tuto {
    margin: 0.5rem 0;
  }

  input {
    padding: 1px;
  }

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

  .list {
    display: flex;
    flex-direction: row;
    margin: 0.2rem 0;
  }
  .listlabel {
    flex-grow: 1;
  }
  .listedit {
    font-size: 1.2rem;
    text-decoration: none;
    margin: 0 0 0 0.2rem;
  }

  button {
    margin: 1px;
    padding: 0.25rem;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
      position: relative;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>

<div class="container">
  <span class="tuto">
    Entrée pour ajouter une liste, Retour arrière pour supprimer.
  </span>
  {#each tree as dir}
    <input
      type="text"
      on:change={e => update('directory', dir, e.target.value)}
      on:keydown={e => handleKeydown('directory', dir, e)}
      placeholder="Retour pour supprimer"
      value={dir.label}
      class="directory"
      id={'dir' + dir.id} />
    <div class="listcontainer" id={'container' + dir.id}>
      {#each dir.lists as list}
        <span class="list">
          <input
            type="text"
            on:change={e => update('list', list, e.target.value)}
            on:keydown={e => handleKeydown('list', list, e)}
            placeholder="Retour pour supprimer"
            value={list.label}
            class="listlabel"
            id={'list' + list.id} />
          <a
            href="editor/cards"
            on:click={e => ($selectedList = list)}
            class="listedit">
            📝
          </a>
        </span>
      {/each}
    </div>
  {/each}
  <button class="button" on:click={addDirectory}>Ajouter un dossier</button>
</div>
