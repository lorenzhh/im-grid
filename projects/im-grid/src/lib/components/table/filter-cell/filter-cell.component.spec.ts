import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCellComponent } from './filter-cell.component';

describe('FilterCellComponent', () => {
  let component: FilterCellComponent;
  let fixture: ComponentFixture<FilterCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
