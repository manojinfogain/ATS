import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateConnectComponent } from './candidate-connect.component';

describe('CandidateConnectComponent', () => {
  let component: CandidateConnectComponent;
  let fixture: ComponentFixture<CandidateConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
