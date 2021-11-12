import CURRENCY from './CURRENCY';

const formatPrice = (price, currencyCode) => {
  if (price === 0) return 'Free';

  return new Intl.NumberFormat(currencyCode, {
    style: 'currency',
    currency: CURRENCY[currencyCode].currency,
    currencyDisplay: 'code',
  }).format(price);
};

export default formatPrice;
