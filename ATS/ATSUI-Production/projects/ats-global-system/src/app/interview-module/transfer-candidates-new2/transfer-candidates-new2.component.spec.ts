import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCandidatesNew2Component } from './transfer-candidates-new2.component';

describe('TransferCandidatesNew2Component', () => {
  let component: TransferCandidatesNew2Component;
  let fixture: ComponentFixture<TransferCandidatesNew2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCandidatesNew2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCandidatesNew2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
