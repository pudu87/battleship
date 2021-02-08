import Gameboard from '../logic/Gameboard';
import Ship from '../logic/Ship';

let gameboard;
let board;
let history;
let ships;
let minesweeper
beforeEach(() => {
  gameboard = Gameboard();
  board = Array(10).fill().map(() => Array(10).fill(false));
  history = [];
  ships = {
    minesweeper: {
      ...Ship('minesweeper', 2),
      hits: 0
    },
    cruiser: {
      ...Ship('cruiser', 3),
      hits: 0
    }
  }
  minesweeper = ships.minesweeper;
});

test('places ship direction W', () => {
  let newBoard = gameboard.place(minesweeper, [5, 5], 'W', board);
  expect(newBoard[5][5].name).toBe('minesweeper');
  expect(newBoard[5][4].name).toBe('minesweeper');
});

test('places ship direction N', () => {
  let newBoard = gameboard.place(minesweeper, [5, 5], 'N', board);
  expect(newBoard[5][5].name).toBe('minesweeper');
  expect(newBoard[4][5].name).toBe('minesweeper');
});

test('cannot place ship outside of gameboard', () => {
  let newBoard = gameboard.place(minesweeper, [0, 0], 'W', board);
  expect(newBoard).toBe(false);
});

test('cannot place ship on top of other ship', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let newBoard = gameboard.place(ships.cruiser, [4, 4], 'S', board);
  expect(newBoard).toBe(false);
});

test('check for a hit', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([5, 5], board, history);
  expect(attack.target).toBe('minesweeper');
  expect(attack.hits).toBe(1);
});

test('check if sunk', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([5, 5], board, history);
  history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 4], board, history);
  ships[nextAttack.target].hits = nextAttack.hits;
  expect(minesweeper.isSunk(minesweeper.hits)).toBe(true);
});

test('check for a miss', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([0, 0], board, history);
  expect(attack.hits).toBe(false);
});

test('remembers all shots', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([5, 5], board, history);
  history = attack.history;
  let nextAttack = gameboard.receiveAttack([1, 1], board, history);
  history = nextAttack.history;
  expect(history).toContainEqual([5, 5]);
  expect(history).toContainEqual([1, 1]);
});

test('cannot attack same place twice', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([5, 5], board, history);
  history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 5], board, history);
  expect(history).toEqual([[5, 5]]);
  expect(nextAttack).toBe(false);
});

test('checks for a victory', () => {
  board = gameboard.place(minesweeper, [5, 5], 'W', board);
  let attack = gameboard.receiveAttack([5, 5], board, history);
  history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 4], board, history);
  history = nextAttack.history;
  ships[nextAttack.target].hits = nextAttack.hits;
  expect(gameboard.allSunk(board)).toBe(true);
});
