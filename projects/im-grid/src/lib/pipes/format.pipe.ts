import { Pipe, PipeTransform } from '@angular/core';
import { ImColumnType, ImColumn } from '../models/column.model';
import { FormatService } from '../services/format.service';
import { Settings } from '../services/settings.service';

@Pipe({
  name: 'format'
})

export class FormatPipe implements PipeTransform {

  constructor(private formatService: FormatService) { }

  transform(value: any, column: ImColumn, trigger?: Settings): any {
    return this.formatService.format(value, column);
  }
}
