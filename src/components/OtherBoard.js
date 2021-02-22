import { useEffect, useCallback } from 'react';

const OtherBoard = (props) => {
  const { board, history } = props.computer;

  useEffect(() => {
    if (props.gameOver) return;
    const boardSection = document.querySelector('#other-board');
    const cells = boardSection.querySelectorAll('.cell');
    markCell();
    addClickEvents(cells);
    return () => removeClickEvents(cells);
  }, [history])

  function addClickEvents(cells) {
    setTimeout(() => {
      cells.forEach(cell => {
        cell.addEventListener('click', attack);
      })
    }, props.lag)
  }

  function removeClickEvents(cells) {
    cells.forEach(cell => {
      cell.removeEventListener('click', attack);
    })
  }

  function markCell() {
    if (!history[0]) return;
    const coords = history[history.length - 1];
    const effect = board[coords[0]][coords[1]] ? 'hit' : 'shot';
    const boardSection = document.querySelector('#other-board');
    const cell = boardSection.querySelector(`._${coords.join('_')}`);
    cell.classList.add(effect);
  }

  const attack = useCallback((e) => {
    let coords = e.target.closest('li').className.split(' ')[0].split('_');
    coords.shift();
    coords = coords.map(i => Number(i));
    props.onAttack(coords);
  }, [addClickEvents])

  const boardView = board.map((row, rowIndex) => {
    return row.map((_, columnIndex) => {
      return (
        <li
          key={`_${rowIndex}_${columnIndex}`}
          className={`_${rowIndex}_${columnIndex} cell`}>
          <span></span>
        </li>
      )
    });
  });

  return (
    <section 
      id='other-board'
      className='board'>
      <h3>Computer</h3>
      <ul>
        {boardView}
      </ul>
    </section>
  )
}

export default OtherBoard;
