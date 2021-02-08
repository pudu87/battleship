import Gameboard from './Gameboard'

const Player = () => { 
  const gameboard = Gameboard();

  const calculateMove = (history) => {
    const validMoves = calculateValidMoves(history);
    return validMoves[Math.floor(Math.random() * validMoves.length)];
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

  return { gameboard, calculateMove }
}

export default Player;
