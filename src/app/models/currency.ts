export interface ExchangeRate {
  currency: string;
  rate: number;
}
export interface IResponse {
	result: string;
	documentation: string;
	terms_of_use: string;
	time_last_update_unix: number;
	time_last_update_utc: string;
	time_next_update_unix: number;
	time_next_update_utc: string;
	base_code: string;
	conversion_rates: Conversion_rates;
}
export interface Conversion_rates  {
  [key: string]: number
}
