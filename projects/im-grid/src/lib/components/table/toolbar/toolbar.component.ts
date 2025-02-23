import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Size } from '../../../models/column.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { translations } from '../translations/default-translations';
@Component({
  imports: [
    TranslatePipe,
    NzRadioModule,
    NzDividerModule,
    FormsModule,
    NgIf,
    NzButtonModule,
    NzIconModule,
  ],
  selector: 'im-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImToolbarComponent {
  @Input() numberOfChecked: number;
  @Input() allowCreate: boolean;
  @Input() loading: boolean;
  @Input() label: string;
  @Input() allowExcel: boolean = true;
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
