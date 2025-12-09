import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Size } from '../../../models/column.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { translations } from '../translations/default-translations';
@Component({
  imports: [
    TranslatePipe,
    NzRadioModule,
    NzDividerModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
  ],
  selector: 'im-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImToolbarComponent {
  readonly numberOfChecked = input<number>(undefined);
  readonly allowCreate = input<boolean>(undefined);
  readonly loading = input<boolean>(undefined);
  readonly label = input<string>(undefined);
  readonly allowExcel = input<boolean>(true);
  readonly size = model<Size>(undefined);
  readonly directMode = input<boolean>(undefined);
  readonly unsavedRowsLength = input<number>(undefined);
  readonly deletedRowsLength = input<number>(undefined);
  readonly newRowsLength = input<number>(undefined);
  readonly deleteRows = output<boolean>();
  readonly exportAsExcel = output<void>();
  readonly changeSize = output<Size>();
  readonly addRow = output<void>();
  readonly resetRows = output<void>();
  readonly saveRows = output<void>();

  public translations = translations;
}
