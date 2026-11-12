import { ImColumn, ImColumnType, ImFilterType } from '../models/column.model';

/** Columns whose values are text a user would search for (not images, colours or child rows). */
/** Columns worth offering in pickers (column chooser, "search in"): no avatars, none without a title. */
export const isListableColumn = (column: ImColumn, hasTitle: boolean): boolean =>
  hasTitle && column.columnType !== ImColumnType.Avatar;

export const isSearchableColumn = (column: ImColumn): boolean =>
  !column.childrenConfig &&
  column.columnType !== ImColumnType.Avatar &&
  column.columnType !== ImColumnType.Color;

export const rowShouldBeFiltered = <T>(row: T, column: ImColumn): boolean => {
  if (column.filter.type === ImFilterType.RangeNumber) {
    return isInRange(row[column.key], column.filter.values);
  }

  if (column.filter.type === ImFilterType.RangeDate) {
    return isInDateRange(row[column.key], column.filter.values);
  }
  if (row[column.key] == null) {
    return false;
  }
  if (column.filter.type === ImFilterType.Rating) {
    return row[column.key] === column.filter.values[0];
  }
  if (column.filter.type === ImFilterType.Select) {
    if (Array.isArray(row[column.key])) {
      return column.filter.values.find((filterValue: any) =>
        row[column.key].find((item) =>
          filterValue && typeof filterValue === 'object'
            ? filterValue[column.valueProperty] === item[column.valueProperty]
            : filterValue === item
        )
      );
    }
    return column.filter.values.find((value: any) =>
      row[column.key].toString().includes(value)
    );
  }
  return row[column.key].toString().includes(column.filter.values[0]);
};

export const isInRange = (
  cellValue: any,
  values: string[] | Date[] | number[]
): boolean => {
  const from = values[0];
  const to = values[1];
  let gtThan = false;
  let smThan = false;
  if (cellValue != null) {
    if ((isNumber(from) && +cellValue >= +from) || from == null) {
      gtThan = true;
    }
    if ((isNumber(to) && +cellValue <= +to) || to == null) {
      smThan = true;
    }
  }
  return gtThan && smThan;
};

export const isInDateRange = (
  cellValue: any,
  values: string[] | Date[] | number[]
): boolean => {
  const from: string | Date = values[0] as Date;
  const to: string | Date = values[1] as Date;

  const check = new Date(cellValue);
  if (isDate(check)) {
    return check.getTime() <= to.getTime() && check.getTime() >= from.getTime();
  }
  return false;
};

export const isNumber = (value: any): boolean => {
  return value != null && !isNaN(parseFloat(value)) && isFinite(value);
};

export const isDate = (value: any): boolean => {
  const timestamp = Date.parse(value);

  return !isNaN(timestamp);
};

/** Returns a sorted copy of `rows`; empty values sort first when ascending. */
export const sortRows = <T>(rows: T[], sortKey: string, ascending: boolean): T[] =>
  [...rows].sort((rowA, rowB) => {
    const firstValue = rowA[sortKey];
    const secondValue = rowB[sortKey];

    if (firstValue === secondValue) {
      return 0;
    }
    if (firstValue === null || firstValue === '' || firstValue === undefined) {
      return ascending ? -1 : 1;
    }
    if (secondValue === null || secondValue === '' || secondValue === undefined) {
      return ascending ? 1 : -1;
    }
    if (typeof firstValue === 'string' && typeof secondValue === 'string') {
      return ascending
        ? firstValue.localeCompare(secondValue)
        : secondValue.localeCompare(firstValue);
    }
    if (typeof firstValue === 'number' || typeof firstValue === 'boolean') {
      if (firstValue < secondValue) {
        return ascending ? -1 : 1;
      }
      if (firstValue > secondValue) {
        return ascending ? 1 : -1;
      }
    }
    return 0;
  });
