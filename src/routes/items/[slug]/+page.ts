export const prerender = false;

import { env } from "$env/dynamic/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  try {
    let [item_data] = await Promise.all([
      fetch(`${env.PUBLIC_BACKEND_URL}/items/${params.slug}/data `),
    ]);

    return {
      item_data: await item_data.json(),
    };
  } catch (e) {}
};
