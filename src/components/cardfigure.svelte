<script>
  export let data;
</script>

<style>
  figure {
    font-size: 150%;
  }

  img {
    width: 100%;
    border-radius: 0.25rem;
  }
</style>

<figure>
  {#if data.image}
    <img src={data.image} alt="image" />
  {/if}
  <figcaption>
    {@html data.label}
  </figcaption>
</figure>
