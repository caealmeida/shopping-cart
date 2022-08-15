const saveCartItems = (key, value) => {
  window.localStorage.setItem(key, value); 
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
