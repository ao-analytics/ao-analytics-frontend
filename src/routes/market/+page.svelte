<script lang="ts">
  import type { PageData } from "./$types";
  import { env } from "$env/dynamic/public";
  import {
    narrow_relative_time_formatter,
    standard_number_formatter,
  } from "$lib/utils";
  import type { MarketOrder } from "$lib";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { loadFiltersFromUrl, filters, type Filter } from "$lib/stores";

  export let data: PageData;

  let { locations } = data;

  const tiers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const enchantments: number[] = [0, 1, 2, 3, 4];
  const qualities = [
    { name: "Normal", value: 1 },
    { name: "Good", value: 2 },
    { name: "Outstanding", value: 3 },
    { name: "Excellent", value: 4 },
    { name: "Masterpiece", value: 5 },
  ];

  let orders: Promise<MarketOrder[]>;

  onMount(async () => {
    loadFiltersFromUrl(page.url.searchParams);

    filters.subscribe((filters) => {
      let keys = Object.keys(filters) as (keyof Filter)[];
      for (const key of keys) {
        const value = filters[key];
        if (!value) {
          page.url.searchParams.delete(key);
          continue;
        }
        page.url.searchParams.set(key, value.toString());
      }

      goto(page.url, {
        keepFocus: true,
      });
    });

    orders = get_prices();
  });

  const get_prices = async () => {
    let url = new URL(`${env.PUBLIC_BACKEND_URL}/orders`);
    url.searchParams.set("auction_type", "offer");
    url.searchParams.set("limit", $filters.page_size.toString());
    url.searchParams.set(
      "offset",
      ($filters.page * $filters.page_size).toString(),
    );

    let keys = Object.keys($filters) as (keyof Filter)[];
    for (const key of keys) {
      const value = $filters[key];
      if (!value) continue;

      url.searchParams.set(key, value.toString());
    }

    const res = await fetch(url).catch(console.log);

    if (!res) return [];

    const json = (await res.json().catch(console.log)) as MarketOrder[] | void;

    if (!json) return [];

    return json.map((order) => {
      order.updated_at = new Date(order.updated_at);
      order.created_at = new Date(order.created_at);
      order.expires_at = new Date(order.expires_at);
      return order;
    });
  };

  const get_date_diff_hours = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  };

  const get_date_diff_days = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };
</script>

<svelte:head>
  <title>Market</title>
</svelte:head>

<form
  class="flex justify-center join"
  on:submit|preventDefault={() => (orders = get_prices())}
>
  <input
    type="text"
    placeholder="Search by name"
    class="input input-bordered join-item"
    bind:value={$filters.item_name}
  />

  <select class="select select-bordered join-item" bind:value={$filters.tier}>
    <option value={undefined} selected>Tier</option>
    {#each tiers as tier}
      <option>{tier}</option>
    {/each}
  </select>
  <select
    class="select select-bordered join-item"
    bind:value={$filters.enchantment_level}
  >
    <option value={undefined} selected>Enchantment</option>
    {#each enchantments as enchantment}
      <option>{enchantment}</option>
    {/each}
  </select>
  <select
    class="select select-bordered join-item"
    bind:value={$filters.quality_level}
  >
    <option value={undefined} selected>Quality</option>
    {#each qualities as quality}
      <option value={quality.value}>{quality.name}</option>
    {/each}
  </select>
  <select
    class="select select-bordered join-item"
    bind:value={$filters.location_id}
  >
    <option value={undefined} selected>Location</option>
    {#each data.locations as location}
      <option value={location.id}>{location.name}</option>
    {/each}
  </select>
  <button class="btn join-item">Search</button>
</form>

<div class="h-full overflow-auto">
  <table class="table">
    <thead class="text-lg">
      <tr>
        <th>Image</th>
        <th>Item</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Last update</th>
        <th>Expires</th>
        <th>Location</th>
      </tr>
    </thead>
    {#if orders}
      {#await orders then orders}
        <tbody>
          {#each orders as order, i}
            <tr class="hover:bg-base-200 h-14">
              <td>
                <img
                  class="w-10"
                  src={`${env.PUBLIC_RENDER_URL}/v1/item/${order.item_unique_name}.png?quality=${order.quality_level}&size=32`}
                  alt="item"
                />
              </td>
              <td>
                {order.item_unique_name}
              </td>
              <td
                >{standard_number_formatter.format(order.unit_price_silver)}</td
              >
              <td>{order.amount}</td>
              <td
                >{narrow_relative_time_formatter.format(
                  get_date_diff_hours(order.updated_at),
                  "hours",
                )}</td
              >
              <td
                >{narrow_relative_time_formatter.format(
                  get_date_diff_days(order.expires_at),
                  "days",
                )}</td
              >
              <td>{locations.find((l) => l.id === order.location_id)?.name}</td>
            </tr>
          {/each}
        </tbody>
      {/await}
    {/if}
  </table>
</div>

<div class="flex justify-center pb-2">
  <div class="join">
    <button
      class="join-item btn"
      on:click={() => {
        if ($filters.page > 0) $filters.page--;
        orders = get_prices();
      }}>«</button
    >
    <button class="join-item btn">Page {$filters.page}</button>
    <button
      class="join-item btn"
      on:click={() => {
        $filters.page++;
        orders = get_prices();
      }}>»</button
    >
  </div>
</div>
