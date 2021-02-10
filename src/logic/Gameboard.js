import range from 'lodash/range';

const Gameboard = () => {

  const place = (ship, position, player) => {
    const { coords, dir } = position;
    const board = player.board;
    const locations = extractLocations(ship, coords, dir);
    if (outsideBoard(locations) || overlapsOtherShip(locations, board)) {
      return false;
    } else {
      return fillBoard(ship, locations, board);
    }
  }

  const receiveAttack = (coords, player) => {
    const { board, history } = player;
    if (!history.find(i => i[0] === coords[0] && i[1] === coords[1])) {
      const target = board[coords[0]][coords[1]].name;
      const targetData = player.ships[target];
      const hits = target ? targetData.hit(targetData.hits) : false;
      return {
        history : [...history, coords],
        target,
        hits
      };
    } else {
      return false;
    }
  }

  const allSunk = (player) => {
    const board = player.board;
    return board.every(row => {
      return row.every(cell => {
        return cell ? cell.isSunk(cell.hits) : true;
      });
    });
  }

  // PRIVATE

  const extractLocations = (ship, coords, dir) => {
    const locations = [];
    switch(dir) {
      case 'N':
        for (let i = 0; i < ship.length; i++) {
          locations.push([coords[0] - i, coords[1]]);
        };
        break;
      case 'E':
        for (let i = 0; i < ship.length; i++) {
          locations.push([coords[0], coords[1] + i]);
        };
        break;
      case 'S':
        for (let i = 0; i < ship.length; i++) {
          locations.push([coords[0] + i, coords[1]]);
        };
        break;
      case 'W':
        for (let i = 0; i < ship.length; i++) {
          locations.push([coords[0], coords[1] - i]);
        };
        break;
    };
    return locations;
  }

  const outsideBoard = (locations) => {
    return locations.flat().some(coord => {
      return !range(0,10).includes(coord);
    });
  }

  const overlapsOtherShip = (locations, board) => {
    return locations.some(coords => {
      return board[coords[0]][coords[1]];
    });
  }

  const fillBoard = (ship, locations, board) => {
    let newBoard = board.map(i => [...i]);
    locations.forEach(coords => {
      newBoard[coords[0]][coords[1]] = ship;
    });
    return newBoard;
  }

  return { place, receiveAttack, allSunk }
}

export default Gameboard;
