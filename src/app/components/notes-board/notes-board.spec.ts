import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesBoard } from './notes-board';

describe('NotesBoard', () => {
  let component: NotesBoard;
  let fixture: ComponentFixture<NotesBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
