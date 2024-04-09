<script lang="ts">
    import type { MarketOrderCount } from "$lib/types";
    import { compact_number_formatter, standard_number_formatter } from '$lib/utils/formatters';
    
    export let data: MarketOrderCount | undefined;
</script>

<div class="stat">
    <div class="stat-figure text-primary">
        <slot name="icon"></slot>
    </div>
    <div class="stat-title">
        <slot name="title"></slot>
    </div>
    <div class="stat-value text-primary {data ? "" : "invisible"}">
        {compact_number_formatter.format(
            data?.count ?? 0,
        )}
    </div>
    <div class="stat-desc {data ? "" : "invisible"}">
        {standard_number_formatter.format(
            data?.count ?? 0,
        )}

        <slot name="description"></slot>
    </div>
</div>