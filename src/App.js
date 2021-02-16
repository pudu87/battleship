import { useState } from 'react';
import produce from 'immer';
import './App.scss';
import Notifications from './components/Notifications';
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
      horizontal: true
    }
    const computerBoard = gameboard.place(dataObj.computer.ships.minesweeper, position, dataObj.computer);
    return produce(dataObj, (draft) => {
      draft.computer.board = computerBoard;
    })
  }

  function handlePlacement(ship, position) {
    const board = gameboard.place(human.ships[ship], position, human);
    if (board) {
      const newData = produce(data, (draft) => {
        draft.human.board = board;
      })
      setData(newData);
      console.log(newData);
    }
    return board;
  }

  function handleRemove(ship) {
    const board = gameboard.remove(human.ships[ship], human);
    const newData = produce(data, (draft) => {
      draft.human.board = board;
    })
    setData(newData);
  }

  function handleSetupComplete() {
    setData({
      ...data,
      setupComplete: true
    })
  }

  function handleAttack(coords) {
    const humanAttack = gameboard.receiveAttack(coords, computer);
    if (!humanAttack) {
      return console.log('Already been there...')
    } else {
      const computerMove = player.calculateMove(human);
      const computerAttack = gameboard.receiveAttack(computerMove, human);
      handleAttackData(humanAttack, computerAttack);
    }
  }

  function handleAttackData(humanAttack, computerAttack) {
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
    });
    console.log(newData);
    setData(newData);
  }

  return (
    <div className="App">
      <Notifications
        gameOver={data.gameOver}/>
      <Board 
        human={human}
        setupComplete={data.setupComplete}
        onRemove={handleRemove}
        onPlacement={handlePlacement}
        onSetupComplete={handleSetupComplete}/>
      { data.setupComplete &&
      <OtherBoard
        computer={computer}
        onAttack={handleAttack}/>
      }
    </div>
  );
}

export default App;
