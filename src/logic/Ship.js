const Ship = (length) => {
  let hits = 0;

  const hit = () => {
    obj.hits += 1;
  }

  const isSunk = () => {
    return length - obj.hits === 0 ? true : false;
  }

  const obj = { length, hits, hit, isSunk }
  return obj;
}

export default Ship;
