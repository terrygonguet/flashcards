<script>
  import Header from "../components/header.svelte";
  export let segment;
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main > :nth-child(2) {
    padding: 1rem;
    flex-grow: 1;
    position: relative;
  }
</style>

<main>
  <Header />
  <slot />
</main>
