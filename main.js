import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
    authDomain: "dora-store.firebaseapp.com",
    databaseURL: "https://dora-store-default-rtdb.firebaseio.com",
    projectId: "dora-store",
    storageBucket: "dora-store.appspot.com",
    messagingSenderId: "331430680486",
    appId: "1:331430680486:web:bf9c5880015fde63496167",
    measurementId: "G-YF9G38JB8V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// التحقق من الاتصال بقاعدة البيانات
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
        console.log("✅ متصل بقاعدة البيانات");
    } else {
        console.error("❌ غير متصل بقاعدة البيانات");
    }
});

// جلب المنتجات من Firebase وعرضها
function requestAndBuild() {
    const proContainer = document.querySelector(".pro-container");
    proContainer.innerHTML = ""; // مسح المحتوى القديم

    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        if (products) {
            Object.keys(products).forEach((key) => {
                const product = products[key];
                const productDiv = document.createElement("div");
                productDiv.classList.add("pro");
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h5>${product.name}</h5>
                    <h4>${product.price} جنيه</h4>
                `;
                proContainer.appendChild(productDiv);
            });
        } else {
            console.log("لا توجد منتجات متاحة.");
        }
    });
}

requestAndBuild();

// تصفية المنتجات حسب النوع
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.textContent.trim();
        requestAndBuild(category);
    });
});

// إضافة منتج جديد (إذا كان لديك نموذج إضافة منتج)
const form = document.getElementById("productForm");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("productName").value;
        const price = document.getElementById("productPrice").value;
        const image = document.getElementById("productImage").value;
        const type = document.getElementById("productType").value;

        push(ref(db, "products"), {
            name: name,
            price: price,
            image: image,
            type: type
        }).then(() => {
            alert("تمت إضافة المنتج بنجاح!");
            form.reset();
        }).catch((error) => {
            console.error("Error adding product: ", error);
        });
    });
}

// التمرير إلى الأعلى
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

// إدارة عربة التسوق (إذا كنت تستخدمها)
const cartIcon = document.getElementById("cart-icon");
const cartContainer = document.getElementById("cart-section");
const closeCart = document.getElementById("close-cart");
let productIDs = [];

if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        cartContainer.classList.add("show");
    });
}

if (closeCart) {
    closeCart.addEventListener("click", () => {
        cartContainer.classList.remove("show");
    });
}

// تحميل محتوى عربة التسوق
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

                    cartContent.innerHTML += `
                        <div class="cart-box ${product.id}">
                            <img src="${product.img}" alt="${product.name}">
                            <div>
                                <h4>${product.name}</h4>
                                <h5>${product.price}</h5>
                                <input type="number" value="1">
                            </div>
                            <i class="fa-solid fa-trash" id="remove"></i>
                        </div>
                    `;
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            })
        );
    }
    updateCart();
}

loadCartContent();

// تحديث عربة التسوق
function updateCart() {
    let removeCartButtons = document.querySelectorAll(".fa-trash");
    removeCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.target.parentElement.remove();
            const id = e.target.parentElement.classList[1];
            productIDs = productIDs.filter((e) => e != id);
            localStorage.setItem("productIDs", productIDs);
            updateCart();
        });
    });

    let total = 0;
    document.querySelectorAll(".cart-box").forEach((box) => {
        const price = parseFloat(box.querySelector("h5").textContent);
        const quantity = parseFloat(box.querySelector("input").value);
        total += price * quantity;
    });

    document.getElementById("total-amount").textContent = total.toFixed(2);
}
