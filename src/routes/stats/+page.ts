import { env } from "$env/dynamic/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    let [
      market_order_count,
      market_order_offer_count,
      market_order_request_count,
      market_history_count,
      market_order_count_by_updated_at,
    ] = await Promise.all([
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`,
      ),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`,
      ),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/histories/count`),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders?group_by=week`),
    ]);

    return {
      market_order_count: await market_order_count.text(),
      market_order_offer_count: await market_order_offer_count.text(),
      market_order_request_count: await market_order_request_count.text(),
      market_history_count: await market_history_count.text(),
      market_order_count_by_updated_at:
        await market_order_count_by_updated_at.json(),
    };
  } catch (e) {}
};
