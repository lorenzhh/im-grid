import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImFilterCellComponent } from './filter-cell.component';

describe('ImFilterCellComponent', () => {
  let component: ImFilterCellComponent;
  let fixture: ComponentFixture<ImFilterCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImFilterCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImFilterCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
