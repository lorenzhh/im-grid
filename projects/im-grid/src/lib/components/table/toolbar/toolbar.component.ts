import { Component, Input, EventEmitter, Output } from '@angular/core';
import { translations } from '../translations/default-translations';
export type Size = 'small' | 'middle' | 'default';
@Component({
  selector: 'im-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ImToolbarComponent {
  @Input() numberOfChecked: number;
  @Input() loading: boolean;
  @Input() size: Size;
  @Input() directMode: boolean;
  @Input() unsavedRowsLength: number;
  @Input() deletedRowsLength: number;
  @Input() newRowsLength: number;
  @Output() deleteRows = new EventEmitter<boolean>();
  @Output() exportAsExcel = new EventEmitter<void>();
  @Output() changeSize = new EventEmitter<Size>();
  @Output() addRow = new EventEmitter<void>();
  @Output() resetRows = new EventEmitter<void>();
  @Output() saveRows = new EventEmitter<void>();

  public translations = translations;
}
