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

  const [data, setData] = useState(computerSetup());
  const { human, computer } = data;

  function computerSetup() {
    let newData = dataObj;
    let board;
    for (const ship in newData.computer.ships) {
      board = player.autoPlace(newData.computer.ships[ship], newData.computer);
      newData = produce(newData, (draft) => {
        draft.computer.board = board;
      });
    }
    return newData;
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

  function handleReset() {
    setData(computerSetup());
    const boardSection = document.querySelector('#board');
    const cells = boardSection.querySelectorAll(`.cell`);
    cells.forEach(cell => {
      cell.classList.remove('shot');
      cell.classList.remove('hit');
    });
  }

  return (
    <div className="App">
      <Notifications
        gameOver={data.gameOver}
        onReset={handleReset}/>
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
