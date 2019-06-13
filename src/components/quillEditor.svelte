<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let placeholder;
  export let content;

  let el, editor, container;
  let dispatch = createEventDispatcher();
  onMount(() => {
    editor = new Quill(el, {
      placeholder,
      modules: {
        toolbar: [
          ["bold", "italic", "underline"], // toggled buttons

          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],

          ["clean"] // remove formatting button
        ]
      },
      theme: "snow",
      scrollingContainer: container
    });
    editor.root.innerHTML = content;
    editor.on("text-change", (delta, old, source) => {
      if (source == "user") dispatch("change", editor.root.innerHTML);
    });
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  :global(.ql-container) {
    height: initial;
    flex-grow: 1;
  }
</style>

<div class="container" bind:this={container}>
  <div bind:this={el} />
</div>
