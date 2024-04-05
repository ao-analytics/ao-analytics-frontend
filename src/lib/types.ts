export interface MarketOrderCountByItem {
	item_unique_name: string;
	count: number;
}

export interface MarketOrderCountByLocation {
	location: string;
	count: number;
}

export interface MarketOrderCountByAuctionType {
	auction_type: string;
	count: number;
}

export interface MarketOrderCountByUpdatedAt {
	date: Date;
	count: number;
}

export interface MarketOrderCountByUpdatedAtAndLocation {
	date: Date;
	location: string;
	count: number;
}

export interface MarketOrderCount {
	count: number;
}

export interface LocalizedNames {
	item_unique_name: string;
	en_us: string;
	de_de: string;
	fr_fr: string;
	ru_ru: string;
	pl_pl: string;
	es_es: string;
	pt_br: string;
	it_it: string;
	zh_cn: string;
	ko_kr: string;
	ja_jp: string;
	zh_tw: string;
	id_id: string;
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

export interface ItemData {
	unique_name: string;
	enchantment_level: number;
	tier: number;
	shop_sub_category: string;
	weight: number;
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