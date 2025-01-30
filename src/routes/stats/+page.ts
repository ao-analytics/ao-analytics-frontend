import { env } from "$env/dynamic/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    let [
      market_order_count,
      market_order_count_offer,
      market_order_count_request,
      market_history_count,
    ] = await Promise.all([
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`,
      ),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`,
      ),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/histories/count`),
    ]);

    return {
      market_order_count: (await market_order_count.json()).count,
      market_order_count_offer: (await market_order_count_offer.json()).count,
      market_order_count_request: (await market_order_count_request.json())
        .count,
      market_history_count: (await market_history_count.json()).count,
    };
  } catch (e) {}
};
