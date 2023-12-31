import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImToolbarComponent } from './toolbar.component';

describe('ImToolbarComponent', () => {
  let component: ImToolbarComponent;
  let fixture: ComponentFixture<ImToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImToolbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
