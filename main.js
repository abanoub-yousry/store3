import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
  authDomain: "dora-store.firebaseapp.com",
  databaseURL: "https://dora-store-default-rtdb.firebaseio.com",
  projectId: "dora-store",
  storageBucket: "dora-store.appspot.com",
  messagingSenderId: "331430680486",
  appId: "1:331430680486:web:bf9c5880015fde63496167",
  measurementId: "G-YF9G38JB8V",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const proContainer = document.querySelector(".pro-container");

async function requestAndBuild(category = "all") {
    proContainer.innerHTML = ""; // تفريغ المحتوى قبل الإضافة

    let q = category === "all" ? collection(db, "products") : query(collection(db, "products"), where("category", "==", category));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        createProductCard(product);
    });
}

function createProductCard(product) {
    const { title, price, imageURL, category } = product;

    const productHTML = `
        <div class="pro">
            <img src="${imageURL}" alt="${title}">
            <div class="description">
                <h3>${title}</h3>
                <h4>${category}</h4>
                <h4>$${price}</h4>
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;

    proContainer.innerHTML += productHTML;
}

// تحميل المنتجات عند بدء الصفحة
requestAndBuild();

// التعامل مع أزرار التصفية
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.classList.contains("all-btn") ? "all" : button.classList[1].replace("-btn", "");
        requestAndBuild(category);
    });
});
