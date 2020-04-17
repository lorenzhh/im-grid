import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImGridComponent } from './table.component';

describe('ImGridComponent', () => {
  let component: ImGridComponent;
  let fixture: ComponentFixture<ImGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
