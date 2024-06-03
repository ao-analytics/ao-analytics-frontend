<script lang="ts">
    import ItemBuyOrderStats from "$lib/components/ItemBuyOrderStats.svelte";
    import ItemSellOrderStats from "$lib/components/ItemSellOrderStats.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="flex justify-center">
    <div class="w-11/12 space-y-2">
        <div class="w-full border shadow border-neutral stats stats-vertical">
            <ItemSellOrderStats data={data.stats} />

            <ItemBuyOrderStats data={data.stats} />
        </div>
    </div>
</div>
