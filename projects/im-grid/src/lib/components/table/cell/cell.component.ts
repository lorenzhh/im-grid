import { Component, Input } from '@angular/core';
import { ImColumnType } from '../../../models/column.model';

@Component({
  selector: 'im-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() rawValue: any;
  @Input() value: any;
  @Input() focused: boolean;
  @Input() columnType: ImColumnType;

  ImColumnType = ImColumnType;
  constructor() { }
}
