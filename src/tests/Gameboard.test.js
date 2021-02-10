import Gameboard from '../logic/Gameboard';
import Ship from '../logic/Ship';

let gameboard;
let player;
let ships;
let minesweeper;
let position;
beforeEach(() => {
  gameboard = Gameboard();
  player = {  
    board: Array(10).fill().map(() => Array(10).fill(false)),
    history: []
  }
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
  position = {
    coords: [5, 5],
    dir: 'W'
  }
});

test('places ship direction W', () => {
  let newBoard = gameboard.place(minesweeper, position, player);
  expect(newBoard[5][5].name).toBe('minesweeper');
  expect(newBoard[5][4].name).toBe('minesweeper');
});

test('places ship direction N', () => {
  position.dir = 'N';
  let newBoard = gameboard.place(minesweeper, position, player);
  expect(newBoard[5][5].name).toBe('minesweeper');
  expect(newBoard[4][5].name).toBe('minesweeper');
});

test('cannot place ship outside of gameboard', () => {
  position.coords = [0, 0];
  let newBoard = gameboard.place(minesweeper, position, player);
  expect(newBoard).toBe(false);
});

test('cannot place ship on top of other ship', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let cruiserPosition = {
    coords: [4, 4],
    dir: 'S'
  }
  let newBoard = gameboard.place(ships.cruiser, cruiserPosition, player);
  expect(newBoard).toBe(false);
});

test('check for a hit', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([5, 5], player);
  expect(attack.target).toBe('minesweeper');
  expect(attack.hits).toBe(1);
});

test('check if sunk', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([5, 5], player);
  player.history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 4], player);
  ships[nextAttack.target].hits = nextAttack.hits;
  expect(minesweeper.isSunk(minesweeper.hits)).toBe(true);
});

test('check for a miss', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([0, 0], player);
  expect(attack.hits).toBe(false);
});

test('remembers all shots', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([5, 5], player);
  player.history = attack.history;
  let nextAttack = gameboard.receiveAttack([1, 1], player);
  player.history = nextAttack.history;
  expect(player.history).toContainEqual([5, 5]);
  expect(player.history).toContainEqual([1, 1]);
});

test('cannot attack same place twice', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([5, 5], player);
  player.history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 5], player);
  expect(player.history).toEqual([[5, 5]]);
  expect(nextAttack).toBe(false);
});

test('checks for a victory', () => {
  player.board = gameboard.place(minesweeper, position, player);
  let attack = gameboard.receiveAttack([5, 5], player);
  player.history = attack.history;
  ships[attack.target].hits = attack.hits;
  let nextAttack = gameboard.receiveAttack([5, 4], player);
  player.history = nextAttack.history;
  ships[nextAttack.target].hits = nextAttack.hits;
  expect(gameboard.allSunk(player)).toBe(true);
});
