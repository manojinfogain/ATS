import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAccountLinkComponent } from './share-account-link.component';

describe('ShareAccountLinkComponent', () => {
  let component: ShareAccountLinkComponent;
  let fixture: ComponentFixture<ShareAccountLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareAccountLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAccountLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
