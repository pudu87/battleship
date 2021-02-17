import Gameboard from './Gameboard'
import sample from 'lodash/sample'

const Player = () => { 
  const gameboard = Gameboard();

  const calculateMove = (player) => {
    const history = player.history;
    const validMoves = calculateValidMoves(history);
    return sample(validMoves);
  }

  function autoPlace(ship, player) {
    let board;
    do {
      const position = {
        coords: sample(calculateAllMoves()),
        horizontal: sample([true, false])
      };
      board = gameboard.place(ship, position, player);
    } while (!board)
    return board;
  }

  // PRIVATE

  const calculateValidMoves = (history) => {
    const allMoves = calculateAllMoves();
    const validMoves = allMoves.filter(move => {
      return history.every(pastMove => {
        return move[0] !== pastMove[0] || move[1] !== pastMove[1]; 
      });
    });
    return validMoves;
  }

  const calculateAllMoves = () => {
    const allMoves = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        allMoves.push([i , j]);
      }
    }
    return allMoves;
  }

  return { gameboard, calculateMove, autoPlace }
}

export default Player;
