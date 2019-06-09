<script>
  export let data;
</script>

<figure>
  {#if data.image}
    <img src={data.image} alt={data.label} />
  {/if}
  <figcaption>
    <h1>{data.label}</h1>
  </figcaption>
</figure>
