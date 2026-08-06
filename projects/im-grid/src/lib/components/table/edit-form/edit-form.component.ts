import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { ImColumn, ImColumnType, ImFieldType } from '../../../models/column.model';
import { Locale, TimeFormats } from '../../../models/settings.model';
import { FirstPropertyPipe } from '../../../pipes/first-property.pipe';
import { FormatPipe } from '../../../pipes/format.pipe';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TypeofPipe } from '../../../pipes/typeof.pipe';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  imports: [
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzFormModule,
    TranslatePipe,
    FirstPropertyPipe,
    TypeofPipe,
    NzDatePickerModule,
    FormatPipe,
    NzRateModule,
    NzCheckboxModule,
    NzInputNumberComponent,
  ],
  selector: 'im-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormComponent {
  readonly form = input<FormGroup>();
  readonly columns = input<ImColumn[]>();
  readonly locale = input<Locale>();
  readonly valueProperty = input<Locale>();
  ImColumnType = ImColumnType;
  ImFieldType = ImFieldType;
  TimeFormats = TimeFormats;

  defaultCompareWith = (o1: any, o2: any) => o1 === o2;
}
