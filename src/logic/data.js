import Ship from './Ship'

const player = {
  board: Array(10).fill().map(() => Array(10).fill(false)),
  ships: {
    carrier: { 
      ...Ship('carrier', 5), 
      hits: 0 
    },
    battleship: { 
      ...Ship('battleship', 4), 
      hits: 0 
    },
    cruiser: { 
      ...Ship('cruiser', 3), 
      hits: 0 
    },
    submarine: { 
      ...Ship('submarine', 3), 
      hits: 0 
    },
    minesweeper: { 
      ...Ship('minesweeper', 2), 
      hits: 0 
    },
  }, 
  history: []
}

const data = {
  setupConfirmed: false,
  gameOver: false,
  human: {
    ...player
  },
  computer: {
    ...player
  }
}

export default data;
