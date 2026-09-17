import { TestBed } from '@angular/core/testing';

import { TeamData } from './team-data';

describe('TeamData', () => {
  let service: TeamData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
