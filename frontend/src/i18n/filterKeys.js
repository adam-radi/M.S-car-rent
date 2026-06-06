/** Internal filter values — always English keys; labels come from i18n */
export const ANY_MAKE = '__ANY_MAKE__';
export const ANY_MODEL = '__ANY_MODEL__';
export const ANY_TRANSMISSION = '__ANY_TRANSMISSION__';
export const PRICING_ALL = '__PRICING_ALL__';
export const PRICING_UNDER = '__UNDER_300__';
export const PRICING_RANGE = '__300_600__';
export const PRICING_OVER = '__600_PLUS__';
export const ALL_CARS = '__ALL_CARS__';

export const pricingKeyFromUrl = (searchParams) => {
  const minPrice = searchParams.get('dailyPrice[gte]');
  const maxPrice = searchParams.get('dailyPrice[lte]');
  if (maxPrice === '300') return PRICING_UNDER;
  if (minPrice === '300' && maxPrice === '600') return PRICING_RANGE;
  if (minPrice === '600') return PRICING_OVER;
  return PRICING_ALL;
};

export const appendPricingToParams = (pricingKey, queryParams) => {
  if (pricingKey === PRICING_UNDER) queryParams.append('dailyPrice[lte]', 300);
  if (pricingKey === PRICING_RANGE) {
    queryParams.append('dailyPrice[gte]', 300);
    queryParams.append('dailyPrice[lte]', 600);
  }
  if (pricingKey === PRICING_OVER) queryParams.append('dailyPrice[gte]', 600);
};
