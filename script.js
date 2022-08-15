const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const subtotal = document.querySelector('.total-price');
const btnClearCart = document.querySelector('.empty-cart');
const btnSearch = document.querySelector('.search-btn');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const price = event.target.innerText.split('PRICE: $')[1];
  subtotal.innerText = (Number(subtotal.innerText) - Number(price));
  
  // https://stackoverflow.com/a/20439411
  subtotal.innerText = (+subtotal.innerText)
  .toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
  cartItems.removeChild(event.target);
  saveCartItems('cartItems', cartItems.innerHTML);
  saveCartItems('subtotal', subtotal.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(id) {
  const fetchedItem = fetchItem(id);
  fetchedItem.then((item) => {
    const objParam = { sku: item.id, name: item.title, salePrice: item.price };
    cartItems.appendChild(createCartItemElement(objParam));
    saveCartItems('cartItems', cartItems.innerHTML);
    subtotal.innerText = (Number(subtotal.innerText) + Number(item.price)); 
    
    // https://stackoverflow.com/a/20439411
    subtotal.innerText = (+subtotal.innerText)
    .toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
    saveCartItems('subtotal', subtotal.innerHTML);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btnAddToCart);
  btnAddToCart.addEventListener('click', () => addToCart(sku));

  return section;
}

function createLoadingMsg() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'carregando...';
  items.appendChild(loading);
}

async function removeLoadingMsg() {
  const loading = document.querySelector('.loading');
  items.removeChild(loading);
}

function clearSection(section) {
  while (section.children.length > 0) {
    const { lastChild } = section;
    section.removeChild(lastChild);
  }  
}

async function createProductList(input) {  
  createLoadingMsg();
  let fetchedData = '';
  if (input === undefined || input === '') {
    fetchedData = await fetchProducts('computador');
  } else {
    fetchedData = await fetchProducts(input);
  }
  fetchedData.results.forEach((item) => {
    const objParam = { sku: item.id, name: item.title, image: item.thumbnail };
    const newItem = createProductItemElement(objParam);    
    items.appendChild(newItem);
  });
  removeLoadingMsg();
  saveCartItems('items', items.innerHTML);
}

async function setEventListners() {
  const itemList = document.querySelectorAll('.item');
  itemList.forEach((item) => item.addEventListener('click', () => addToCart(item.id)));
  const cartList = document.querySelectorAll('.cart__item');
  cartList.forEach((cartItem) => cartItem.addEventListener('click', cartItemClickListener));
}

async function getLocalStoreItems() {
  if (getSavedCartItems('cartItems') !== null) cartItems.innerHTML = getSavedCartItems('cartItems');
  if (getSavedCartItems('subtotal') !== null) subtotal.innerHTML = getSavedCartItems('subtotal');
  if (getSavedCartItems('items') !== null) items.innerHTML = getSavedCartItems('items');
}

btnClearCart.addEventListener('click', () => {
  clearSection(cartItems);
  subtotal.innerText = 0;
  window.localStorage.clear();
});

btnSearch.addEventListener('click', () => {
  clearSection(items);
  const param = document.querySelector('.search-bar').value.trim().replace(' ', '_');
  createProductList(param);
  document.querySelector('.search-bar').value = '';
});

window.onload = async () => { 
  createProductList();  
  await getLocalStoreItems();
  await setEventListners();
};
