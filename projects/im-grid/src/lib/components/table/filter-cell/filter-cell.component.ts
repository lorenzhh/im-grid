import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ImColumn, ImColumnType, ImFilterType } from '../../../models/column.model';
import { DateFormats } from '../../../models/settings.model';
import { SettingsService } from '../../../services/settings.service';
import { translations } from '../translations/default-translations';

@Component({
  selector: 'im-filter-cell',
  templateUrl: './filter-cell.component.html',
  styleUrls: ['./filter-cell.component.css'],
})
export class ImFilterCellComponent {
  @Input() column: ImColumn;
  @Output() filterRows = new EventEmitter();
  ImFilterType = ImFilterType;
  ImColumnType = ImColumnType;
  translations = translations;
  DateFormats = DateFormats;

  constructor(public settingsService: SettingsService) { }
}
