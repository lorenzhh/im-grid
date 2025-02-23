import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

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
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FirstPropertyPipe,
    TypeofPipe,
    NzDatePickerModule,
    NgIf,
    NgFor,
    FormatPipe,
    NzRateModule,
    NzCheckboxModule,
    NzInputNumberModule,
  ],
  selector: 'im-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormComponent {
  @Input() form: FormGroup;
  @Input() columns: ImColumn[];
  @Input() locale: Locale;
  @Input() valueProperty: Locale;
  ImColumnType = ImColumnType;
  ImFieldType = ImFieldType;
  TimeFormats = TimeFormats;

  defaultCompareWith = (o1: any, o2: any) => o1 === o2;
}
