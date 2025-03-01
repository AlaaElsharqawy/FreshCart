import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { lockedGuard } from './locked.guard';

describe('lockedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => lockedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
