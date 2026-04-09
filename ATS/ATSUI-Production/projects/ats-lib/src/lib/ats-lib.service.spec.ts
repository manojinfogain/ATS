import { TestBed } from '@angular/core/testing';

import { AtsLibService } from './ats-lib.service';

describe('AtsLibService', () => {
  let service: AtsLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtsLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
