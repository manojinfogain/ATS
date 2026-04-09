import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibUpdateAddressCandidateModalComponent } from './lib-update-address-candidate-modal.component';

describe('LibUpdateAddressCandidateModalComponent', () => {
  let component: LibUpdateAddressCandidateModalComponent;
  let fixture: ComponentFixture<LibUpdateAddressCandidateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibUpdateAddressCandidateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibUpdateAddressCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
