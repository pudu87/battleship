import Gameboard from './Gameboard';
import sample from 'lodash/sample';
import range from 'lodash/range';
import max from 'lodash/max';
import min from 'lodash/min';

const Player = () => { 
  const gameboard = Gameboard();

  const calculateMoves = (player) => {
    const history = player.history;
    const moveSet = intelligentMoves(player) || allMoves();
    return validMoves(moveSet, history);
  }
  
  const autoPlace = (ship, player) => {
    let board;
    do {
      const position = {
        coords: sample(allMoves()),
        horizontal: sample([true, false])
      };
      board = gameboard.place(ship, position, player);
    } while (!board)
    return board;
  }

  // PRIVATE

  const intelligentMoves = (player) => {
    const hits = collectPreviousHits(player);
    if (!hits) return false;
    const moveSet = calculateAdjacentCells(hits);
    return moveSet.filter(move => {
      return move.every(coord => range(0,10).includes(coord));
    });
  }

  const collectPreviousHits = (player) => {
    const { board, ships, history } = player;
    const target = Object.values(ships).find(ship => {
      return !ship.isSunk(ship.hits) && ship.hits > 0;
    });
    if (!target) return false;
    return history.filter(coords => {
      return board[coords[0]][coords[1]] === target.name;
    });
  }

  const calculateAdjacentCells = (hits) => {
    hits = [hits.map(hit => hit[0]), hits.map(hit => hit[1])];
    const moveSet = [];
    if (hits[0].length === 1 || hits[0][0] !== hits[0][1]) {
      moveSet.push([ max(hits[0]) + 1, hits[1][0] ]);
      moveSet.push([ min(hits[0]) - 1, hits[1][0] ]);
    }
    if (hits[1].length === 1 || hits[1][0] !== hits[1][1]) {
      moveSet.push([ hits[0][0], max(hits[1]) + 1 ]);
      moveSet.push([ hits[0][0], min(hits[1]) - 1 ]);
    }
    return moveSet;
  }

  const allMoves = () => {
    return range(0, 10).map(i => {
      return range(0, 10).map(j => {
        return [i, j];
      })
    }).flat();
  }

  const validMoves = (moveSet, history) => {
    return moveSet.filter(move => {
      return history.every(pastMove => {
        return move[0] !== pastMove[0] || move[1] !== pastMove[1]; 
      });
    });
  }

  return { gameboard, calculateMoves, autoPlace }
}

export default Player;
