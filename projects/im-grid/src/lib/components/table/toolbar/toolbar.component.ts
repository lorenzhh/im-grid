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
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ImColumn, Size } from '../../../models/column.model';
import { ImSearchComponent } from '../search/search.component';
import { ImGridI18n, ImText } from '../../../i18n/im-grid-i18n';
import { ImTextPipe } from '../../../pipes/text.pipe';
import { ImGridTexts } from '../../../i18n/im-grid-texts';

@Component({
  imports: [ImTextPipe, NzIconModule, NzDropdownModule, NzTooltipModule, ImSearchComponent],
  selector: 'im-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImToolbarComponent {
  private directionality = inject(Directionality, { optional: true });
  /** Overlay placements are physical, so they have to be mirrored in RTL. */
  readonly isRtl = computed(() => this.directionality?.valueSignal() === 'rtl');

  readonly numberOfChecked = input<number>(0);
  readonly allowCreate = input<boolean>(undefined);
  readonly loading = input<boolean>(false);
  readonly label = input<ImText>(undefined);
  readonly size = model<Size>(undefined);
  readonly directMode = input<boolean>(undefined);
  readonly unsavedRowsLength = input<number>(0);
  readonly deletedRowsLength = input<number>(0);
  readonly newRowsLength = input<number>(0);

  readonly rowsLength = input<number>(0);
  readonly totalLength = input<number>(null);

  /* search */
  readonly showSearch = input<boolean>(true);
  readonly searchTerm = model<string>('');
  readonly columns = input<ImColumn[]>([]);
  readonly notIncludedColumns = input<ImColumn[]>([]);

  /* column filters */
  readonly showFilterToggle = input<boolean>(false);
  readonly filtersOpen = input<boolean>(false);
  readonly hasActiveFilters = input<boolean>(false);

  readonly deleteRows = output<boolean>();
  readonly changeSize = output<Size>();
  readonly addRow = output<void>();
  readonly resetRows = output<void>();
  readonly saveRows = output<void>();
  readonly toggleFilters = output<void>();
  readonly filterRows = output<ImColumn[]>();

  readonly pendingCount = computed(
    () => this.unsavedRowsLength() + this.deletedRowsLength() + this.newRowsLength()
  );

  readonly densityOptions: { value: Size; label: keyof ImGridTexts }[] = [
    { value: 'small', label: 'densityCompact' },
    { value: 'middle', label: 'densityStandard' },
    { value: 'default', label: 'densityComfortable' },
  ];

  readonly texts = inject(ImGridI18n).texts;

  setSize(size: Size) {
    this.size.set(size);
    this.changeSize.emit(size);
  }
}
