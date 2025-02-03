<script lang="ts">
  import {
    compact_number_formatter,
    standard_number_formatter,
  } from "$lib/utils/formatters";

  export let data: number | undefined;
  export let title: string;
</script>

<div class="stat w-full">
  <div class="stat-figure text-primary">
    <slot></slot>
  </div>
  <div class="stat-title">{title}</div>
  <div class="stat-value text-primary">
    {#if data}
      {compact_number_formatter.format(data)}
    {:else}
      N/A
    {/if}
  </div>
  <div class="stat-desc">
    {#if data}
      {standard_number_formatter.format(data)}
    {:else}
      N/A
    {/if}
  </div>
</div>
