const Ship = (name, length) => {

  const hit = (hits) => {
    return hits + 1;
  }

  const isSunk = (hits) => {
    return length - hits === 0 ? true : false;
  }

  return { name, length, hit, isSunk }
}

export default Ship;
