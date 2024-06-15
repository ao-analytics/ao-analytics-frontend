import { env } from "$env/dynamic/public";
import type { ItemMarketHistory } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params, url }) => {
  const res = await fetch(
    `${env.PUBLIC_BACKEND_URL}/items/${params.slug}/history${url.search}`,
  ).catch(console.log);

  if (!res)
    return {
      history: [],
    };

  const json = (await res.json().catch(console.log)) as
    | ItemMarketHistory[]
    | void;

  if (!json)
    return {
      history: [],
    };

  return {
    history: json,
  };
};
