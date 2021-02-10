import { useState } from 'react';
import produce from 'immer';
import './App.scss';
import Notifications from './components/Notifications';
import Setup from './components/Setup';
import Board from './components/Board';
import OtherBoard from './components/OtherBoard';
import Player from './logic/Player';
import data from './logic/data';

function App() {

  const [gameData, setGameData] = useState(data);

  const player = Player();
  const gameboard = player.gameboard;

  function handleAttack(coords) {
    console.log(gameData)
    const humanAttack = gameboard.receiveAttack(coords, gameData.computer.board, gameData.computer.history);
    if (!humanAttack.history) {
      return console.log('Already been there...')
    } else {
      const computerMove = player.calculateMove(gameData.human.history);
      const computerAttack = gameboard.receiveAttack(computerMove, gameData.human.board, gameData.human.history);
      const newData = produce(gameData, (draft) => {
        if (humanAttack.target) {
          draft.computer.ships[humanAttack.target].hits = humanAttack.target.hits;
        }
        if (computerAttack.target) {
          draft.human.ships[computerAttack.target].hits = computerAttack.target.hits;
        }
        draft.computer.history = humanAttack.history;
        draft.human.history = computerAttack.history;
      })
      setGameData(newData);
    }
  }

  return (
    <div className="App">
      <Notifications/>
      <Setup/>
      <Board 
        board={gameData.human.board}/>
      <OtherBoard
        board={gameData.computer.board}
        onAttack={handleAttack}/>
    </div>
  );
}

export default App;
