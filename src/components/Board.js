import { useEffect } from 'react';
import Setup from './Setup';

const Board = (props) => {
  const { board, history } = props.human;

  useEffect(() => {
    setTimeout(markCell, 1000);
  }, [history])

  useEffect(() => {
    if (!props.setupComplete) {
      const boardSection = document.querySelector('#board');
      const cells = boardSection.querySelectorAll('.cell:not(.false)');
      cells.forEach(cell => {
        cell.addEventListener('click', removeShip);
      })
      return () => { 
        cells.forEach(cell => {
          cell.removeEventListener('click', removeShip);
        })
      }
    }
  })

  function removeShip(e) {
    const shipName = e.target.closest('li').className.split(' ')[1];
    props.onRemove(shipName);
    const setupSection = document.querySelector('#setup');
    const ship = setupSection.querySelector(`.${shipName}`);
    ship.classList.remove('hidden');
  }

  function markCell() {
    if (!history[0]) return;
    const coords = history[history.length - 1];
    const effect = board[coords[0]][coords[1]] ? 'hit' : 'shot';
    const boardSection = document.querySelector('#board');
    const cell = boardSection.querySelector(`._${coords.join('_')}`);
    cell.classList.add(effect);
  }

  const boardView = board.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      return (
        <li
          key={`_${rowIndex}_${columnIndex}`}
          className={`_${rowIndex}_${columnIndex} ${cell} cell`}>
          <span></span>
        </li>
      )
    });
  });

  return (
    <section 
      id='board'
      className='board'>
      Board
      <ul>
        {boardView}
      </ul>
      { !props.setupComplete &&
      <Setup
        human={props.human}
        onPlacement={props.onPlacement}
        onSetupComplete={props.onSetupComplete}/>
      }
    </section>
  )
}

export default Board;