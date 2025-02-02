import { env } from "$env/dynamic/public";
import { get, writable } from "svelte/store";

export interface Filter {
  item_name?: string;
  location_id?: string;
  tier?: number;
  enchantment_level?: number;
  quality_level?: number;
  page: number;
  page_size: number;
}

export const filters = writable<Filter>({
  item_name: "",
  page: 0,
  page_size: 10,
});

export function loadFiltersFromUrl(params: URLSearchParams) {
  filters.update((filters) => {
    let keys = Object.keys(filters) as (keyof Filter)[];

    for (const key of keys) {
      const param = params.get(key);
      if (!param) continue;

      if (!isNaN(parseInt(param))) {
        filters = {
          ...filters,
          [key]: parseInt(param),
        };
        continue;
      }

      filters = {
        ...filters,
        [key]: param,
      };
    }

    return filters;
  });
}
