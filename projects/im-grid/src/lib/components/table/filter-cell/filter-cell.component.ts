import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ImGridI18n } from '../../../i18n/im-grid-i18n';
import { ImColumn, ImColumnType, ImFilterType } from '../../../models/column.model';
import { FormatPipe } from '../../../pipes/format.pipe';
import { TypeofPipe } from '../../../pipes/typeof.pipe';

@Component({
  imports: [
    FormsModule,
    TypeofPipe,
    FormatPipe,
    NzDatePickerModule,
    NzSelectModule,
    NzRateModule,
    NzInputModule,
  ],
  selector: 'im-filter-cell',
  templateUrl: './filter-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-cell.component.css'],
})
export class ImFilterCellComponent {
  readonly i18n = inject(ImGridI18n);
  readonly texts = this.i18n.texts;

  readonly column = input<ImColumn>(undefined);

  /** Emits the complete, new list of filter values whenever the user changes them. */
  readonly valuesChange = output<any[]>();

  /**
   * Local copy of the filter values. It follows the column input, so anything that replaces
   * the column (e.g. "clear filters") resets the inputs, and user edits are emitted upwards
   * instead of mutating the column.
   */
  readonly values = linkedSignal<any[]>(() => this.column()?.filter?.values ?? []);

  /** Model for the select filter: a list for multi-select / array columns, a single value otherwise. */
  readonly selectModel = computed(() => {
    const column = this.column();
    return column.filter.multiSelect || column.columnType === ImColumnType.Array
      ? this.values()
      : this.values()[0];
  });

  ImFilterType = ImFilterType;
  ImColumnType = ImColumnType;

  setValue(index: number, value: unknown) {
    const next = [...this.values()];
    next[index] = value;
    this.commit(next);
  }

  setValues(value: unknown) {
    this.commit(Array.isArray(value) ? value : value == null ? [] : [value]);
  }

  private commit(values: any[]) {
    this.values.set(values);
    this.valuesChange.emit(values);
  }
}
