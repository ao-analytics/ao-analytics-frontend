<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  const { item_data } = data;
</script>

<svelte:head>
  <title>{item_data["@uniquename"]}</title>
</svelte:head>

<pre>{JSON.stringify(item_data, null, 4)}</pre>
