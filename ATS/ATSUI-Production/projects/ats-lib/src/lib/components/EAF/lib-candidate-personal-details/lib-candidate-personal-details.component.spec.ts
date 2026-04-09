import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCandidatePersonalDetailsComponent } from './lib-candidate-personal-details.component';

describe('LibCandidatePersonalDetailsComponent', () => {
  let component: LibCandidatePersonalDetailsComponent;
  let fixture: ComponentFixture<LibCandidatePersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCandidatePersonalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCandidatePersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
