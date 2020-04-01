import { Injectable } from '@angular/core';
import { Column, FilterType } from '../models/column.model';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    public rowShouldBeFiltered(row: any[], column: Column): boolean {
        if (column.filter.type === FilterType.RangeNumber
        ) {
            return this.isInRange(row[column.key], column.filter.values);
        }

        if (column.filter.type === FilterType.RangeDate
        ) {
            return this.isInDateRange(row[column.key], column.filter.values);
        }
        if (row[column.key] == null) {
            return false;
        }
        if (column.filter.type === FilterType.Select
        ) {
            return column.filter.values.find((value: any) => row[column.key].toString().includes(value));
        }
        return row[column.key].toString().includes(column.filter.values[0]);
    }

    private isInRange(cellValue: any, values: string[] | Date[] | number[]): boolean {
        const from = values[0];
        const to = values[1];
        let gtThan = false;
        let smThan = false;
        if (cellValue != null) {
            if ((this.isNumber(from) && +cellValue >= +from) || from == null) {
                gtThan = true;
            }
            if ((this.isNumber(to) && +cellValue <= +to) || to == null) {
                smThan = true;
            }
        }
        return gtThan && smThan;
    }

    private isInDateRange(cellValue: any, values: string[] | Date[] | number[]): boolean {
        const from: string | Date = values[0] as Date;
        const to: string | Date = values[1] as Date;

        const check = new Date(cellValue);
        if (this.isDate(check)) {
            return check.getTime() <= to.getTime() && check.getTime() >= from.getTime();
        }
        return false;
    }

    private isNumber(value: any): boolean {
        return value != null && !isNaN(parseFloat(value)) && isFinite(value);
    }

    private isDate(value: any): boolean {
        const timestamp = Date.parse(value);

        return !isNaN(timestamp);
    }
}
