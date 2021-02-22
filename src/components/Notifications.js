import upperFirst from 'lodash/upperFirst';

const Notifications = (props) => {
  const { gameOver, setupComplete, setupConfirmed } = props;
  const { human, computer } = props;

  function collectInfo() {
    if (!setupComplete) {
      return ['Place all ships on the board']
    } else if (gameOver) {
      return [`Game over. ${gameOver} won!`]
    } else if (human.history[0]) {
      return attackInfo();
    }
  }

  function attackInfo() {
    return [human, computer].map(player => {
      const coords = player.history[player.history.length - 1];
      const ship = player.board[coords[0]][coords[1]];
      if (!ship) {
        return 'Miss!';
      } else if (!player.ships[ship].isSunk(player.ships[ship].hits)) {
        return 'Hit!'
      } else {
        return `${upperFirst(ship)} sunk!`;
      }
    })
  }

  function getPClass(info, index) {
    if (info.length === 1) {
      return 'span-columns';
    } else {
      return index === 1 ? 'computer' : 'my-board';
    }
  }

  const messageView = (info) => {
    if (!info) return;
    return info.map((message, index) => {
      return(
        <p 
          key={index}
          className={getPClass(info, index)}>
          {message}
        </p>
      )
    })
  }

  return (
    <section 
      id='notifications'
      className='span-columns'>
      { setupComplete && !setupConfirmed &&
      <div className='span-columns'>
        <button
          onClick= {props.onConfirmSetup}
          className= 'activated span-columns'>
          Start Game
        </button>
      </div>
      }
      {messageView(collectInfo())}
      { gameOver && 
      <div className='span-columns'>
        <button
          className='activated span-columns'
          onClick={props.onReset}>
          Play Again
        </button>
      </div>
      }
    </section>
  )
}

export default Notifications;
