

const forEach = (items, fn) => {
  const length = items.length;
  
  let index = -1;
  
  while (++index < length) {
    fn(items[index], index, items);
  }
};

export default forEach;
