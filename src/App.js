import { useState } from 'react';
import produce from 'immer';
import './App.scss';
import Notifications from './components/Notifications';
import Setup from './components/Setup';
import Board from './components/Board';
import OtherBoard from './components/OtherBoard';
import Player from './logic/Player';
import dataObj from './logic/data';

function App() {

  const player = Player();
  const gameboard = player.gameboard;

  const [data, setData] = useState(autoPlaceShips());

  const { human, computer } = data;

  function autoPlaceShips() {
    const position = {
      coords: [0, 0],
      dir: 'E'
    }
    const humanBoard = gameboard.place(dataObj.human.ships.minesweeper, position, dataObj.human);
    const computerBoard = gameboard.place(dataObj.computer.ships.minesweeper, position, dataObj.computer);
    return produce(dataObj, (draft) => {
      draft.human.board = humanBoard;
      draft.computer.board = computerBoard;
    })
  }

  function handleAttack(coords) {
    console.log(data)
    console.log(gameboard.allSunk(computer))
    console.log(computer.ships.minesweeper.isSunk(computer.ships.minesweeper.hits))
    const humanAttack = gameboard.receiveAttack(coords, computer);
    if (!humanAttack.history) {
      return console.log('Already been there...')
    } else {
      const computerMove = player.calculateMove(human);
      const computerAttack = gameboard.receiveAttack(computerMove, human);
      const newData = produce(data, (draft) => {
        if (humanAttack.target) {
          draft.computer.ships[humanAttack.target].hits = humanAttack.hits;
          if (gameboard.allSunk(draft.computer)) {
            draft.gameOver = 'human';
          }
        }
        if (computerAttack.target) {
          draft.human.ships[computerAttack.target].hits = computerAttack.hits;
          if (gameboard.allSunk(draft.human)) {
            draft.gameOver = 'computer';
          }
        }
        draft.computer.history = humanAttack.history;
        draft.human.history = computerAttack.history;
      })
      setData(newData);
    }
  }

  return (
    <div className="App">
      <Notifications
        gameOver={data.gameOver}/>
      <Setup/>
      <Board 
        board={human.board}/>
      <OtherBoard
        board={computer.board}
        onAttack={handleAttack}/>
    </div>
  );
}

export default App;
