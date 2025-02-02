import { env } from "$env/dynamic/public";
import type { Location } from "$lib";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(
    `${env.PUBLIC_BACKEND_URL}/locations?min_market_orders=1`,
  ).catch(console.log);

  if (!res)
    return {
      locations: [],
    };

  const json = (await res.json().catch(console.log)) as Location[] | void;

  if (!json)
    return {
      locations: [],
    };

  return {
    locations: json,
  };
};
