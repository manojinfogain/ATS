import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTransferCandidateComponent } from './request-transfer-candidate.component';

describe('RequestTransferCandidateComponent', () => {
  let component: RequestTransferCandidateComponent;
  let fixture: ComponentFixture<RequestTransferCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTransferCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTransferCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
