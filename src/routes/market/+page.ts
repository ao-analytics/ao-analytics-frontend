import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Location } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(
        `${PUBLIC_BACKEND_URL}/locations?min_market_orders=1`,
    ).catch(console.log);

    if (!res) return {
        locations: []
    }

    const json = await res.json().catch(console.log) as Location[] | void

    if (!json) return {
        locations: []
    }

    return {
        locations: json
    }
}

