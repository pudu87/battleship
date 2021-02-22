import { useState } from 'react';
import produce from 'immer';
import sample from 'lodash/sample';
import './App.scss';
import Notifications from './components/Notifications';
import Board from './components/Board';
import OtherBoard from './components/OtherBoard';
import Player from './logic/Player';
import dataObj from './logic/data';

function App() {

  const player = Player();
  const gameboard = player.gameboard;
  const lag = 2000;

  const [data, setData] = useState(computerSetup());
  const { human, computer } = data;

  function computerSetup() {
    let newData = dataObj;
    let board;
    for (const ship in newData.computer.ships) {
      const computer = newData.computer;
      board = player.autoPlace(computer.ships[ship], computer);
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
    }
  }

  function handleRemove(ship) {
    const board = gameboard.remove(human.ships[ship], human);
    const newData = produce(data, (draft) => {
      draft.human.board = board;
    })
    setData(newData);
  }

  function handleConfirmSetup() {
    setData({ ...data, setupConfirmed: true });
  }

  function handleAttack(coords) {
    const humanAttack = gameboard.receiveAttack(coords, computer);
    if (!humanAttack) return;
    const computerMove = sample(player.calculateMoves(human));
    const computerAttack = gameboard.receiveAttack(computerMove, human);
    const newData = produce(data, (draft) => {
      enterAttackData(draft, humanAttack, 'computer', 'You');
      enterAttackData(draft, computerAttack, 'human', 'Computer');
    })
    setData(newData);
  }

  function enterAttackData(draft, attack, player, winner) {
    if (attack.target) {
      draft[player].ships[attack.target].hits = attack.hits;
      draft.gameOver = gameboard.allSunk(draft[player]) ? winner : false;
    }
    draft[player].history = attack.history;
  }

  function handleReset() {
    setData(computerSetup());
    const cells = document.querySelectorAll(`.cell`);
    cells.forEach(cell => {
      cell.classList.remove('shot');
      cell.classList.remove('hit');
    });
  }

  return (
    <div className="App">
      <Notifications
        human={human}
        computer={computer}
        setupConfirmed={data.setupConfirmed}
        gameOver={data.gameOver}
        lag={lag}
        setupComplete={gameboard.allShipsPlaced(human)}
        onConfirmSetup={handleConfirmSetup}
        onReset={handleReset}/>
      <Board 
        human={human}
        setupConfirmed={data.setupConfirmed}
        lag={lag}
        onRemove={handleRemove}
        onPlacement={handlePlacement}
        onConfirmSetup={handleConfirmSetup}/>
      { data.setupConfirmed &&
      <OtherBoard
        computer={computer}
        gameOver={data.gameOver}
        onAttack={handleAttack}/>
      }
    </div>
  );
}

export default App;
