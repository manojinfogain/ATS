import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDtFormComponent } from './personal-dt-form.component';

describe('PersonalDtFormComponent', () => {
  let component: PersonalDtFormComponent;
  let fixture: ComponentFixture<PersonalDtFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDtFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
