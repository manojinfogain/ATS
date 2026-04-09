import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCandidateFamilyDetailsComponent } from './lib-candidate-family-details.component';

describe('CandidateFamilyDetailsComponent', () => {
  let component: LibCandidateFamilyDetailsComponent;
  let fixture: ComponentFixture<LibCandidateFamilyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCandidateFamilyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCandidateFamilyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
