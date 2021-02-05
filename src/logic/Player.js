import Gameboard from './Gameboard';

const Player = (name, human) => { 
  const gameboard = Gameboard();

  const calculateMove = () => {
    const validMoves = calculateValidMoves();
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // PRIVATE

  const calculateValidMoves = () => {
    const allMoves = calculateAllMoves();
    const validMoves = allMoves.filter(move => {
      return gameboard.history.every(pastMove => {
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

  return { name, human, gameboard, calculateMove }
}

export default Player;
