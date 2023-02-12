import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ImColumn, ImColumnType } from '../../../models/column.model';

@Component({
  selector: 'im-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  @Input() column: ImColumn;
  @Input() rawValue: any;
  @Input() value: any;
  @Input() focused: boolean;
  @Output() zoomed = new EventEmitter<void>();

  ImColumnType = ImColumnType;
  constructor() {}
}
