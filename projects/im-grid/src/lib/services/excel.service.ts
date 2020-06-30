import { Inject, Injectable } from '@angular/core';
import { utils, WorkBook, WorkSheet, write } from 'xlsx';
import { DOCUMENT } from '@angular/common';
import { ImColumn, ImColumnType } from '../models/column.model';
import { FormatService } from './format.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({ providedIn: 'root' })
export class ExcelService {
    constructor(
        private formatService: FormatService,
        @Inject(DOCUMENT) private document: any
    ) { }

    public exportAsExcelFile(rows: any[], excelFileName: string, columns: ImColumn[]): void {
        const rowsToExport = this.formatedRows(rows, columns);
        const worksheet: WorkSheet = utils.json_to_sheet(rowsToExport);

        worksheet['!cols'] = columns.map(column => ({ wpx: column.width / 1.2 }));
        const workbook: WorkBook = { Sheets: { ['data']: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const blob: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        const url = window.URL.createObjectURL(blob);
        const link = this.document.createElement('a');
        link.href = url;
        link.download = fileName + '.xlsx';

        this.document.body.appendChild(link);
        link.click();
        this.document.body.removeChild(link);
    }

    private formatedRows(rows: any[], columns: ImColumn[]): any[] {
        const formatedRows: any[] = [];
        const clonedRows = JSON.parse(JSON.stringify(rows));

        clonedRows.forEach(row => {
            const toFormatRow = {};
            columns.forEach(column => {

                const value = this.formatValue(column, row[column.key]);
                const type = this.getType(column, value);

                toFormatRow[column.title] = {
                    v: value,
                    t: type,
                };
            });
            formatedRows.push(toFormatRow);
        });
        return formatedRows;
    }

    private formatValue(column: ImColumn, value: any) {
        if (!value) {
            return '';
        }
        switch (column.columnType) {
            case ImColumnType.Boolean:
            case ImColumnType.Xml:
                return this.formatService.format(value, column);
            default: return value;
        }
    }

    private getType(column: ImColumn, value: any) {
        if (!value) {
            return 's';
        }

        switch (column.columnType) {
            case ImColumnType.Int:
            case ImColumnType.Decimal: return 'n';
            case ImColumnType.Date: return 'd';
            case ImColumnType.Boolean: return 'b';
            default: return 's';
        }
    }
}
