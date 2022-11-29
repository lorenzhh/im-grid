import { ImColumn, ImFilterType } from '../models/column.model';

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
