const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector("#close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart-design");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".shirt-boxes");
const newsletter = document.getElementById('newsletter');
let cart = [];
let buttonsDOM = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price, brand } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { brand, title, price, id, image };
      });
      return products;
      // return data;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    // console.log(products);
    let result = "";
    products.forEach((item) => {
      result += `
            <div class="sbox">
              <img src=${item.image} class="home-box" alt="">
              <p>${item.brand}</p>
              <h4>${item.title}</h4>
              <div class="angry-grid">
                  <div class= "item-0">
                      <ion-icon class = "star" name="star"></ion-icon>
                      <ion-icon class = "star" name="star"></ion-icon>
                      <ion-icon class = "star" name="star"></ion-icon>
                      <ion-icon class = "star" name="star"></ion-icon>
                  </div>
                  <div class="item-1">$${item.price}</div>
                  <div class="item-2"><button data-id = ${item.id} class = "product-cart"><ion-icon  name="cart-outline"></button></ion-icon></div>
                  <!--<div id="item-2"><ion-icon class = "product-cart" name="cart-outline" data-id = ${item.id} ></ion-icon></div>-->
              </div>
            </div>`;
    });
    productsDom.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".product-cart")];
    buttonsDOM = buttons;
    // console.log(btns);
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        // console.log('yes in cart')
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        // console.log(event);
        event.target.parentElement.disabled = true;
        // event.target.parentElement.nextElementSibling.style.display = "block";
        console.log(event.target.parentElement);
        event.target.parentElement.innerHTML = `<ion-icon name="checkmark-outline" ></ion-icon>`;

        // event.target.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);
        cart = [...cart, cartItem];
        // console.log(cart);
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        // this.showCart();
      });
    });
  }
  setCartValues = (cart) => {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = parseInt(itemTotal);
    // console.log(cartTotal,cartItems);
  };
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="">
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id = ${item.id}>Remove</span>
    </div>
    <div>
        <ion-icon class="fa-chevron-up" data-id = ${item.id} name="chevron-up-outline"></ion-icon>
        <p id="item-amount">${item.amount}</p>
        <ion-icon class="fa-chevron-down"data-id = ${item.id} name="chevron-down-outline"></ion-icon>
    </div>`;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  setupOnLoad() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populate(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populate(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (event) => {
      // console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        // console.log(event.target);
        let id = event.target.dataset.id;
        // console.log(id);
        this.removeItem(id);
        cartContent.removeChild(event.target.parentElement.parentElement);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        // console.log(event.target);
        let id = event.target.dataset.id;
        let tempItem = cart.find((item) => item.id == id);
        tempItem.amount += 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        event.target.nextElementSibling.innerText = tempItem.amount;
      }
      if (event.target.classList.contains("fa-chevron-down")) {
        // console.log(event.target);
        let id = event.target.dataset.id;
        let tempItem = cart.find((item) => item.id == id);
        tempItem.amount -= 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          event.target.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(event.target.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    // console.log(this)
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length != 0)
      cartContent.removeChild(cartContent.children[0]);
    // console.log(cartItems);
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    // Object.keys(button).forEach((prop)=> console.log(prop))
    // console.log(button.parentElement,id);
    // button.setAttribute("name", "cart-outline");
    // button.setAttribute("data-id", `${id}`);
    console.log(button);
    button.disabled = false;
    button.innerHTML = `<ion-icon name="cart-outline" ></ion-icon>`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts = (products) => {
    localStorage.setItem("product", JSON.stringify(products));
  };
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("product"));
    return products.find((product) => product.id === id);
  }
  static saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupOnLoad();
  products
    .getProducts()
    .then((data) => {
      ui.displayProducts(data);
      Storage.saveProducts(data);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
