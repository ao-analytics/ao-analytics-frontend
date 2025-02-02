export interface MarketOrderCountByUpdatedAt {
  date: Date;
  count: number;
}

export interface MarketOrderCountByUpdatedAtAndLocation {
  date: Date;
  location: string;
  count: number;
}

export interface MarketOrder {
  id: number;
  item_unique_name: string;
  location_id: string;
  quality_level: number;
  enchantment_level: number;
  unit_price_silver: number;
  amount: number;
  auction_type: string;
  expires_at: Date;
  updated_at: Date;
  created_at: Date;
}

export interface Location {
  id: string;
  name: string;
}

export interface ItemStatsByDay {
  date: Date;
  item_unique_name: string;
  total_count: number;
  max_unit_price_silver_request: number;
  min_unit_price_silver_request: number;
  avg_unit_price_silver_request: number;
  sum_amount_request: number;
  max_unit_price_silver_offer: number;
  min_unit_price_silver_offer: number;
  avg_unit_price_silver_offer: number;
  sum_amount_offer: number;
}

export interface ItemStatsByDayAndLocation {
  date: Date;
  item_unique_name: string;
  location_id: string;
  total_count: number;
  max_unit_price_silver_request: number;
  min_unit_price_silver_request: number;
  avg_unit_price_silver_request: number;
  sum_amount_request: number;
  max_unit_price_silver_offer: number;
  min_unit_price_silver_offer: number;
  avg_unit_price_silver_offer: number;
  sum_amount_offer: number;
}

export interface ItemMarketHistory {
  item_unique_name: string;
  location_id: string;
  timestamp: Date;
  quality_level: number;
  item_amount: number;
  silver_amount: number;
  updated_at: Date;
}

export interface ItemMarketHistoryCountByTimestamp {
  date: Date;
  count: number;
}

export interface ItemMarketHistoryCountByTimestampAndLocation {
  date: Date;
  location: string;
  count: number;
}
