import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptableUseOfAssetPolicyComponent } from './acceptable-use-of-asset-policy.component';

describe('AcceptableUseOfAssetPolicyComponent', () => {
  let component: AcceptableUseOfAssetPolicyComponent;
  let fixture: ComponentFixture<AcceptableUseOfAssetPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptableUseOfAssetPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptableUseOfAssetPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
