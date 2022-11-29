import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChangesEvent, EditMode, ImColumn } from '../../models/column.model';

@Component({
  selector: 'im-child-table',
  templateUrl: './child-table.component.html',
  styleUrls: ['./child-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildTableComponent {
  @Input() columns: ImColumn[] = [];
  @Input() dataSource$: Observable<any> = of([]);
  @Input() enableNotifications = true;
  @Input() childAllowExcel = true;
  @Input() allowCreate = true;
  @Input() allowEdit = true;
  @Input() allowDelete = true;
  @Output() changes: EventEmitter<ChangesEvent>;
  EditMode = EditMode;

  save = (changes: ChangesEvent) => {
    this.changes.emit(changes);
  };
}
