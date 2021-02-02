import testUtils from 'react-dom/test-utils';
import Ship from '../logic/Ship';

  let minesweeper;
  beforeEach(() => {
    minesweeper = Ship(2);
  });

  test('ship takes a hit', () => {
    minesweeper.hit();
    expect(minesweeper.hits).toBe(1);
  });

  test('ship does not sink', () => {
    minesweeper.hit();
    expect(minesweeper.isSunk()).not.toBe(true);
  });

  test('ship sinks', () => {
    minesweeper.hit();
    minesweeper.hit();
    expect(minesweeper.isSunk()).toBe(true);
  });
