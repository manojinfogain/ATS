import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeConductBusinessEthicsPolicyComponent } from './code-conduct-business-ethics-policy.component';

describe('CodeConductBusinessEthicsPolicyComponent', () => {
  let component: CodeConductBusinessEthicsPolicyComponent;
  let fixture: ComponentFixture<CodeConductBusinessEthicsPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeConductBusinessEthicsPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeConductBusinessEthicsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
