import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeEvent, EditMode, ImColumn, ImGridComponent } from 'im-grid';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { filter, tap, switchMap, catchError, delay } from 'rxjs/operators';
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
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('table') table: ImGridComponent;
  public columns: ImColumn[];
  public dataSource$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private section = new BehaviorSubject('');
  EditMode = EditMode;
  constructor(
    private route: ActivatedRoute,
    public dataService: DataService
  ) { }

  ngOnInit() {
    // this.section.pipe(
    //   filter(section => !!section),
    //   tap((section) => this.setColumns(section)),
    //   switchMap(section => this.dataService.getAll(section)
    //     .pipe(catchError(() => of([])))),
    // ).subscribe(
    //   response => this.dataSource$.next(response),
    // );

    this.section.pipe(
      filter(section => !!section),
      tap((section) => this.setColumns(section)),
      delay(0)
    ).subscribe(() => this.dataSource$.next(generate(1000, this.columns)));

    this.route.paramMap.subscribe(params => {
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
  }


  created(changeEvent: ChangeEvent) {
    this.dataService
      .post(this.section.value, changeEvent.row)
      .subscribe(
        (response) => changeEvent.track.next(response),
        (error) => changeEvent.track.next(false));
  }

  deleted(changeEvent: ChangeEvent) {
    this.dataService
      .delete(this.section.value, changeEvent.row)
      .subscribe(
        (response) => changeEvent.track.next(response),
        (error) => changeEvent.track.next(false));
  }

  updated(changeEvent: ChangeEvent) {
    const uniqueColumn = this.columns.find(column => column.isUnique);

    this.dataService
      .put(this.section.value, changeEvent.row, uniqueColumn.key)
      .subscribe(
        (response) => changeEvent.track.next(response),
        (error) => changeEvent.track.next(false));
  }
}
