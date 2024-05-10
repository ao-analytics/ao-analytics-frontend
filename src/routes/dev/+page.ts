import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { MarketOrderCount, MarketOrderCountByAuctionType, MarketOrderCountByUpdatedAt, MarketOrderCountByUpdatedAtAndLocation } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {
  let time_interval = url.searchParams.get('time_interval') || 'hour';

  try {
    let [
      market_order_count,
      market_order_count_offer,
      market_order_count_request,
      market_order_count_by_updated_at,
      market_order_count_by_updated_at_and_location
    ] = await Promise.all([
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=offer`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders/count?auction_type=request`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders?group_by=${time_interval}`),
      fetch(`${PUBLIC_BACKEND_URL}/statistics/orders?group_by=${time_interval}, location`),
    ]);

    return {
      market_order_count: await market_order_count.json() as MarketOrderCount,
      market_order_count_offer: await market_order_count_offer.json() as MarketOrderCountByAuctionType,
      market_order_count_request: await market_order_count_request.json() as MarketOrderCountByAuctionType,
      market_order_count_by_updated_at: await market_order_count_by_updated_at.json() as MarketOrderCountByUpdatedAt[],
      market_order_count_by_updated_at_and_location: await market_order_count_by_updated_at_and_location.json() as MarketOrderCountByUpdatedAtAndLocation[]
    }
  } catch (e) {
    console.log(e)
  }
};
