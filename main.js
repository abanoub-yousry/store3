/** ----------- Navbar ----------- */
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

/** ----------- Slider ----------- */
let imgs = ["img/Slider/1.jpg", "img/Slider/2.jpg", "img/Slider/3.jpg", "img/Slider/4.jpg", "img/Slider/4.jpg", "img/Slider/6.jpg", "img/Slider/7.jpg", "img/Slider/8.jpg", "img/Slider/9.jpg"];

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let i = 0;
prev.addEventListener("click", function () {
  i--;
  if (i < 0) {
    i = imgs.length - 1;
  }
  setTimeout(() => {
    document.querySelector(".overlay-img").src = imgs[i];
  }, 0.25);
});

next.addEventListener("click", function () {
  i++;
  if (i > imgs.length - 1) {
    i = 0;
  }
  setTimeout(() => {
    document.querySelector(".overlay-img").src = imgs[i];
  }, 0.25);
});

let x = 0;
setInterval(() => {
  x++;
  if (x > imgs.length - 1) {
    x = 0;
  }
  document.querySelector(".overlay-img").src = imgs[x];
}, 2000);

/** --------- products ----------- */
const pro = document.querySelectorAll(".pro-container")[0];
const filter = document.querySelectorAll(".filter-btn");
const firebaseConfig = {
    apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
    authDomain: "dora-store.firebaseapp.com",
    databaseURL: "https://dora-store-default-rtdb.firebaseio.com",
    projectId: "dora-store",
    storageBucket: "dora-store.firebasestorage.app",
    messagingSenderId: "331430680486",
    appId: "1:331430680486:web:bf9c5880015fde63496167",
    measurementId: "G-YF9G38JB8V"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// تحميل المنتجات من Firebase
function requestAndBuild() {
    const pro = document.querySelector(".pro-container");
    pro.innerHTML = "";

    db.ref("products").on("child_added", (snapshot) => {
        const item = snapshot.val();
        let div = document.createElement("div");
        div.classList.add("pro");
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h5>${item.name}</h5>
            <h4>${item.price} جنيه</h4>
        `;
        pro.appendChild(div);
    });
}

requestAndBuild();


filter[0].addEventListener("click", function () {
  requestAndBuild("");
});

filter[1].addEventListener("click", function () {
  requestAndBuild("category=Necklace");
});

filter[2].addEventListener("click", function () {
  requestAndBuild("category=Anklet");
});

filter[3].addEventListener("click", function () {
  requestAndBuild("category=Ring");
});

filter[4].addEventListener("click", function () {
  requestAndBuild("category=Earring");
});
filter[5].addEventListener("click", function () {
  requestAndBuild("category=Bracelet");
});

/** --------- product ----------- */
function clicked(id) {
  window.open("product.html?id=" + id, "_blank");
}

/** --------- arrow ----------- */
function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
  if (
    document.body.scrollTop > window.outerHeight ||
    document.documentElement.scrollTop > window.outerHeight
  ) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
};

/** ----------- cart ----------- */
const cartIcon = document.getElementById("cart-icon");
const cartContainer = document.getElementById("cart-section");
const closeCart = document.getElementById("close-cart");
let productIDs = [];

cartIcon.addEventListener("click", function () {
  cartContainer.classList.add("show");
});

closeCart.addEventListener("click", function () {
  cartContainer.classList.remove("show");
});

let countSpan = document.getElementById("cart-counter");

async function loadCartContent() {
  let cartContent = document.getElementById("cart-content");
  cartContent.innerHTML = "";

  let storedProductIDs = localStorage.getItem("productIDs");

  if (storedProductIDs) {
    productIDs.push(...storedProductIDs.split(","));

    await Promise.all(
      productIDs.map(async (id) => {
        try {
          const response = await fetch("API/products.json");
          const data = await response.json();
          const product = data.find((item) => item.id == id);

          cartContent.innerHTML += `<div id="cart-box" class="cart-box ${product.id}">
            <img id='cart-img' src="${product.img}" alt="">
            <div id="product-details">
              <h4 id="product-name">${product.name}</h4>
              <h5 id="product-price" class="product-price">$${product.price}</h5>
              <input type="number" id="product-quantity" class="product-quantity" value="1">
            </div>
            <i class="fa-solid fa-trash" id="remove"></i>
          </div>`;
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      })
    );
  }
  update();
}

loadCartContent();

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
  let counter = localStorage.getItem("counter");
  countSpan.innerHTML = counter;
} else {
  start();
}

function start() {
  addEvents();
}

function update() {
  addEvents();
  updateTotal();
}

function addEvents() {
  let removeCartBtn = document.getElementsByClassName("fa-trash");
  for (let i = 0; i < removeCartBtn.length; i++) {
    removeCartBtn[i].addEventListener("click", handle_removeProduct);
  }

  let quantityInputs = document.getElementsByClassName("product-quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("change", handle_changeProductQuantity);
  }

  let checkoutBtn = document.getElementById("checkout");
  checkoutBtn.addEventListener("click", handle_checkout);
}

function handle_checkout() {
  if (productIDs.length == 0) {
    Swal.fire({
      icon: "error",
      title: "Cart is empty",
      text: "You need to add product first!",
    });
    return;
  }
  let cartcontent = document.getElementById("cart-content");
  cartcontent.innerHTML = "";
  productIDs = [];
  localStorage.setItem("counter", productIDs.length);
  localStorage.setItem("productIDs", productIDs);
  countSpan.innerHTML = 0;
  Swal.fire({
    position: "center-center",
    icon: "success",
    title: "Successfully Checkout!",
    showConfirmButton: false,
    timer: 1500,
  });
  update();
}

async function addToCart(id) {
  let cartContent = document.getElementById("cart-content");
  if (productIDs.find((element) => element == id)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Product already added!",
    });
    return;
  }
  try {
    const response = await fetch("API/products.json");
    const data = await response.json();
    const product = data.find((item) => item.id == id);

    cartContent.innerHTML += `<div id="cart-box" class="cart-box ${product.id}">
      <img id='cart-img' src="${product.img}" alt="">
      <div id="product-details">
        <h4 id="product-name">${product.name}</h4>
        <h5 id="product-price" class="product-price">${product.price}</h5>
        <input type="number" id="product-quantity" class="product-quantity" value="1">
      </div>
      <i class="fa-solid fa-trash" id="remove"></i>
    </div>`;

    productIDs.push(product.id);
    localStorage.setItem("counter", productIDs.length);
    localStorage.setItem("productIDs", productIDs);
    countSpan.innerHTML = productIDs.length;
    update();
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Product Added",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

function handle_removeProduct() {
  this.parentElement.remove();
  let id = this.parentElement.classList[1];
  productIDs = productIDs.filter((e) => e != id);
  localStorage.setItem("counter", productIDs.length);
  localStorage.setItem("productIDs", productIDs);
  countSpan.innerHTML = productIDs.length;
  update();
}

function handle_changeProductQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  updateTotal();
}

function updateTotal() {
  let cartBoxes = document.getElementsByClassName("cart-box");
  let total = 0;
  for (let i = 0; i < cartBoxes.length; i++) {
    let cartBox = cartBoxes[i];
    let priceElement = cartBox.querySelector("#product-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantityElement = cartBox.querySelector("#product-quantity");
    let quantity = quantityElement.value;
    total += price * quantity;
  }
  document.getElementById("total-price").innerText = "$" + total.toFixed(2);
}
