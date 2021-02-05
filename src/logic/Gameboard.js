import range from 'lodash/range';

const Gameboard = () => {
  const board = Array(10).fill().map(() => Array(10));
  const history = [];

  const place = (ship, coords, dir) => {
    const locations = extractLocations(ship, coords, dir);
    if (outsideBoard(locations) || overlapsOtherShip(locations)) return;
    fillBoard(ship, locations);
  }

  const receiveAttack = (coords) => {
    if (!history.find(i => i[0] === coords[0] && i[1] === coords[1])) {
      history.push(coords);
      const target = board[coords[0]][coords[1]];
      return target === undefined ? false : target.hit();
    };
  }

  const allSunk = () => {
    return board.every(row => {
      return row.every(cell => {
        return cell === undefined ? true : cell.isSunk();
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

  const overlapsOtherShip = (locations) => {
    return locations.some(coords => {
      return board[coords[0]][coords[1]] !== undefined;
    });
  }

  const fillBoard = (ship, locations) => {
    locations.forEach(coords => {
      board[coords[0]][coords[1]] = ship;
    });
  }

  return { board, history, place, receiveAttack, allSunk }
}

export default Gameboard;
