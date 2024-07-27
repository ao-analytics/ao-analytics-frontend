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
                        borderColor: "#7480ff",
                        backgroundColor: "#7480ff",
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
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            source: "auto",
                            color: "#d6d6d6",
                        },
                    },
                    y: {
                        title: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            source: "auto",
                            color: "#d6d6d6",
                        },
                    },
                },
                borderColor: "#ebebeb",
                backgroundColor: "#ebebeb",
            },
        });
    });
</script>

<div class="shadow stat">
    <div class="stat-title text-secondary">Market Orders By Last Update</div>
    <div class="stat-value">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>
