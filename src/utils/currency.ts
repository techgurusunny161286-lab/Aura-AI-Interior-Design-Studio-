import { Currency } from '../types/interior';

export const USD_TO_INR_RATE = 86; // Current conversion rate

/**
 * Formats a monetary value given in base USD according to the selected currency.
 */
export function formatCurrency(amountUSD: number, currency: Currency = 'INR'): string {
  if (currency === 'INR') {
    const inrValue = Math.round(amountUSD * USD_TO_INR_RATE);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(inrValue);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amountUSD);
}

/**
 * Format direct INR value
 */
export function formatDirectINR(amountINR: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountINR);
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'INR' ? '₹' : '$';
}
