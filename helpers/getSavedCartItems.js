const getSavedCartItems = (key) => window.localStorage.getItem(key);

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
