import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImFooterComponent } from './footer.component';

describe('ImFooterComponent', () => {
  let component: ImFooterComponent;
  let fixture: ComponentFixture<ImFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
