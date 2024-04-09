<script lang="ts">
	import { page } from "$app/stores";
	import type { PageData } from "./$types";
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import type {
		MarketOrderCountByUpdatedAt,
		ItemStatsByDay,
	} from "$lib/types";
	import { Chart } from "chart.js/auto";
	import "chartjs-adapter-date-fns";
	import { onMount } from "svelte";

	let data: ItemStatsByDay[];
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		let response = await fetch(
			`${BACKEND_URL}/statistics/items/${$page.params.slug}?group_by=updated_at`,
		);
		data = await response.json();

		new Chart(canvas, {
			type: "line",
			data: {
				labels: data.map((d) => d.date),
				datasets: [
					/*
					{
						label: "Maximum sell price",
						data: data.map((d) => d.max_unit_price_silver_offer),
						borderColor: '#7480ff00',
            			backgroundColor: '#7480ff33',
						fill: "+1"
					},
					*/
					{
						label: "Average sell price",
						data: data.map((d) => d.avg_unit_price_silver_offer),
						borderColor: "#7480ff",
					},
					{
						label: "Minimum sell price",
						data: data.map((d) => d.min_unit_price_silver_offer),
						borderColor: "#7480ff33",
						backgroundColor: "#7480ff33",
						fill: "-1",
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				spanGaps: true,
				plugins: {
					legend: {
						display: false,
					},
				},
				animation: false,
				scales: {
					x: {
						type: "time",
						time: {
							unit: "hour",
						},
						title: {
							display: true,
						},
						grid: {
							display: false,
						},
					},
					y: {
						title: {
							display: false,
						},
						grid: {
							display: false,
						},
					},
				},
				borderColor: "#7480ff",
				backgroundColor: "#7480ff",
			},
		});
	});
</script>

<div class="stat-title">Sell Orders Stats By Last Update</div>
<div class="stat-value">
	<canvas bind:this={canvas}></canvas>
</div>
