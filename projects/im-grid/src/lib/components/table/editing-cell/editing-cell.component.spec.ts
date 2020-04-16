import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingCellComponent } from './editing-cell.component';

describe('EditingCellComponent', () => {
  let component: EditingCellComponent;
  let fixture: ComponentFixture<EditingCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
