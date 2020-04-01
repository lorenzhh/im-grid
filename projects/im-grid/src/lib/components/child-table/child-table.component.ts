import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, EditMode, ChangesEvent } from '../../models/column.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'im-child-table',
  templateUrl: './child-table.component.html',
  styleUrls: ['./child-table.component.css']
})
export class ChildTableComponent {
  @Input() columns: Column[] = [];
  @Input() dataSource$: Observable<any> = of([]);
  @Output() changes: EventEmitter<ChangesEvent>;
  EditMode = EditMode;

  save = (changes: ChangesEvent) => {
    this.changes.emit(changes);
  }
}
