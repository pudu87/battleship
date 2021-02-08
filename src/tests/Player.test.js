import Player from '../logic/Player'

let player;
beforeEach(() => {
  player = Player();
});

// PRIVATE FUNCTIONS

xtest('computer can calculate all moves', () => {
  let history = [];
  expect(player.calculateValidMoves(history).length).toEqual(100);
});

xtest('computer can calculate a valid move with history', () => {
  let history = [[0,0]];
  expect(player.calculateValidMoves(history).length).toEqual(99);
  expect(player.calculateValidMoves(history)).not.toContainEqual([0, 0]);
});
