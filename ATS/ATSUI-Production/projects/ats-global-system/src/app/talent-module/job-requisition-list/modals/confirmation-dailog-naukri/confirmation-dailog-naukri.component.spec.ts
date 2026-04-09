import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDailogNaukriComponent } from './confirmation-dailog-naukri.component';

describe('ConfirmationDailogNaukriComponent', () => {
  let component: ConfirmationDailogNaukriComponent;
  let fixture: ComponentFixture<ConfirmationDailogNaukriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDailogNaukriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDailogNaukriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
