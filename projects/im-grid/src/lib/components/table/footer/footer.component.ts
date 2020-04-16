import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImColumn } from '../../../models/column.model';
import { translations } from '../translations/default-translations';

@Component({
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImFooterComponent {
  @Input() notIncludedColumns: ImColumn[];
  @Input() columns: ImColumn[];
  @Input() filterForm: FormGroup;
  @Input() rowsLength: number;
  @Output() filterRows = new EventEmitter<void>();

  public translations = translations;
}
