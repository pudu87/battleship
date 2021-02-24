import { useState, useEffect } from 'react';
import range from 'lodash/range';

const Setup = (props) => {
  const { ships } = props;

  const [orientation, setOrientation] = useState({
    carrier: true,
    battleship: true,
    cruiser: true,
    submarine: true,
    minesweeper: true
  });

  useEffect(() => {
    const ships = document.querySelectorAll('.ship');
    ships.forEach(ship => {
      ship.addEventListener('mousedown', onMouseDown);
    });
    return () => {
      ships.forEach(ship => {
        ship.removeEventListener('mousedown', onMouseDown);
      });
    }
  })

  function onMouseDown(e) {
    const startXY = [e.clientX, e.clientY];
    const ship = e.target.closest('ul');
    const part = e.target.closest('li');
    const shipName = ship.className.split(' ')[1];
    const partNr = part.className.split(' ')[0].split('_')[1];
    const shiftX = e.clientX - ship.getBoundingClientRect().left;
    const clone = cloneShip(ship);
  
    moveAt(e.pageX, e.pageY);
    function moveAt(pageX, pageY) {
      clone.style.left = pageX - shiftX + 'px';
      clone.style.top = pageY - clone.offsetHeight / 2 + 'px';
    }

    document.addEventListener('mousemove', onMouseMove);
    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    clone.addEventListener('mouseup', onMouseUp);
    function onMouseUp(e) {
      const endXY = [e.clientX, e.clientY];
      document.removeEventListener('mousemove', onMouseMove);
      if (checkIfMouseClick(startXY, endXY)) {
        rotate(shipName);
      }
      const cell = getCell(e, clone);
      if (cell) {
        const coords = getCoords(cell, shipName, partNr);
        const position = {
          coords,
          horizontal: orientation[shipName]
        };
        if (coords && props.onPlacement(shipName, position)) {
          return;
        }
      }
      ship.classList.toggle('no-display');
    }
  }

  function cloneShip(ship) {
    const clone = ship.cloneNode(true);
    clone.style.position = 'absolute';
    document.body.append(clone);
    ship.classList.toggle('no-display');
    return clone;
  }

  function checkIfMouseClick(startXY, endXY) {
    return range(0,3).includes(endXY[0] - startXY[0]) &&
      range(0,3).includes(endXY[1] - startXY[1])
  }

  function rotate(shipName) {
    setOrientation({
      ...orientation,
      [shipName]: !orientation[shipName]
    });
  }

  function getCell(e, clone) {
    document.body.removeChild(clone);
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    return elementBelow.closest('.cell');
  }

  function getCoords(cell, ship, partNr) {
    let coords = cell.className.split(' ')[0].split('_');
    coords.shift();
    coords = coords.map(i => Number(i));
    orientation[ship] ? coords[1] -= partNr : coords[0] -= partNr;
    return coords.some(i => i < 0) ? false : coords;
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
