const OtherBoard = (props) => {
  const { board } = props;

  function attack(e) {
    let coords = e.target.className.split('_');
    coords.shift();
    coords = coords.map(i => Number(i));
    props.onAttack(coords);
  }

  const boardView = board.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      return (
        <li
          key={`_${rowIndex}_${columnIndex}`}
          className={`_${rowIndex}_${columnIndex}`}
          onClick={attack}>
          {`_${rowIndex}_${columnIndex} ${!!cell}`}
        </li>
      )
    });
  });

  return (
    <section className='board'>
      OtherBoard
      <ul>
        {boardView}
      </ul>
    </section>
  )
}

export default OtherBoard;