import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ImColumn, ImColumnType } from '../models/column.model';
import { ImGridI18n } from '../i18n/im-grid-i18n';

/** Provided per grid (it follows that grid's language and locale). */
@Injectable()
export class FormatService {
  private datePipe = inject(DatePipe);
  private decimalPipe = inject(DecimalPipe);
  private currencyPipe = inject(CurrencyPipe);
  private i18n = inject(ImGridI18n);

  ISO8601_DATE_REGEX =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

  format(value: any, column: ImColumn, optional = false) {
    if (value == null) {
      return '';
    }
    switch (column.columnType) {
      case ImColumnType.Xml:
        return optional ? this.formattedXml(value) : value;
      case ImColumnType.Date:
        return typeof value === 'string' && value.match(this.ISO8601_DATE_REGEX)
          ? this.datePipe.transform(
              value,
              column.showSeconds
                ? this.getTimeFormat()
                : this.getTimeFormat().replace(':ss', '')
            )
          : value;
      case ImColumnType.Boolean: {
        return this.translateLanguage(value);
      }
      case ImColumnType.Currency: {
        return this.currencyPipe.transform(value, 'EUR', 'symbol-narrow');
      }
      case ImColumnType.Array: {
        return this.mapKeys(value, column.labelProperty);
      }
      case ImColumnType.Object: {
        return value[column.labelProperty];
      }
      case ImColumnType.Decimal: {
        return this.decimalPipe.transform(value, '1.2-2', this.i18n.locale());
      }
      default:
        return value;
    }
  }

  private translateLanguage(value: any) {
    return this.isTrue(value)
      ? this.i18n.texts().yes
      : this.i18n.texts().no;
  }

  private mapKeys(array: any[], property: string) {
    return array.map(item => (item && typeof item === 'object' ? item[property] : item));
  }

  private isTrue(value: any): boolean {
    return value === 1 || value === '1' || value === true || value === 'true';
  }

  private getTimeFormat(): string {
    return this.i18n.dateTimeFormat();
  }

  private formattedXml(xml: string): string {
    let formatted = '';
    let indent = '';
    const tab = '\t';
    xml.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) {
        indent += tab;
      }
    });
    return formatted.substring(1, formatted.length - 3);
  }
}
