import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ImColumn } from '../../../models/column.model';
import { FormGroup } from '@angular/forms';
import { translations } from '../translations/default-translations';

@Component({
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class ImFooterComponent {
  @Input() notIncludedColumns: ImColumn[];
  @Input() columns: ImColumn[];
  @Input() filterForm: FormGroup;
  @Input() rowsLength: number;
  @Output() filterRows = new EventEmitter<void>();

  public translations = translations;
}
