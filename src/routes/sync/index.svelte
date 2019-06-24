<script>
  import AddFolderSync from "../../components/addFolderSync.svelte";
  import ListFolderSync from "../../components/listFolderSync.svelte";
</script>

<style>
  .container {
    width: 100%;
    position: relative;
  }

  .separator {
    margin: 1rem;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
      margin: auto;
    }
  }
</style>

<svelte:head>
  <title>Sync - Flash Me</title>
</svelte:head>

<div class="container">
  <AddFolderSync />
  <h3 class="separator">OU</h3>
  <ListFolderSync />
</div>
