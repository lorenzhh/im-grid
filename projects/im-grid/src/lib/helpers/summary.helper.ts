import { ImSummaryContext, ImSummaryFn } from '../models/summary.model';

const isEmpty = (value: unknown) => value == null || value === '';

const toNumbers = (values: unknown[]): number[] =>
  values
    .filter(value => !isEmpty(value))
    .map(value => (typeof value === 'number' ? value : Number(value)))
    .filter(value => Number.isFinite(value));

/** Comparable number for numbers and dates (ISO strings, timestamps, Date objects). */
const toComparable = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : Date.parse(String(value));
};

const extreme = (values: unknown[], pickLarger: boolean): unknown => {
  let result: unknown = null;
  let resultComparable = NaN;
  for (const value of values) {
    if (isEmpty(value)) {
      continue;
    }
    const comparable = toComparable(value);
    if (Number.isNaN(comparable)) {
      continue;
    }
    if (
      Number.isNaN(resultComparable) ||
      (pickLarger ? comparable > resultComparable : comparable < resultComparable)
    ) {
      result = value;
      resultComparable = comparable;
    }
  }
  return result;
};

/**
 * Ready-made column summaries, labelled in the grid's language.
 *
 * @example { key: 'amount', columnType: ImColumnType.Decimal, summary: ImSummary.sum }
 */
export const ImSummary: {
  /** Sum of the numeric values. */
  sum: ImSummaryFn;
  /** Average of the numeric values. */
  average: ImSummaryFn;
  /** Number of non-empty values. */
  count: ImSummaryFn;
  /** Smallest number or earliest date. */
  min: ImSummaryFn;
  /** Largest number or latest date. */
  max: ImSummaryFn;
} = {
  sum: ({ values, texts }: ImSummaryContext) => {
    const numbers = toNumbers(values);
    return {
      label: texts.sum,
      value: numbers.length ? numbers.reduce((total, value) => total + value, 0) : null,
    };
  },
  average: ({ values, texts }: ImSummaryContext) => {
    const numbers = toNumbers(values);
    return {
      label: texts.average,
      value: numbers.length
        ? numbers.reduce((total, value) => total + value, 0) / numbers.length
        : null,
    };
  },
  count: ({ values, texts }: ImSummaryContext) => ({
    label: texts.count,
    value: values.filter(value => !isEmpty(value)).length,
  }),
  min: ({ values, texts }: ImSummaryContext) => ({
    label: texts.min,
    value: extreme(values, false),
  }),
  max: ({ values, texts }: ImSummaryContext) => ({
    label: texts.max,
    value: extreme(values, true),
  }),
};
