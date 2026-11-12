import type { ImText } from '../i18n/im-grid-i18n';
import type { ImGridTexts } from '../i18n/im-grid-texts';
import type { ImColumn } from './column.model';

/** What a column's `summary` callback receives. */
export interface ImSummaryContext<T = any> {
  /** Rows currently displayed (after search and column filters, in display order). */
  rows: T[];
  /** All rows, including pending (unsaved) additions and edits, ignoring filters. */
  allRows: T[];
  /** This column's values of the displayed rows (`rows.map(row => row[column.key])`). */
  values: unknown[];
  /** The column the summary is computed for. */
  column: ImColumn;
  /** The grid's texts in the current language (e.g. for labels). */
  texts: ImGridTexts;
}

/** A summary value with a small label shown in front of it, e.g. `{ label: 'Sum', value: 1200 }`. */
export interface ImSummaryValue {
  label?: ImText;
  /** Numbers, dates and strings are formatted like the column's cells. */
  value: unknown;
}

/**
 * What a `summary` callback may return:
 * - a number / date / string: formatted like the column's cells
 * - `{ label, value }`: the same, with a small label in front
 * - a per-language object (`{ en: 'Total', ar: 'المجموع' }`): translated
 * - `null` / `undefined`: empty cell
 */
export type ImSummaryResult = ImSummaryValue | ImText | number | Date | null | undefined;

export type ImSummaryFn<T = any> = (context: ImSummaryContext<T>) => ImSummaryResult;
