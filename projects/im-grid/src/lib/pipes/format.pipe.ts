import { Pipe, PipeTransform } from '@angular/core';
import { ColumnType } from '../models/column.model';
import { FormatService } from '../services/format.service';
import { Settings } from '../services/settings.service';

@Pipe({
  name: 'format'
})

export class FormatPipe implements PipeTransform {

  constructor(private formatService: FormatService) { }

  transform(value: any, type: ColumnType, trigger?: Settings): any {
    return this.formatService.format(value, type);
  }
}
