import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { ImGridI18n } from '../../../i18n/im-grid-i18n';
import { ImColumn } from '../../../models/column.model';
import { ImSearchComponent } from '../search/search.component';

@Component({
  imports: [ImSearchComponent],
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImFooterComponent {
  readonly rowsLength = input<number>(0);
  readonly totalLength = input<number>(null);
  readonly selectedLength = input<number>(0);

  /* search (only shown here when the toolbar is hidden) */
  readonly showSearch = input<boolean>(false);
  readonly notIncludedColumns = input<ImColumn[]>([]);
  readonly columns = input<ImColumn[]>([]);
  readonly searchTerm = model<string>('');
  readonly filterRows = output<ImColumn[]>();

  readonly texts = inject(ImGridI18n).texts;

  readonly isFiltered = computed(
    () => this.totalLength() != null && this.totalLength() !== this.rowsLength()
  );
}
