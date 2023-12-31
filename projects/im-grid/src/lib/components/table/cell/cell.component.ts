import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ImColumn, ImColumnType } from '../../../models/column.model';

@Component({
  standalone: true,
  imports: [
    NzIconModule,
    NgIf,
    NgSwitch,
    NzRateModule,
    FormsModule,
    NzAvatarModule,
    NgSwitchCase,
    NgSwitchDefault,
    NzTypographyModule,
  ],
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
