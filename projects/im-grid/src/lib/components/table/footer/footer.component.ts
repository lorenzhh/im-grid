import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImColumn } from '../../../models/column.model';
import { translations } from '../translations/default-translations';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  imports: [
    TranslatePipe,
    NzSelectModule,
    FormsModule,
    NzDividerModule,
    ReactiveFormsModule,
    NzInputModule,
    NzPopconfirmModule,
  ],
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImFooterComponent {
  readonly notIncludedColumns = model<ImColumn[]>(undefined);
  readonly columns = input<ImColumn[]>(undefined);
  readonly filterForm = input<FormGroup>(undefined);
  readonly showExclude = input<boolean>(true);
  readonly rowsLength = input<number>(undefined);
  readonly filterRows = output<ImColumn[]>();

  public translations = translations;
}
