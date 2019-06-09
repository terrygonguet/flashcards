<script>
import { showNotion } from "../stores";
</script>

<style>
.togglenotion {
  padding: 0.5rem;
  text-align: center;
}
</style>

<div class="togglenotion">
  <label>
    Notion
    <input type="radio" bind:group={$showNotion} value={true} />
  </label>
  |
  <label>
    <input type="radio" bind:group={$showNotion} value={false} />
    Explication
  </label>
</div>