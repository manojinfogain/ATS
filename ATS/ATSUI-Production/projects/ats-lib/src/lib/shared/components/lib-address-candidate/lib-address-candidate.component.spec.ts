import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibAddressCandidateComponent } from './lib-address-candidate.component';

describe('LibAddressCandidateComponent', () => {
  let component: LibAddressCandidateComponent;
  let fixture: ComponentFixture<LibAddressCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibAddressCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibAddressCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
