import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImColumn, ImColumnType, ImFieldType } from '../../../models/column.model';
import { Locale, TimeFormats } from '../../../models/settings.model';

@Component({
  selector: 'im-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
