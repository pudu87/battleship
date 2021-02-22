import { useState, useEffect } from 'react';

const Setup = (props) => {
  const human = props.human;
  const ships = human.ships;

  const [orientation, setOrientation] = useState({
    carrier: true,
    battleship: true,
    cruiser: true,
    submarine: true,
    minesweeper: true
  });

  useEffect(() => {
    const setupSection = document.querySelector('#setup');
    const ships = setupSection.querySelectorAll('.ship');
    const boardSection = document.querySelector('#board');
    const cells = boardSection.querySelectorAll('.cell');
    addEvents(ships, cells);
    return () => removeEvents(ships, cells);
  })

  function addEvents(ships, cells) {
    ships.forEach(ship => {
      ship.addEventListener('click', rotate);
      ship.addEventListener('dragstart', dragStart);
      ship.addEventListener('dragend', dragEnd);
    })
    for(const cell of cells) {
      cell.addEventListener('dragover', dragOver);
      cell.addEventListener('drop', dragDrop);
    }
  }

  function removeEvents(ships, cells) {
    ships.forEach(ship => {
      ship.removeEventListener('click', rotate);
      ship.removeEventListener('dragstart', dragStart);
      ship.removeEventListener('dragend', dragEnd);
    })
    for(const cell of cells) {
      cell.removeEventListener('dragover', dragOver);
      cell.removeEventListener('drop', dragDrop);
    }
  }

  function rotate(e) {
    const ship = e.target.closest('ul');
    const shipName = ship.className.split(' ')[1];
    setOrientation({
      ...orientation,
      [shipName]: !orientation[shipName]
    });
  }

  function dragStart(e) {
    const part = e.explicitOriginalTarget.closest('li');
    const partNr = part.className.split(' ')[0].split('_')[1];
    const ship = this.className.split(' ')[1];
    e.dataTransfer.setData("text/plain", `${partNr} ${ship}`);
    setTimeout(() => this.classList.add('no-display'), 0);
  }

  function dragEnd(e) {
    const ship = this.className.split(' ')[1];
    const succes = human.board.some(row => {
      return row.some(cell => cell === ship);
    })
    if (!succes) this.classList.remove('no-display');
  }
  
  function dragOver(e) {
    e.preventDefault();
  }

  function dragDrop(e) {
    const cell = this.closest('li');
    const data = e.dataTransfer.getData("text/plain");
    const ship = data.split(' ')[1];
    const partNr = Number(data.split(' ')[0]);
    const coords = processCoords(cell, ship, partNr)
    if (coords.some(i => i < 0)) return false;
    const position = {
      coords,
      horizontal: orientation[ship]
    };
    props.onPlacement(ship, position);  
  }

  function processCoords(cell, ship, partNr) {
    let coords = cell.className.split(' ')[0].split('_');
    coords.shift();
    coords = coords.map(i => Number(i));
    orientation[ship] ? coords[1] -= partNr : coords[0] -= partNr;
    return coords;
  }

  function horizontalStyle(length) {
    return {
      gridColumn: `1 / span ${length}`,
      width: `${length * 25}px`,
      gridTemplateColumns: `repeat(${length}, 25px)`,
      gridTemplateRows: '25px'
    }
  }

  function verticalStyle(length) { 
    return {
      gridRow: `1 / span ${length}`,
      width: '25px',
      gridTemplateColumns: '25px',
      gridTemplateRows: `repeat(${length}, 25px)`
    }
  }

  const shipView = (ship) => {
    let content = [];
    for (let i = 0; i < ship.length; i++) {
      content.push(
        <li
          key={i}
          className={`_${i} part`}>
          <span></span>
        </li>
      )
    }
    return content;
  }
  
  const shipViews = Object.values(ships).map((ship, index) => {
    return (
      <ul 
        key={index}
        className={`ship ${ship.name}`}
        draggable='true'
        style={
          orientation[ship.name] ? 
            horizontalStyle(ship.length) : 
            verticalStyle(ship.length)
        }>
        {shipView(ship)}
      </ul>
    )
  })

  return (
    <section id='setup'>
      <div
        className='shipyard'>
        {shipViews}
      </div>
      <p>
        - click on a ship to rotate<br/>
        - click on the board to reset a ship
      </p>
    </section>
  )
}

export default Setup;
