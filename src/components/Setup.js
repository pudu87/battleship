import { useEffect } from 'react';

const Setup = (props) => {
  const human = props.human;
  const ships = human.ships;

  useEffect(() => {
    const setupSection = document.querySelector('#setup');
    const ships = setupSection.querySelectorAll('.ship');
    const boardSection = document.querySelector('#board');
    const cells = boardSection.querySelectorAll('.cell');
    addEvents(ships, cells);
    return () => { removeEvents(ships, cells) }
  }, [human])

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
    console.log(e);
  }

  function dragStart(e) {
    const target = e.explicitOriginalTarget
    const part = target.nodeName === 'SPAN' ? target.parentNode : target;
    const partNr = part.className.split(' ')[0].split('_')[1];
    const ship = e.target.className.split(' ')[1];
    e.dataTransfer.setData("text/plain", `${partNr} ${ship}`);
    setTimeout(() => this.classList.add('hidden'), 0);
  }

  function dragEnd(e) {
    const ship = e.target.className.split(' ')[1];
    const succes = human.board.some(row => {
      return row.some(cell => {
        return cell === ship;
      })
    })
    if (!succes) this.classList.remove('hidden');
  }
  
  function dragOver(e) {
    e.preventDefault();
    // Apparently an essential function for the drop to work
  }

  function dragDrop(e) {
    const cell = e.target.nodeName === 'SPAN' ? e.target.parentNode : e.target;
    let coords = cell.className.split(' ')[0].split('_');
    coords.shift();
    coords = coords.map(i => Number(i));
    const data = e.dataTransfer.getData("text/plain");
    const ship = data.split(' ')[1];
    const partNr = Number(data.split(' ')[0]);
    coords[1] -= partNr;
    const position = {
      coords,
      horizontal: true
    }
    props.onPlacement(ship, position);    
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
        style={{
          width: `${ship.length * 25}px`
        }}>
        {shipView(ship)}
      </ul>
    )
  })

  return (
    <section id='setup'>
      Setup
      {shipViews}
    </section>
  )
}

export default Setup;