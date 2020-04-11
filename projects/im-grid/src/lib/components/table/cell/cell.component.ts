import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() copy: boolean;
  @Input() zoom: boolean;
  @Output() zoomed = new EventEmitter<void>();

  ImColumnType = ImColumnType;
  constructor() { }
}
