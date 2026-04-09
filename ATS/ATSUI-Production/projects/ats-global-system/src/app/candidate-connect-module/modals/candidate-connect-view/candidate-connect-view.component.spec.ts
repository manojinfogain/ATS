import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateConnectViewComponent } from './candidate-connect-view.component';

describe('CandidateConnectViewComponent', () => {
  let component: CandidateConnectViewComponent;
  let fixture: ComponentFixture<CandidateConnectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateConnectViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateConnectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
