const fetchItem = async (sku) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    return response.json();
  } catch (error) {
    return new Error('You must provide an url');    
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
