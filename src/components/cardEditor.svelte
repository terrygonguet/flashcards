<script>
  import db from "../db";
  import { lists } from "../stores";
  export let card;

  function update(field, value) {
    return db.card
      .update(card.id, { [field]: value })
      .then(id => (card[field] = value));
  }

  function remove() {
    if (confirm("Etes vous sur(e) ?")) {
      return db.card.delete(card.id);
    }
  }

  function removeImage() {
    return update("image", null);
  }

  function addImage(e) {
    let fr = new FileReader();
    let file = e.target.files[0];
    if (file) {
      fr.onload = () => update("image", fr.result);
      fr.readAsDataURL(file);
    }
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-rows: minmax(auto, 40%) 1fr 1fr auto auto;
    position: relative;
    grid-gap: 0.5rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  .removeimage {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0.25rem;
    padding: 0.25rem;
    margin: 2rem;
    background-color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
  }

  .urlcontainer {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  textarea {
    width: 100%;
  }

  .btncontainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .button {
    width: 48%;
  }

  .delete {
    border-color: red;
    background-color: crimson;
  }

  @media (min-width: 768px) {
    .container {
      width: 30rem;
      position: relative;
      margin: auto;
    }
  }
</style>

<div class="container">
  {#if card.image}
    <div class="removeimage" on:click={removeImage}>❌</div>
    <img src={card.image} alt={card.notion} />
  {:else}
    <div class="urlcontainer">
      <input
        type="text"
        placeholder="Image URL (facultatif)"
        on:change={e => update('image', e.target.value)} />
      OU
      <label class="button">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          on:change={addImage}
          style="display:none" />
        Photo
      </label>
    </div>
  {/if}
  <textarea
    value={card.notion}
    on:change={e => update('notion', e.target.value)}
    placeholder="Notion" />
  <textarea
    value={card.explication}
    on:change={e => update('explication', e.target.value)}
    placeholder="Explication" />
  <div class="btncontainer">
    <a href="editor/cards" class="button delete" on:click={remove}>Supprimer</a>
    <a href="editor/cards" class="button">Confirmer</a>
  </div>
</div>
