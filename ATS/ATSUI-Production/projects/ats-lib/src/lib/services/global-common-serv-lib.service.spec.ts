import { TestBed } from '@angular/core/testing';

import { GlobalCommonServLibService } from './global-common-serv-lib.service';

describe('GlobalCommonServLibService', () => {
  let service: GlobalCommonServLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalCommonServLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
