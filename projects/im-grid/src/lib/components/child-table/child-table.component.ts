import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ImColumn, EditMode, ChangesEvent } from '../../models/column.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'im-child-table',
  templateUrl: './child-table.component.html',
  styleUrls: ['./child-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildTableComponent {
  @Input() columns: ImColumn[] = [];
  @Input() dataSource$: Observable<any> = of([]);
  @Output() changes: EventEmitter<ChangesEvent>;
  EditMode = EditMode;

  save = (changes: ChangesEvent) => {
    this.changes.emit(changes);
  }
}
