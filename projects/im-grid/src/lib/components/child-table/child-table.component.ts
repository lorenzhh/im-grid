import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChangesEvent, EditMode, ImColumn } from '../../models/column.model';
import { ImGridComponent } from '../table/table.component';

@Component({
  imports: [ImGridComponent],
  selector: 'im-child-table',
  templateUrl: './child-table.component.html',
  styleUrls: ['./child-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildTableComponent {
  readonly columns = input<ImColumn[]>([]);
  readonly dataSource$ = input<Observable<any>>(of([]));
  readonly enableNotifications = input(true);
  readonly childAllowExcel = input(true);
  readonly allowCreate = input(true);
  readonly allowEdit = input(true);
  readonly allowDelete = input(true);
  @Output() changes: EventEmitter<ChangesEvent>;
  EditMode = EditMode;

  save = (changes: ChangesEvent) => {
    this.changes.emit(changes);
  };
}
