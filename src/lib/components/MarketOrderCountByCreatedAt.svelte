<script lang="ts">
	import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import type { MarketOrderCountByCreatedAt } from "$lib/types";
	import { Chart } from "chart.js/auto";
	import 'chartjs-adapter-date-fns';
	import { onMount } from "svelte";

	let data: MarketOrderCountByCreatedAt[];
	let canvas: HTMLCanvasElement;

	onMount(async() => {
		let response = await fetch(
			`${BACKEND_URL}/statistics/orders?group_by=created_at`,
		);
		data = await response.json();
		
		new Chart(canvas, {
			type: "line",
			data: {
				labels: data.map(
					(d) => new Date(d.created_at),
				),
				datasets: [
					{
						data: data.map(
							(d) => d.count,
						),
						borderColor: "#7480ff",
						backgroundColor: "#7480ff"
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
							unit: "day",
						},
						title: {
							display: true,
						},
                        grid: {
                            display: false
                        }
					},
					y: {
						title: {
							display: false,
						},
                        grid: {
                            display: false
                        }
					},
				},
			},
		});
	});
</script>

<div class="shadow stat">
	<div class="stat-title">Market Orders By Creation Date</div>
	<div class="stat-value">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>


