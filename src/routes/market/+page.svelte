<script lang="ts">
	import type { PageData } from "./$types";
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import { narrow_relative_time_formatter } from "$lib/utils/formatters";
	import { standard_number_formatter } from "$lib/utils/formatters";
	import type { MarketOrder } from "$lib/types";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import {
		loadFiltersFromUrl,
		filters,
		type Filter,
	} from "$lib/stores/filter";

	export let data: PageData;

	let { locations } = data;

	let tiers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
	let enchantments: number[] = [0, 1, 2, 3, 4];
	let qualities: { name: string; value: number }[] = [
		{ name: "Normal", value: 1 },
		{ name: "Good", value: 2 },
		{ name: "Outstanding", value: 3 },
		{ name: "Excellent", value: 4 },
		{ name: "Masterpiece", value: 5 },
	];

	let current_page = 0;
	let page_size = 20;
	let orders: Promise<MarketOrder[]>;

	onMount(async () => {
		loadFiltersFromUrl($page.url.searchParams);

		orders = get_prices();

		filters.subscribe((filters) => {
			let keys = Object.keys(filters) as (keyof Filter)[];
			for (const key of keys) {
				const value = filters[key];
				if (!value) {
					$page.url.searchParams.delete(key);
					continue;
				}
				$page.url.searchParams.set(key, value.toString());
			}

			goto($page.url, {
				keepFocus: true,
			});
		});
	});

	const get_prices = async () => {
		let requestURL = new URL(`${BACKEND_URL}/orders`);
		requestURL.searchParams.set("auction_type", "offer");
		requestURL.searchParams.set("limit", page_size.toString());
		requestURL.searchParams.set(
			"offset",
			(current_page * page_size).toString(),
		);

		let keys = Object.keys($filters) as (keyof Filter)[];
		for (const key of keys) {
			const value = $filters[key];
			if (!value) continue;

			requestURL.searchParams.set(key, value.toString());
		}

		const res = await fetch(requestURL).catch(console.log);

		if (!res) return [];

		const json = (await res.json().catch(console.log)) as
			| MarketOrder[]
			| void;

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

<form
	class="flex justify-center join"
	on:submit|preventDefault={() => (orders = get_prices())}
>
	<label
		class="flex items-center gap-2 input input-bordered input-neutral join-item"
	>
		<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" ><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
		<input
			type="text"
			placeholder="Search by name"
			bind:value={$filters.item_name}
		/>
	</label>
	
	<div class="dropdown join-item">
		<button type="button" tabindex="0" class="btn join-item">Filters</button>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div tabindex="0" class="z-[1] dropdown-content menu rounded-box join join-vertical">
			<select
				class="select select-bordered join-item"
				bind:value={$filters.tier}
			>
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
		</div>
	</div>
	<button class="btn join-item"> Search </button>
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
									src={`https://render.albiononline.com/v1/item/${order.item_unique_name}.png?quality=${order.quality_level}&size=128`}
									alt="item"
								/>
							</td>
							<td>
								{order.item_unique_name}
							</td>
							<td
								>{standard_number_formatter.format(
									order.unit_price_silver,
								)}</td
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
							<td
								>{locations.find(
									(l) => l.id === order.location_id,
								)?.name}</td
							>
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
				if (current_page > 0) current_page--;
				orders = get_prices();
			}}>«</button
		>
		<button class="join-item btn">Page {current_page}</button>
		<button
			class="join-item btn"
			on:click={() => {
				current_page++;
				orders = get_prices();
			}}>»</button
		>
	</div>
</div>