import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDtgFormComponent } from './personal-dtg-form.component';

describe('PersonalDtgFormComponent', () => {
  let component: PersonalDtgFormComponent;
  let fixture: ComponentFixture<PersonalDtgFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDtgFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDtgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
