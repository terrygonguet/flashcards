<script>
  import AddFolderSync from "../../components/addFolderSync.svelte";
  import ListFolderSync from "../../components/listFolderSync.svelte";
</script>

<style>
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin: auto;
  }

  .separator {
    margin: 1rem;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
      justify-content: center;
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
