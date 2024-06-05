<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import type {
		ItemStatsByDay,
	} from "$lib/types";
	import { Chart } from "chart.js/auto";
	import "chartjs-adapter-date-fns";
	import { onMount } from "svelte";

	export let data: ItemStatsByDay[];
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		let response = await fetch(
			`${env.PUBLIC_BACKEND_URL}/statistics/items/${$page.params.slug}?group_by=hour`,
		);
		data = await response.json();

		new Chart(canvas, {
			type: "line",
			data: {
				labels: data.map((d) => d.date),
				datasets: [
					/*
					{
						label: "Maximum buy price",
						data: data.map((d) => d.max_unit_price_silver_request),
						borderColor: '#7480ff00',
            			backgroundColor: '#7480ff33',
						fill: "+1"
					},
					*/
					{
						label: "Average buy price",
						data: data.map((d) => d.avg_unit_price_silver_request),
						borderColor: "#7480ff",
					},
					{
						label: "Minimum buy price",
						data: data.map((d) => d.min_unit_price_silver_request),
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

<div class="shadow stat">
	<div class="stat-title">Buy Orders Stats By Last Update</div>
	<div class="stat-value">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>