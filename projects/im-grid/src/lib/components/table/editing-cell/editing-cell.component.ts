import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, Input, HostListener } from '@angular/core';
import { ImFieldType, ImColumn } from '../../../models/column.model';
import { FormGroup } from '@angular/forms';
import { TimeFormats } from '../../../models/settings.model';

@Component({
  selector: 'im-editing-cell',
  templateUrl: './editing-cell.component.html',
  styleUrls: ['./editing-cell.component.css']
})
export class EditingCellComponent implements OnInit, AfterViewInit {
  @ViewChild('input', { static: false }) input: ElementRef;

  @Input() locale: string;

  @Input() column: ImColumn;
  @Input() form: FormGroup;
  @Output() public cancel = new EventEmitter<void>();
  @Output() public next = new EventEmitter<boolean>();

  TimeFormats = TimeFormats;
  ImFieldType = ImFieldType;
  constructor() {
  }

  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.tab', ['$event'])
  @HostListener('document:keydown.shift.tab', ['$event'])
  @HostListener('document:keydown.enter', ['$event'])

  onNextHandler(event: KeyboardEvent) {
    this.nextCell(event);
  }

  @HostListener('document:keydown.escape', ['$event'])
  @HostListener('focusout', ['$event'])
  onCancelHandler(event: KeyboardEvent) {
    this.cancelEditing(event);
  }

  ngOnInit(): void { }

  cancelEditing(event: KeyboardEvent) {
    event.preventDefault();
    this.cancel.emit();
  }

  nextCell(event: KeyboardEvent) {
    event.preventDefault();
    this.next.emit(event.key === 'Tab' && event.shiftKey);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
        this.input.nativeElement.select();
      }
    }, 0);
  }
}
