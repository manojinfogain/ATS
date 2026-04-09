import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateskillConfirmationComponent } from './mandateskill-confirmation.component';

describe('MandateskillConfirmationComponent', () => {
  let component: MandateskillConfirmationComponent;
  let fixture: ComponentFixture<MandateskillConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandateskillConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateskillConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
