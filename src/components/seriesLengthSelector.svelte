<script>
  import { seriesLength } from "../stores";
</script>

<style>
  .serieslength {
    padding: 0.5rem;
    text-align: center;
  }
</style>

<div class="serieslength">
  <label>
    Nombre de cartes
    <select bind:value={$seriesLength}>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={40}>40</option>
      <option value={50}>50</option>
    </select>
  </label>
</div>
