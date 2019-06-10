<script>
  export let data;
</script>

<style>
  img {
    width: 100%;
    border-radius: 0.25rem;
  }
</style>

<figure>
  {#if data.image}
    <img src={data.image} alt={data.label} />
  {/if}
  <figcaption>
    <h1>{data.label}</h1>
  </figcaption>
</figure>
