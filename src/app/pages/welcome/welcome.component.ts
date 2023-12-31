import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeEvent, ChangesEvent, EditMode, ImColumn, ImGridComponent } from 'im-grid';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { columns as invoiceColumns } from 'src/app/shared/configs/invoice.config';
import { columns as mandatorColumns } from 'src/app/shared/configs/mandator.config';
import { columns as queueColumns } from 'src/app/shared/configs/queue.config';
import { generate } from 'src/app/shared/helpers/helper';
import { DataService } from 'src/app/shared/services/data.service';

export enum Entries {
  'mandator' = 'mandator',
  'queue' = 'queue',
  'invoice' = 'invoice',
}

@Component({
  standalone: true,
  imports: [ImGridComponent, AsyncPipe],
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  @ViewChild('table') table: ImGridComponent<any>;
  public columns: ImColumn[];
  public dataSource$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  EditMode = EditMode;
  private section = new BehaviorSubject('');

  constructor(private route: ActivatedRoute, public dataService: DataService) {}

  ngOnInit() {
    // this.section.pipe(
    //   filter(section => !!section),
    //   tap((section) => this.setColumns(section)),
    //   switchMap(section => this.dataService.getAll(section)
    //     .pipe(catchError(() => of([])))),
    // ).subscribe(
    //   response => this.dataSource$.next(response),
    // );

    this.section
      .pipe(
        filter((section) => !!section),
        tap(() => this.dataSource$.next([])),
        tap((section) => this.setColumns(section)),
        tap(() => this.dataService.updateLoading(true)),
        delay(1000)
      )
      .subscribe(() => {
        this.dataSource$.next(generate(100, this.columns));
        this.dataService.updateLoading(false);
      });

    this.route.paramMap.subscribe((params) => {
      this.section.next(params.get('section'));
    });
  }

  setColumns(section: string) {
    switch (section) {
      case Entries.mandator:
        this.columns = mandatorColumns;
        break;
      case Entries.queue:
        this.columns = queueColumns;
        break;
      case Entries.invoice:
        this.columns = invoiceColumns;
        break;
    }
  }

  customValidation = () => {
    return !this.table.hasUnsavedChanges();
  };

  created(changeEvent: ChangeEvent) {
    this.dataService.post(this.section.value, changeEvent.row).subscribe(
      (response) =>
        changeEvent.track.next({
          data: response,
          action: changeEvent.action,
        }),
      (error) =>
        changeEvent.track.next({
          data: false,
          action: changeEvent.action,
        })
    );
  }

  deleted(changeEvent: ChangeEvent) {
    this.dataService.delete(this.section.value, changeEvent.row).subscribe(
      (response) =>
        changeEvent.track.next({
          data: response,
          action: changeEvent.action,
        }),
      (error) =>
        changeEvent.track.next({
          data: false,
          action: changeEvent.action,
        })
    );
  }

  updated(changeEvent: ChangeEvent) {
    const uniqueColumn = this.columns.find((column) => column.isUnique);

    this.dataService.put(this.section.value, changeEvent.row, uniqueColumn.key).subscribe(
      (response) =>
        changeEvent.track.next({
          data: response,
          action: changeEvent.action,
        }),
      (error) =>
        changeEvent.track.next({
          data: false,
          action: changeEvent.action,
        })
    );
  }

  save(event: ChangesEvent) {
    event.track.next({
      data: event.currentState,
      action: event.action,
    });
  }
}
