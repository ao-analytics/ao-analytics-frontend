import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ItemStatsByDay } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(
        `${PUBLIC_BACKEND_URL}/statistics/items/${params.slug}?group_by=hour`,
    ).catch(console.log);

    if (!res) return {
        stats: []
    }

    const json = await res.json().catch(console.log) as ItemStatsByDay[] | void

    if (!json) return {
        stats: []
    }

    return {
        stats: json
    }
}

