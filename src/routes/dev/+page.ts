import { env } from "$env/dynamic/public";
import type { MarketOrderCount, MarketOrderCountByAuctionType, MarketOrderCountByUpdatedAt, MarketOrderCountByUpdatedAtAndLocation } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    let requests = await Promise.all([
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders?group_by=hour`),
      fetch(`${env.PUBLIC_BACKEND_URL}/statistics/orders?group_by=hour, location`),
    ]);

    let [
      market_order_count,
      market_order_count_offer,
      market_order_count_request,
      market_order_count_by_updated_at,
      market_order_count_by_updated_at_and_location
    ] = await Promise.all(requests.map(response => response.json()))

    return {
      market_order_count: market_order_count as MarketOrderCount,
      market_order_count_offer: market_order_count_offer as MarketOrderCountByAuctionType,
      market_order_count_request: market_order_count_request as MarketOrderCountByAuctionType,
      market_order_count_by_updated_at: market_order_count_by_updated_at as MarketOrderCountByUpdatedAt[],
      market_order_count_by_updated_at_and_location: market_order_count_by_updated_at_and_location as MarketOrderCountByUpdatedAtAndLocation[]
    }
  } catch (e) {
    console.log(e)
  }
};
