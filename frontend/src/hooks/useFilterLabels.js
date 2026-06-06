import { useTranslation } from 'react-i18next';
import {
  ANY_MAKE,
  ANY_MODEL,
  ANY_TRANSMISSION,
  PRICING_ALL,
  PRICING_UNDER,
  PRICING_RANGE,
  PRICING_OVER,
} from '../i18n/filterKeys';

export const useFilterLabels = () => {
  const { t } = useTranslation();

  const pricingLabel = (key) => {
    switch (key) {
      case PRICING_UNDER:
        return t('filters.pricingUnder300');
      case PRICING_RANGE:
        return t('filters.pricing300to600');
      case PRICING_OVER:
        return t('filters.pricing600plus');
      default:
        return t('filters.pricingAll');
    }
  };

  const normalizeString = (v) => (typeof v === 'string' ? v.toLowerCase() : v);

  const formatTransmissionLabel = (value) => {
    if (!value || normalizeString(value) === normalizeString(ANY_TRANSMISSION)) {
      return t('filters.anyTransmission');
    }
    const normalized = String(value);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  };

  const displayMake = (value) => (normalizeString(value) === normalizeString(ANY_MAKE) ? t('filters.anyMakes') : value);
  const displayModel = (value) => (normalizeString(value) === normalizeString(ANY_MODEL) ? t('filters.anyModels') : value);


  const pricingOptions = [PRICING_ALL, PRICING_UNDER, PRICING_RANGE, PRICING_OVER];

  return {
    pricingLabel,
    formatTransmissionLabel,
    displayMake,
    displayModel,
    pricingOptions,
    ANY_MAKE,
    ANY_MODEL,
    ANY_TRANSMISSION,
    PRICING_ALL,
    PRICING_UNDER,
    PRICING_RANGE,
    PRICING_OVER,
  };
};
