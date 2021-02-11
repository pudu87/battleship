import { useEffect } from 'react';

const Board = (props) => {
  const { board, history } = props;

  useEffect(() => {
    setTimeout(markCell, 2000);
  }, [history])

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
          className={`_${rowIndex}_${columnIndex} cell`}>
          {cell[0]}
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
    </section>
  )
}

export default Board;