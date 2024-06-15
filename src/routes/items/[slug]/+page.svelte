<script lang="ts">
    import ItemMarketHistory from "$lib/components/ItemMarketHistory.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    let { history } = data;
</script>

<div class="flex justify-center">
    <div class="w-11/12 space-y-2">
        <div class="w-full border shadow border-neutral stats stats-vertical">
            <ItemMarketHistory data={history} />
        </div>
    </div>
</div>
