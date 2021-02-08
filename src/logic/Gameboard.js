import range from 'lodash/range';

const Gameboard = () => {

  const place = (ship, coords, dir, board) => {
    const locations = extractLocations(ship, coords, dir);
    if (outsideBoard(locations) || overlapsOtherShip(locations, board)) {
      return false;
    } else {
      return fillBoard(ship, locations, board);
    }
  }

  const receiveAttack = (coords, board, history) => {
    if (!history.find(i => i[0] === coords[0] && i[1] === coords[1])) {
      const target = board[coords[0]][coords[1]];
      const hits = target ? target.hit(target.hits) : false;
      return {
        history : [...history, coords],
        target: target.name,
        hits
      };
    } else {
      return false;
    }
  }

  const allSunk = (board) => {
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
