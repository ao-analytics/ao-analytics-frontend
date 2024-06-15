<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
    import type { ItemMarketHistory } from "$lib/types";
    import { Chart } from "chart.js/auto";
    import "chartjs-adapter-date-fns";
    import { onMount } from "svelte";
    import ItemBuyOrderStats from "./ItemBuyOrderStats.svelte";
    import Layout from "../../routes/+layout.svelte";

    export let data: ItemMarketHistory[];
    let canvas: HTMLCanvasElement;

    onMount(async () => {
        let labels = new Array(...new Set(data.map((d) => d.timestamp)));

        let sum_item_amount = labels.map((label) => {
            return data
                .filter((d) => d.timestamp === label)
                .reduce((acc, d) => acc + d.item_amount, 0);
        });

        let avg_prices = labels.map((label) => {
            let items = data.filter((d) => d.timestamp === label);
            return Math.round(
                items.reduce(
                    (acc, d) => acc + d.silver_amount / d.item_amount,
                    0,
                ) / items.length,
            );
        });

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Avg price",
                        data: avg_prices,
                        borderWidth: 1,
                        backgroundColor: "#ff7480",
                        borderColor: "#ff7480",
                        type: "line",
                        yAxisID: "y_avg_price",
                    },
                    {
                        label: "Items sold",
                        data: sum_item_amount,
                        backgroundColor: "#7480ff",
                        borderColor: "#7480ff",
                        borderWidth: 1,
                        yAxisID: "y_item_amount",
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
                        stacked: true,
                        offset: true,
                        ticks: {
                            source: "data",
                        },
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
                    y_item_amount: {
                        stacked: true,
                        title: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        position: "left",
                    },
                    y_avg_price: {
                        position: "right",
                        title: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });
    });
</script>

<div class="shadow stat">
    <div class="stat-title">Market History</div>
    <div class="stat-value">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>
