import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ImColumn, ImColumnType } from '../../../models/column.model';

const NUMERIC_TYPES = new Set<ImColumnType>([
  ImColumnType.Int,
  ImColumnType.Decimal,
  ImColumnType.Currency,
]);

const CENTERED_TYPES = new Set<ImColumnType>([ImColumnType.Boolean, ImColumnType.Avatar]);

export function isNumericColumn(column: ImColumn): boolean {
  return NUMERIC_TYPES.has(column?.columnType);
}

export function isCenteredColumn(column: ImColumn): boolean {
  return CENTERED_TYPES.has(column?.columnType);
}

@Component({
  imports: [NzIconModule, NzRateModule, FormsModule, NzAvatarModule],
  selector: 'im-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-numeric]': 'numeric()',
    '[class.is-centered]': 'centered()',
    '[class.is-tabular]': 'tabular()',
  },
})
export class CellComponent {
  readonly column = input<ImColumn>();
  readonly rawValue = input<any>();
  readonly value = input<any>();

  readonly numeric = computed(() => isNumericColumn(this.column()));
  readonly centered = computed(() => isCenteredColumn(this.column()));
  readonly tabular = computed(
    () => this.numeric() || this.column()?.columnType === ImColumnType.Date
  );
  readonly isTrue = computed(() => {
    const raw = this.rawValue();
    return raw === 1 || raw === '1' || raw === true || raw === 'true';
  });

  ImColumnType = ImColumnType;
}
