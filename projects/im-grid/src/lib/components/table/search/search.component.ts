import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { isListableColumn, isSearchableColumn } from '../../../helpers/table.helper';
import { ImColumn } from '../../../models/column.model';
import { ImTextPipe } from '../../../pipes/text.pipe';
import { ImGridI18n } from '../../../i18n/im-grid-i18n';

@Component({
  imports: [
    ImTextPipe,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzPopoverModule,
    NzCheckboxModule,
  ],
  selector: 'im-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImSearchComponent {
  private directionality = inject(Directionality, { optional: true });
  /** Overlay placements are physical, so they have to be mirrored in RTL. */
  readonly isRtl = computed(() => this.directionality?.valueSignal() === 'rtl');

  /** Search text (two-way bindable). */
  readonly value = model<string>('');
  readonly columns = input<ImColumn[]>([]);
  readonly notIncludedColumns = model<ImColumn[]>([]);
  readonly showScope = input<boolean>(true);
  readonly filterRows = output<ImColumn[]>();

  private readonly i18n = inject(ImGridI18n);
  readonly texts = this.i18n.texts;

  /** Columns offered in the "search in" list (searchable, with a title to show). */
  readonly searchableColumns = computed(() =>
    (this.columns() ?? []).filter(
      column =>
        isSearchableColumn(column) &&
        isListableColumn(column, !!this.i18n.translate(column.title))
    )
  );

  readonly excludedKeys = computed(
    () => new Set((this.notIncludedColumns() ?? []).map(column => column.key))
  );

  readonly excludedCount = computed(
    () => this.searchableColumns().filter(column => this.excludedKeys().has(column.key)).length
  );

  readonly scopeLabel = computed(() => {
    const texts = this.texts();
    const total = this.searchableColumns().length;
    const excluded = this.excludedCount();
    if (excluded === 0) {
      return texts.allColumns;
    }
    return `${total - excluded}/${total} ${texts.columns}`;
  });

  toggleColumn(column: ImColumn, included: boolean) {
    const current = this.notIncludedColumns() ?? [];
    const next = included
      ? current.filter(excluded => excluded.key !== column.key)
      : [...current, column];
    this.apply(next);
  }

  toggleAll(included: boolean) {
    this.apply(included ? [] : [...this.searchableColumns()]);
  }

  private apply(excluded: ImColumn[]) {
    this.notIncludedColumns.set(excluded);
    this.filterRows.emit(excluded);
  }
}
