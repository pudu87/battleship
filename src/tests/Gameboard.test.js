import Gameboard from '../logic/Gameboard';
import Ship from '../logic/Ship';

let gameboard;
let minesweeper;
beforeEach(() => {
  gameboard = Gameboard();
  minesweeper = Ship(2, 'M');
});

test('places ship direction W', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  expect(gameboard.board[5][5]).toBe(minesweeper);
  expect(gameboard.board[5][4]).toBe(minesweeper);
});

test('places ship direction N', () => {
  gameboard.place(minesweeper, [5, 5], 'N');
  expect(gameboard.board[5][5]).toBe(minesweeper);
  expect(gameboard.board[4][5]).toBe(minesweeper);
});

test('cannot place ship outside of gameboard', () => {
  gameboard.place(minesweeper, [0, 0], 'W');
  expect(gameboard.board[0][0]).toBeUndefined();
});

test('cannot place ship on top of other ship', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.place(minesweeper, [4, 4], 'S');
  expect(gameboard.board[4][4]).toBeUndefined();
});

test('check for a hit', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([5, 5]);
  expect(minesweeper.hits).toBe(1);
});

test('check if sunk', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([5, 5]);
  gameboard.receiveAttack([5, 4]);
  expect(minesweeper.isSunk()).toBe(true);
});

test('check for a miss', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([0, 0]);
  expect(minesweeper.hits).toBe(0);
});

test('remembers all shots', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([5, 5]);
  gameboard.receiveAttack([1, 1]);
  expect(gameboard.history).toContainEqual([5, 5]);
  expect(gameboard.history).toContainEqual([1, 1]);
});

test('cannot attack same place twice', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([5, 5]);
  gameboard.receiveAttack([5, 5]);
  expect(gameboard.history).toEqual([[5, 5]]);
  expect(minesweeper.hits).toBe(1);
});

test('checks for a victory', () => {
  gameboard.place(minesweeper, [5, 5], 'W');
  gameboard.receiveAttack([5, 5]);
  gameboard.receiveAttack([5, 4]);
  expect(gameboard.allSunk()).toBe(true);
});
