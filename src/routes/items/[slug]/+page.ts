import { env } from "$env/dynamic/public";
import type { ItemStatsByDay } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/items/${params.slug}?group_by=hour`,
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

