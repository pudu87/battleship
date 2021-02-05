import Player from '../logic/Player'

test('player can accept a name', () => {
  let player = Player('Pikachu', true);
  expect(player.name).toBe('Pikachu');
});

test('player can be a computer', () => {
  let player = Player('Computer', false);
  expect(player.human).toBe(false);
});

// TESTING PRIVATE FUNCTION

xtest('computer can calculate all moves', () => {
  let player = Player('Computer', false);
  expect(player.calculateValidMoves().length).toEqual(100);
});

xtest('computer can calculate a valid move with history', () => {
  let player = Player('Computer', false);
  player.gameboard.receiveAttack([0,0]);
  expect(player.calculateValidMoves().length).toEqual(99);
  expect(player.calculateValidMoves()).not.toContainEqual([0, 0]);
});
