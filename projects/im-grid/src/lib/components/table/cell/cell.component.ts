import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ImColumnType, ImColumn } from '../../../models/column.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'im-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {
  @Input() rawValue: any;
  @Input() value: any;
  @Input() form: FormGroup;
  @Input() locale: string;
  @Input() column: ImColumn;
  @Input() focused: boolean;
  @Input() editing: boolean;
  @Input() columnType: ImColumnType;
  @Output() zoomed = new EventEmitter<void>();
  @Output() next = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();

  ImColumnType = ImColumnType;
  constructor() { }
}
