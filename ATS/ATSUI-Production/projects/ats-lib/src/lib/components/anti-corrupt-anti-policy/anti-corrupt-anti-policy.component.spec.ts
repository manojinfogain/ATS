import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiCorruptAntiPolicyComponent } from './anti-corrupt-anti-policy.component';

describe('AntiCorruptAntiPolicyComponent', () => {
  let component: AntiCorruptAntiPolicyComponent;
  let fixture: ComponentFixture<AntiCorruptAntiPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntiCorruptAntiPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntiCorruptAntiPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
