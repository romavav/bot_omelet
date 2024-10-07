
const getRandomItem = (array) => {
  if (!array || array.length === 0) {
    return "Извините, нет доступных советов.";
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

module.exports = { getRandomItem};
