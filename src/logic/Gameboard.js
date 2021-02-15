const Gameboard = () => {

  const place = (ship, position, player) => {
    const { coords, horizontal } = position;
    const board = player.board;
    const locations = extractLocations(ship, coords, horizontal);
    if (outsideBoard(locations) || overlapsOtherShip(locations, board)) {
      return false;
    } else {
      return fillBoard(ship, locations, board);
    }
  }

  const remove = (ship, player) => {
    const board = player.board;
    return board.map(row => {
      return row.map(cell => {
        return cell === ship.name ? false : cell;
      })
    })
  }

  const receiveAttack = (coords, player) => {
    const { board, history } = player;
    if (!history.find(i => i[0] === coords[0] && i[1] === coords[1])) {
      const target = board[coords[0]][coords[1]];
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
        const cellData = player.ships[cell];
        return cell ? cellData.isSunk(cellData.hits) : true;
      });
    });
  }

  // PRIVATE

  const extractLocations = (ship, coords, horizontal) => {
    const locations = [];
    if (horizontal) {
      for (let i = 0; i < ship.length; i++) {
        locations.push([coords[0], coords[1] + i]);
      };
    } else {
      for (let i = 0; i < ship.length; i++) {
        locations.push([coords[0] + i, coords[1]]);
      };
    }
    return locations;
  }

  const outsideBoard = (locations) => {
    return locations.flat().some(coord => coord >=10);
  }

  const overlapsOtherShip = (locations, board) => {
    return locations.some(coords => {
      return board[coords[0]][coords[1]];
    });
  }

  const fillBoard = (ship, locations, board) => {
    let newBoard = board.map(i => [...i]);
    locations.forEach(coords => {
      newBoard[coords[0]][coords[1]] = ship.name;
    });
    return newBoard;
  }

  return { place, remove, receiveAttack, allSunk }
}

export default Gameboard;
