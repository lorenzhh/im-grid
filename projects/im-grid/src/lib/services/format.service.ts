import { Injectable } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { ColumnType } from '../models/column.model';
import { SettingsService } from './settings.service';
import { translations } from '../components/table/translations/default-translations';
import { TimeFormats } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  ISO8601_DATE_REGEX
    = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

  constructor(
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe,
    private settingsService: SettingsService
  ) { }

  format(value: any, type: ColumnType, optional = false) {
    if (value == null) {
      return '';
    }
    switch (type) {
      case ColumnType.Xml:
        return optional ? this.formattedXml(value) : value;
      case ColumnType.Date:
        return ((typeof value === 'string') && value.match(this.ISO8601_DATE_REGEX))
          ? this.datePipe.transform(
            value,
            this.getTimeFormat()
          )
          : value;
      case ColumnType.Boolean: {
        return this.translateLanguage(value);
      }
      case ColumnType.Currency: {
        return this.currencyPipe.transform(value, 'EUR', 'symbol-narrow');
      }
      case ColumnType.Decimal: {
        return this.decimalPipe.transform(value, '1.2-2', this.settingsService.locale);
      }
      default:
        return value;
    }
  }

  private translateLanguage(value: any) {
    return this.isTrue(value)
      ? translations.yes[this.settingsService.language]
      : translations.no[this.settingsService.language];
  }

  private isTrue(value: any): boolean {
    return (value === 1 || value === '1' || value === true || value === 'true');
  }

  private getTimeFormat(): string {
    return TimeFormats[this.settingsService.locale];
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
