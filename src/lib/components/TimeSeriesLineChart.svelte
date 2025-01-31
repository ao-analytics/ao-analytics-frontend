<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, type TimeUnit } from "chart.js/auto";
  import "chartjs-adapter-date-fns";
  import { css } from "$lib/utils";

  type T = { date: Date; count: number };

  const gridColor = `oklch(${css("--bc")}/0.1)`;
  const labelColor = `oklch(${css("--bc")}/0.6)`;
  const lineColor = `oklch(${css("--p")})`;

  export let data: T[];
  export let unit: TimeUnit = "week";
  export let labelSelector = (x: T) => new Date(x.date);
  export let dataSelector = (x: T) => x.count;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Chart(canvas, {
      type: "line",
      data: {
        labels: data.map(labelSelector),
        datasets: [
          {
            data: data.map(dataSelector),
            borderColor: lineColor,
            borderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: unit,
            },
            grid: {
              display: false,
              tickColor: gridColor,
              color: gridColor,
            },
            ticks: {
              color: labelColor,
            },
          },
          y: {
            title: {
              display: false,
            },
            grid: {
              color: gridColor,
              tickColor: gridColor,
            },
            ticks: {
              color: labelColor,
            },
            border: {
              color: gridColor,
            },
          },
        },
        animation: false,
      },
    });
  });
</script>

<canvas bind:this={canvas}> </canvas>
