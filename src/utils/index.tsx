import { MonetaryValue, PlanInterval } from 'API';
import { DateTime } from 'luxon';
import { formatPhoneNumber } from 'react-phone-number-input';
import NumberFormat from 'react-number-format';
import { IPlansTableData } from 'containers/Dashboard/Plans/PlansTable/PlansTable';

export const constructDashboardRoutes = (subdomain: string) => {
  return {
    OVERVIEW: `/business/${subdomain}/overview`,
    PURCHASES: `/business/${subdomain}/purchases`,
    PRODUCTS: `/business/${subdomain}/products`,
    PLANS: `/business/${subdomain}/plans`,
    COUPONS: `/business/${subdomain}/coupons`,
    FINANCIALS: `/business/${subdomain}/financials`,
    CUSTOMERS: `/business/${subdomain}/customers`,
    SETTINGS: `/business/${subdomain}/settings`,
    LOCATION: `/business/${subdomain}/location/:urlSubdomain`,
  };
};

export function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}

export const removeNullProp = (obj: any) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
};

export const percentFormat = (val: string) => `% ` + val;
export const percentParse = (val: string) => val.replace(/^\%/, '');

export const moneyFormat = (val: string) => `$ ` + val;
export const moneyParse = (val: string) => val.replace(/^\$/, '');

// Aug 8, 2021
export const displayableDate = (epochTimeStr: string) =>
  DateTime.fromMillis(parseInt(epochTimeStr)).toLocaleString(DateTime.DATE_MED);

// Aug 8
export const displayableDateMonthDay = (epochTimeStr: string) =>
  DateTime.fromMillis(parseInt(epochTimeStr))
    .toLocaleString(DateTime.DATE_MED)
    .split(',')[0]
    .trim();

// 12:00pm
export const displayableTime = (epochTimeStr: string) =>
  DateTime.fromMillis(parseInt(epochTimeStr))
    .toLocaleString(DateTime.DATETIME_SHORT)
    .split(',')[1]
    .trim();

export const displayableMonetaryValue = (monetaryValue: MonetaryValue | null | undefined) => {
  if (!monetaryValue) {
    return `--`;
  }

  const { symbol } = monetaryValue.currency;
  const cents: number = monetaryValue.amount;
  const isNegative = cents < 0;
  const centsToDollars = (Math.abs(cents) / 100).toFixed(2);

  return !isNegative ? (
    <NumberFormat
      value={centsToDollars}
      decimalSeparator="."
      displayType="text"
      decimalScale={2}
      thousandSeparator={true}
      prefix={symbol}
    />
  ) : (
    <>
      <span>(</span>
      <NumberFormat
        value={centsToDollars}
        decimalSeparator="."
        displayType="text"
        decimalScale={2}
        thousandSeparator={true}
        prefix={symbol}
      />
      <span>)</span>
    </>
  );
};

export const displayPhoneNumber = (phoneNumber: string | null | undefined) => {
  if (!phoneNumber) {
    return '';
  }

  const phoneNumberWithCountryCode = !phoneNumber.startsWith('+')
    ? `+1${phoneNumber}`
    : phoneNumber;

  return formatPhoneNumber(phoneNumberWithCountryCode);
};

export const displayPercentage = (rate: number) => {
  return `${rate * 100}%`;
};

export const toCamelCase = (title: string | null | undefined, delimiter?: string) => {
  if (!title) {
    return '';
  }
  const words = title.split(delimiter || '_');
  const manipulatedWords = words.map((word) => word[0].toUpperCase() + word.toLowerCase().slice(1));
  return manipulatedWords.join(' ');
};

export const displayablePlanInterval = (interval: PlanInterval) => {
  switch (interval) {
    case PlanInterval.WEEKLY:
      return 'Weekly';
    case PlanInterval.MONTHLY:
      return 'Monthly';
    default:
      return 'Unknown';
  }
};
