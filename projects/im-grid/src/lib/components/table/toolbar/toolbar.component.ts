import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { translations } from '../translations/default-translations';
export type Size = 'small' | 'middle' | 'default';
@Component({
  selector: 'im-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImToolbarComponent {
  @Input() numberOfChecked: number;
  @Input() allowCreate: boolean;
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
