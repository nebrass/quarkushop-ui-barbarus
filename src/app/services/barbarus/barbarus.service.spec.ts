import {TestBed} from '@angular/core/testing';

import {BarbarusService} from './barbarus.service';

describe('BarbarusService', () => {
  let service: BarbarusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbarusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
