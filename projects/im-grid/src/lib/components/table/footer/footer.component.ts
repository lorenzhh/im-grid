import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Column } from '../../../models/column.model';
import { FormGroup } from '@angular/forms';
import { translations } from '../translations/default-translations';

@Component({
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() notIncludedColumns: Column[];
  @Input() columns: Column[];
  @Input() filterForm: FormGroup;
  @Input() rowsLength: number;
  @Output() filterRows = new EventEmitter<void>();

  public translations = translations;
}
