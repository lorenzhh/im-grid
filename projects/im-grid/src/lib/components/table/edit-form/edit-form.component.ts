import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImColumn, ImColumnType, ImFieldType } from '../../../models/column.model';
import { TimeFormats } from '../../../models/settings.model';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'im-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent {
  @Input() form: FormGroup;
  @Input() columns: ImColumn[];
  @Input() locale: string;
  ImColumnType = ImColumnType;
  ImFieldType = ImFieldType;
  TimeFormats = TimeFormats;
}
