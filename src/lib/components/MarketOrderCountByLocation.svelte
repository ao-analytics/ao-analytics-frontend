<script lang="ts">
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import type { MarketOrderCountByLocation } from "$lib/types";
	import { Chart, Colors } from "chart.js/auto";
	import { onMount } from "svelte";

	let data: MarketOrderCountByLocation[];
	export let minAmount: number;
	let canvas: HTMLCanvasElement;

	onMount(async() => {
		let response = await fetch(
			`${BACKEND_URL}/statistics/orders?group_by=location`,
		);
		data = await response.json();

		data = data.filter((d) => d.count > minAmount);

		new Chart(canvas, {
			type: "bar",
			data: {
				labels: data.map((d) => d.location),
				datasets: [
					{
						data: data.map((d) => d.count),
						borderRadius: 7,
						backgroundColor: [
							"#7480ff",
							"#6873e5",
							"#5c66cc",
							"#5159b2",
							"#454c99",
							"#3a407f",
							"#2e3366",
							"#292d5b",
						],
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						grid: {
							display: false
						}
					},
				},
				borderColor: "#1D232A",
				backgroundColor: "#7480ff",
				animation: false,
			},
		});
	});
</script>

<div class="stat-title">Market Orders By Location</div>
<div class="stat-value">
	<canvas bind:this={canvas}> </canvas>
</div>
