import { useEffect } from 'react';
import Setup from './Setup';

const Board = (props) => {
  const { board, history, ships } = props.human;

  useEffect(() => {
    if (props.setupComplete) return;
    setTimeout(markCell, props.lag);
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
  })

  function removeShip(e) {
    const shipName = this.closest('li').className.split(' ')[1];
    props.onRemove(shipName);
    const ship = document.querySelector(`.${shipName}`);
    ship.classList.toggle('no-display');
  }

  function markCell() {
    if (!history[0]) return;
    const coords = history[history.length - 1];
    const effect = board[coords[0]][coords[1]] ? 'hit' : 'shot';
    const boardSection = document.querySelector('#board');
    const cell = boardSection.querySelector(`._${coords.join('_')}`);
    cell.classList.add(effect);
  }

  function getCellClass(rowIndex, columnIndex, cell) {
    if (!cell) {
      return `_${rowIndex}_${columnIndex} cell`;
    } else if (props.setupConfirmed) {
      return `_${rowIndex}_${columnIndex} ${cell} cell`;
    } else {
      return `_${rowIndex}_${columnIndex} ${cell} setup cell`;
    }
  }

  const boardView = board.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      return (
        <li
          key={`_${rowIndex}_${columnIndex}`}
          className={getCellClass(rowIndex, columnIndex, cell)}>
          <span></span>
        </li>
      )
    });
  });

  return (
    <section 
      id='board'
      className={ props.setupConfirmed ? 'board' : 'board span-columns' }>
      <h3
        className={ props.setupConfirmed ? '' : 'hidden' }>
        My Board
      </h3>
      <ul>
        {boardView}
      </ul>
      { !props.setupConfirmed &&
        <Setup
          ships={props.human.ships}
          onPlacement={props.onPlacement}/>
      }
    </section>
  )
}

export default Board;
