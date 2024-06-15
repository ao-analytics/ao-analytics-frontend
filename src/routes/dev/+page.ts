import { env } from "$env/dynamic/public";
import type {
  MarketOrderCount,
  MarketOrderCountByAuctionType,
  MarketOrderCountByUpdatedAt,
  MarketOrderCountByUpdatedAtAndLocation,
} from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    let [
      market_order_count,
      market_order_count_offer,
      market_order_count_request,
      market_order_count_by_updated_at,
      market_order_count_by_updated_at_and_location,
      market_history_count,
    ] = await Promise.all([
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`,
      ),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`,
      ),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders?group_by=day`),
      fetch(
        `${env.PUBLIC_BACKEND_URL}/statistics/orders?group_by=day, location`,
      ),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/histories/count`),
    ]);

    return {
      market_order_count: (await market_order_count.json()) as MarketOrderCount,
      market_order_count_offer:
        (await market_order_count_offer.json()) as MarketOrderCountByAuctionType,
      market_order_count_request:
        (await market_order_count_request.json()) as MarketOrderCountByAuctionType,
      market_order_count_by_updated_at:
        (await market_order_count_by_updated_at.json()) as MarketOrderCountByUpdatedAt[],
      market_order_count_by_updated_at_and_location:
        (await market_order_count_by_updated_at_and_location.json()) as MarketOrderCountByUpdatedAtAndLocation[],
      market_history_count:
        (await market_history_count.json()) as MarketHistoryCount,
    };
  } catch (e) {
    console.log(e);
  }
};
