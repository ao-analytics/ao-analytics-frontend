import { PUBLIC_BACKEND_URL, PUBLIC_INTERNAL_URL } from "$env/static/public";
import type { MarketOrderCount, MarketOrderCountByAuctionType, MarketOrderCountByUpdatedAt, MarketOrderCountByUpdatedAtAndLocation } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {

  try {
    let requests = await Promise.all([
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders?group_by=updated_at`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders?group_by=updated_at, location`),
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
