<script lang="ts">
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import type { MarketOrderCountByUpdatedAt } from "$lib/types";
	import { Chart } from "chart.js/auto";
	import "chartjs-adapter-date-fns";
	import { onMount } from "svelte";

	let data: MarketOrderCountByUpdatedAt[];
	let canvas: HTMLCanvasElement;

	onMount(async() => {

		let response = await fetch(
			`${BACKEND_URL}/statistics/orders?group_by=updated_at`,
		);
		data = await response.json();

		new Chart(canvas, {
			type: "line",
			data: {
				labels: data.map((d) => d.updated_at),
				datasets: [
					{
						data: data.map((d) => d.count),
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

<div class="stat-title">Market Orders By Last Update</div>
<div class="stat-value">
	<canvas bind:this={canvas}></canvas>
</div>


