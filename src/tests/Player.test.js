import Player from '../logic/Player';
import Ship from '../logic/Ship';

let player;
let human;
beforeEach(() => {
  player = Player();
  human = {  
    board: Array(10).fill().map(() => Array(10).fill(false)),
    history: [],
    ships : {
      cruiser: { 
        ...Ship('cruiser', 3),
        hits: 0
      },
      carrier: { 
        ...Ship('carrier', 5), 
        hits: 0
      }
    }
  };
});

test('can calculate all moves', () => {
  expect(player.calculateMoves(human).length).toEqual(100);
});

test('can calculate a valid moveset with history', () => {
  human.history = [[0, 0]];
  expect(player.calculateMoves(human).length).toEqual(99);
  expect(player.calculateMoves(human)).not.toContainEqual([0, 0]);
});

test('can calculate a valid moveset if one hit', () => {
  human.history = [[0, 0], [5, 5], [6, 5]];
  human.board[5][5] = 'carrier';
  human.ships.carrier.hits = 1;
  expect(player.calculateMoves(human).sort()).toEqual([[4, 5], [5, 6], [5, 4]].sort());
});

test('can calculate a valid moveset if more than one hit', () => {
  human.history = [[0, 0], [5, 5], [5, 6], [5, 7]];
  human.board[5][5] = 'carrier';
  human.board[5][6] = 'carrier';
  human.board[5][7] = 'carrier';
  human.ships.carrier.hits = 3;
  console.log(player.calculateMoves(human))
  expect(player.calculateMoves(human).sort()).toEqual([[5, 4], [5, 8]].sort());
});

test('can calculate a valid moveset on the side of the board', () => {
  human.history = [[0, 0], [5, 9], [4, 9]];
  human.board[5][9] = 'carrier';
  human.ships.carrier.hits = 1;
  human.board[0][0] = 'cruiser';
  human.ships.cruiser.hits = 3;
  expect(player.calculateMoves(human).sort()).toEqual([[6, 9], [5, 8]].sort());
});
