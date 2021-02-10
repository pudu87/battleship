const Board = (props) => {
  const { board } = props;

  const boardView = board.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      return (
        <li
          key={`_${rowIndex}_${columnIndex}`}
          className={`_${rowIndex}_${columnIndex}`}>
          {`_${rowIndex}_${columnIndex} ${!!cell}`}
        </li>
      )
    });
  });

  return (
    <section className='board'>
      Board
      <ul>
        {boardView}
      </ul>
    </section>
  )
}

export default Board;