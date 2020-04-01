import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, FilterType } from '../../../models/column.model';
import { translations } from '../translations/default-translations';
import { DateFormats } from '../../../models/settings.model';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'im-filter-cell',
  templateUrl: './filter-cell.component.html',
  styleUrls: ['./filter-cell.component.css']
})
export class FilterCellComponent {
  @Input() column: Column;
  @Output() filterRows = new EventEmitter();
  FilterType = FilterType;
  translations = translations;
  DateFormats = DateFormats;

  constructor(public settingsService: SettingsService) { }
}
