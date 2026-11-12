import { Pipe, PipeTransform, inject } from '@angular/core';
import { ImColumn } from '../models/column.model';
import { FormatService } from '../services/format.service';

@Pipe({
  standalone: true,
  name: 'format',
})
export class FormatPipe implements PipeTransform {
  private formatService = inject(FormatService);

  /** `trigger` only forces re-evaluation when language/locale change (pass `i18n.formatKey()`). */
  transform(value: any, column: ImColumn, trigger?: unknown): any {
    return this.formatService.format(value, column);
  }
}
