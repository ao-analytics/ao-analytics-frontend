<script lang="ts">
    import { PUBLIC_BACKEND_URL as BACKEND_URL } from "$env/static/public";
	import type { MarketOrderCountByAuctionType } from "$lib/types";
	import { onMount } from "svelte";
    import { compact_number_formatter, standard_number_formatter } from '$lib/utils/formatters';
    
    let data: MarketOrderCountByAuctionType | undefined;

    const get_data = async () => {
        let response = await fetch(
            `${BACKEND_URL}/statistics/orders/count`,
        );

        return response.json();
    }

    onMount(async() => {
        data = await get_data();
    })
</script>

<div class="shadow stat">
    <div class="stat-figure text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            viewBox="0 -960 960 960"
            width="40"
            class="fill-primary"
            ><path
                d="M480-142.117q-145 0-241.441-40.307-96.442-40.307-96.442-101.422V-680q0-56.922 98.98-97.499Q340.078-818.076 480-818.076q139.615 0 238.845 40.577 99.231 40.577 99.231 97.499v396.154q0 60.807-96.788 101.268T480-142.117Zm0-464.114q85.346 0 172.884-24.077Q740.423-654.385 759.346-683q-18.539-29.385-105.538-54.25-87-24.865-173.808-24.865-87.154 0-173.75 24.019t-106.173 53.557q19.5 30.5 105.404 54.404Q391.385-606.231 480-606.231Zm0 203.385q40.5.192 79.885-3.808 39.384-4 75.577-11.788 36.192-7.789 68.403-18.924 32.212-11.134 58.25-25.519v-151.309q-26.038 14.885-58 26.673-31.961 11.789-68.25 19.885-36.288 8.096-75.577 12.096-39.288 4-80.288 4-41.577 0-81.615-4.192-40.039-4.193-76.289-12.289t-67.711-19.692q-31.462-11.596-56.308-26.481v151.309q25.346 13.885 56.961 25.077 31.616 11.192 67.866 18.981 36.25 7.788 76.038 11.885 39.789 4.096 81.058 4.096Zm0 204.769q48.693 0 96.019-6.577 47.327-6.577 86.039-17.846 38.711-11.269 65.538-26.365 26.827-15.096 34.519-31.443v-126.309q-26.038 14.077-58.25 25.365-32.211 11.289-68.557 18.924-36.346 7.634-75.577 11.634T480-346.886q-41.577 0-81.615-4.096-40.039-4.096-76.135-11.789-36.096-7.692-67.712-18.827-31.615-11.134-56.461-25.327v127.233q7.692 16.731 33.866 31.327 26.173 14.596 64.884 25.865 38.711 11.269 86.192 17.846 47.481 6.577 96.981 6.577Z"
            /></svg
        >
    </div>
    <div class="stat-title">Market Orders</div>
    <div class="stat-value text-primary {data ? "" : "invisible"}">
        {compact_number_formatter.format(
            data?.count ?? 0,
        )}
    </div>
    <div class="stat-desc {data ? "" : "invisible"}">
        {standard_number_formatter.format(
            data?.count ?? 0,
        )}

        Market Orders
    </div>
</div>