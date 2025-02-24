export const prerender = false;

import { env } from "$env/dynamic/public";
import type { ItemMarketHistory } from "$lib";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, url }) => {
  try {
    let [item_data] = await Promise.all([
      fetch(
        `${env.PUBLIC_BACKEND_URL}/items/${params.slug}/history${url.search}`,
      ),
    ]);

    return {
      slug: params.slug,
      history: (await item_data.json()) as ItemMarketHistory[],
    };
  } catch (e) {}
};
