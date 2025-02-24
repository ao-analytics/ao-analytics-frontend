<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, type TimeUnit } from "chart.js/auto";
  import "chartjs-adapter-date-fns";
  import { css } from "$lib/utils";
  import type { ItemMarketHistory } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  const { slug, history } = data;

  type T = ItemMarketHistory;

  const gridColor = `oklch(${css("--bc")}/0.1)`;
  const labelColor = `oklch(${css("--bc")}/0.6)`;
  const lineColor = `oklch(${css("--p")})`;

  const quality = {
    1: {
      color: "#928f8b",
      text: "Normal",
    },
    2: {
      color: "#d7dae4",
      text: "Good",
    },
    3: {
      color: "#ffb469",
      text: "Outstanding",
    },
    4: {
      color: "#fefefe",
      text: "Excellent",
    },
    5: {
      color: "#ffec75",
      text: "Masterpiece",
    },
  };

  let unit: TimeUnit = "day";
  let labelSelector = (x: T) => new Date(x.timestamp);
  let labelComparer = (
    a: ReturnType<typeof labelSelector>,
    b: ReturnType<typeof labelSelector>,
  ) => a.getTime() === b.getTime();
  let dataSelector = (x: T) => x.item_amount;
  let groupSelector = (x: T) => x.quality_level;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const labels = history
      ?.map((x) => labelSelector(x).getTime())
      .filter((x, i, arr) => arr.indexOf(x) === i)
      .map((x) => new Date(x));

    const datasets = history
      ?.reduce((r: { label: number; data: any[] }[], v) => {
        const key = groupSelector(v);

        const group = r.find((x) => x.label === key);

        if (group) {
          group.data.push(v);
        } else {
          r.push({
            label: key,
            data: [v],
          });
        }

        return r;
      }, [])
      .sort((a, b) => a.label - b.label)
      .map((r: { label: number; data: any[] }) => {
        return {
          label: r.label.toString(),
          data: labels?.map((label: Date) => {
            const entry = r.data.find((x) =>
              labelComparer(labelSelector(x), label),
            );
            return entry ? dataSelector(entry) : null;
          }),
          borderColor: quality[r.label as keyof typeof quality].color,
          backgroundColor: quality[r.label as keyof typeof quality].color,
        };
      });

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets || [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${quality[Number(ctx.dataset.label) as keyof typeof quality].text}: ${ctx.raw}`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            stacked: true,
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
            stacked: true,
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

<svelte:head>
  <title>{slug}</title>
</svelte:head>

<div class="w-full h-96">
  <canvas bind:this={canvas}> </canvas>
</div>
