import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImColumn } from '../../../models/column.model';
import { translations } from '../translations/default-translations';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NgFor, NgIf } from '@angular/common';

@Component({
  imports: [
    TranslatePipe,
    NzSelectModule,
    FormsModule,
    NzDividerModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    NzInputModule,
    NzPopconfirmModule,
  ],
  selector: 'im-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImFooterComponent {
  @Input() notIncludedColumns: ImColumn[];
  @Input() columns: ImColumn[];
  @Input() filterForm: FormGroup;
  @Input() showExclude: boolean = true;
  @Input() rowsLength: number;
  @Output() filterRows = new EventEmitter<ImColumn[]>();

  public translations = translations;
}
