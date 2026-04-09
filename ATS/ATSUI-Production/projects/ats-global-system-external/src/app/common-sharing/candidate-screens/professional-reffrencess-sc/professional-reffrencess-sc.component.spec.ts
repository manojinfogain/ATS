import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalReffrencessScComponent } from './professional-reffrencess-sc.component';

describe('ProfessionalReffrencessScComponent', () => {
  let component: ProfessionalReffrencessScComponent;
  let fixture: ComponentFixture<ProfessionalReffrencessScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalReffrencessScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalReffrencessScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
