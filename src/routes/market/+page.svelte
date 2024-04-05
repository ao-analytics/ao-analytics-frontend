<script lang="ts">
	import type { PageData } from "./$types";
	import { writable } from "svelte/store";
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import { narrow_relative_time_formatter } from "$lib/utils/formatters";
	import { standard_number_formatter } from "$lib/utils/formatters";
	import type { MarketOrder } from "$lib/types";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

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

	let filters = writable<{
		name: string;
		location?: string;
		tier?: number;
		enchantment?: number;
		quality?: number;
	}>({
		name: "",
	});

	let current_page = 0;
	let page_size = 20;
	let orders: Promise<MarketOrder[]>;

	onMount(async () => {
		filters.set({
			name: $page.url.searchParams.get("name") || "",
			location: $page.url.searchParams.get("location") || undefined,
			tier: $page.url.searchParams.get("tier")
				? parseInt($page.url.searchParams.get("tier")!)
				: undefined,
			enchantment: $page.url.searchParams.get("enchantment")
				? parseInt($page.url.searchParams.get("enchantment")!)
				: undefined,
			quality: $page.url.searchParams.get("quality")
				? parseInt($page.url.searchParams.get("quality")!)
				: undefined,
		});

        orders = get_prices();

		filters.subscribe((value) => {
			$page.url.searchParams.set("name", value.name);
			if (value.tier) {
				$page.url.searchParams.set("tier", value.tier.toString());
			}
			if (value.enchantment) {
				$page.url.searchParams.set(
					"enchantment",
					value.enchantment.toString(),
				);
			}
			if (value.quality) {
				$page.url.searchParams.set("quality", value.quality.toString());
			}
			if (value.location) {
				$page.url.searchParams.set("location", value.location);
			}

			for (let key of Object.keys(value) as (keyof typeof value)[]){
				if (!value[key]) {
					$page.url.searchParams.delete(key);
				}
			}

			goto($page.url, {
				keepFocus: true,
			});
		});
	});

	const get_prices = async () => {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		let from_string = yesterday.toISOString().split("T")[0];

        let requestURL = new URL(`${BACKEND_URL}/orders`);
        requestURL.searchParams.set("item_name", $filters.name);
        requestURL.searchParams.set("auction_type", "offer");
        requestURL.searchParams.set("limit", page_size.toString());
        requestURL.searchParams.set("from", from_string);
        requestURL.searchParams.set("offset", (current_page * page_size).toString());

        if ($filters.enchantment)
            requestURL.searchParams.set("enchantment_level", $filters.enchantment.toString());
		if ($filters.tier)
			requestURL.searchParams.set("tier", $filters.tier.toString());
        if ($filters.quality)
            requestURL.searchParams.set("quality_level", $filters.quality.toString());
        if ($filters.location)
            requestURL.searchParams.set("location_id", $filters.location);

		const res = await fetch(requestURL);

		const json = (await res.json()) as MarketOrder[];

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

<div class="flex flex-col h-screen">
	<form
		class="flex justify-around w-full" on:submit|preventDefault={() => orders = get_prices()}
	>
		<input
			class="input input-bordered"
			type="text"
			bind:value={$filters.name}
		/>

		<select class="select select-bordered" bind:value={$filters.tier}>
			<option value={undefined} selected>Tier</option>
			{#each tiers as tier}
				<option>{tier}</option>
			{/each}
		</select>

		<select
			class="select select-bordered"
			bind:value={$filters.enchantment}
		>
			<option value={undefined} selected>Enchantment</option>
			{#each enchantments as enchantment}
				<option>{enchantment}</option>
			{/each}
		</select>

		<select class="select select-bordered" bind:value={$filters.quality}>
			<option value={undefined} selected>Quality</option>
			{#each qualities as quality}
				<option value={quality.value}>{quality.name}</option>
			{/each}
		</select>

		<select class="select select-bordered" bind:value={$filters.location}>
			<option value={undefined} selected>Location</option>
			{#each data.locations as location}
				<option value={location.id}>{location.name}</option>
			{/each}
		</select>

		<button class="btn"> ⟳ </button>
	</form>

	<div class="h-full overflow-auto">
		<table class="table table-pin-rows">
			<thead class="text-lg">
				<tr>
					<th></th>
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
										class="h-12"
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
	<div class="flex justify-center w-full join">
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
</div>
