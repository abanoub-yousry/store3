import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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
