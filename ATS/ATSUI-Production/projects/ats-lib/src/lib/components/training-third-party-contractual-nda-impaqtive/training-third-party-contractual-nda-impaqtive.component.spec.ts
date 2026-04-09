import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingThirdPartyContractualNdaImpaqtiveComponent } from './training-third-party-contractual-nda-impaqtive.component';

describe('TrainingThirdPartyContractualNdaImpaqtiveComponent', () => {
  let component: TrainingThirdPartyContractualNdaImpaqtiveComponent;
  let fixture: ComponentFixture<TrainingThirdPartyContractualNdaImpaqtiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingThirdPartyContractualNdaImpaqtiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingThirdPartyContractualNdaImpaqtiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
