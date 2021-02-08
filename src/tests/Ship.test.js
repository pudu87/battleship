import Ship from '../logic/Ship';

  let minesweeper;
  let hits;
  beforeEach(() => {
    minesweeper = Ship('minesweeper', 2);
    hits = 0;
  });

  test('ship takes a hit', () => {
    expect(minesweeper.hit(hits)).toBe(1);
  });

  test('ship does not sink', () => {
    hits = minesweeper.hit(hits);
    expect(minesweeper.isSunk(hits)).not.toBe(true);
  });

  test('ship sinks', () => {
    hits = minesweeper.hit(hits);
    hits = minesweeper.hit(hits);
    expect(minesweeper.isSunk(hits)).toBe(true);
  });
