import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ImColumn, ImColumnType } from '../../../models/column.model';

@Component({
  imports: [NzIconModule, NzRateModule, FormsModule, NzAvatarModule, NzTypographyModule],
  selector: 'im-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  readonly column = input<ImColumn>();
  readonly rawValue = input<any>();
  readonly value = input<any>();
  readonly focused = input<boolean>();
  readonly zoomed = output<void>();

  ImColumnType = ImColumnType;
  constructor() {}
}
