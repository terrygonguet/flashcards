<script>
  import { lists, directories, selectedLists, cards } from "../stores";
  import ToggleNotion from "../components/toggleNotion.svelte";

  $: tree = $directories.map(dir => ({
    ...dir,
    lists: $lists.filter(l => l.directory == dir.id)
  }));

  $: selectedDirectories = Object.fromEntries(
    tree.map(dir => {
      let allChecked = dir.lists.every(l => $selectedLists.includes(l.id));
      return [dir.id, allChecked];
    })
  );

  $: nbCards = Object.fromEntries(
    $lists.map(l => {
      let nb = $cards.reduce(
        (acc, cur) => (cur.list == l.id ? acc + 1 : acc),
        0
      );
      return [l.id, nb];
    })
  );

  function toggleDirectory(id, checked) {
    $lists.forEach(l => {
      if (l.directory == id) {
        if (checked && $selectedLists.indexOf(l.id) == -1)
          $selectedLists = [...$selectedLists, l.id];
        else if (!checked)
          $selectedLists = $selectedLists.filter(sl => sl != l.id);
      }
    });
  }
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .listlist {
    margin: 0 0 1rem 2rem;
  }
  .listlist li {
    margin: 0.25rem 0;
  }
  .listlist li label {
    padding: 0.25rem;
    border: 1px solid grey;
    border-radius: 0.25rem;
    width: 100%;
    display: block;
  }

  .dirlabel {
    padding: 0.25rem;
    border: 1px solid grey;
    border-radius: 0.25rem;
  }

  .separator {
    margin: auto 0 0 0;
  }

  .button {
    margin: 0;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
      position: relative;
      margin: auto;
    }
    .separator {
      margin: 0;
    }
  }
</style>

<svelte:head>
  <title>Home - Flash Me</title>
</svelte:head>

<div class="container">
  {#each tree as directory}
    <label class="dirlabel">
      <input
        type="checkbox"
        on:change={e => toggleDirectory(directory.id, e.target.checked)}
        checked={selectedDirectories[directory.id]} />
       {directory.label}
    </label>
    <ul class="listlist">
      {#each directory.lists as list}
        <li>
          <label>
            <input
              type="checkbox"
              bind:group={$selectedLists}
              value={list.id} />
             {list.label} - {nbCards[list.id]} cartes
          </label>
        </li>
      {:else}
        <li>Dossier vide</li>
      {/each}
    </ul>
  {:else}
    <p>Pas de dossier</p>
  {/each}
  <div class="separator" />
  <ToggleNotion />
  <a href="learn" class:disabled={$selectedLists.length == 0} class="button">
    GO
  </a>
</div>
