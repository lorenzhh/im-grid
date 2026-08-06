import {
  AsyncPipe,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ImColumn, ImColumnType, ImFilterType } from '../../../models/column.model';
import { DateFormats } from '../../../models/settings.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TypeofPipe } from '../../../pipes/typeof.pipe';
import { SettingsService } from '../../../services/settings.service';
import { translations } from '../translations/default-translations';
import { FormatPipe } from '../../../pipes/format.pipe';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRateModule } from 'ng-zorro-antd/rate';

@Component({
  imports: [
    TranslatePipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NgFor,
    TypeofPipe,
    FormatPipe,
    NzDatePickerModule,
    AsyncPipe,
    NzSelectModule,
    NzRateModule,
    NzInputModule,
  ],
  selector: 'im-filter-cell',
  templateUrl: './filter-cell.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./filter-cell.component.css'],
})
export class ImFilterCellComponent {
  settingsService = inject(SettingsService);

  readonly column = input<ImColumn>(undefined);
  readonly filterRows = output();
  ImFilterType = ImFilterType;
  ImColumnType = ImColumnType;
  translations = translations;
  DateFormats = DateFormats;
}
