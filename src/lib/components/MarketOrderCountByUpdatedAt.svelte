<script lang="ts">
    import type { MarketOrderCountByUpdatedAt } from "$lib/types";
    import { Chart } from "chart.js/auto";
    import "chartjs-adapter-date-fns";
    import { onMount } from "svelte";

    export let data: MarketOrderCountByUpdatedAt[];
    let canvas: HTMLCanvasElement;

    onMount(async () => {
        new Chart(canvas, {
            type: "line",
            data: {
                labels: data.map((d) => d.date),
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
                            unit: "day",
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
    <div class="stat-title">Market Orders By Last Update</div>
    <div class="stat-value">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>
