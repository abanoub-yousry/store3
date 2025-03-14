import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
  authDomain: "dora-store.firebaseapp.com",
  projectId: "dora-store",
  storageBucket: "dora-store.appspot.com",
  messagingSenderId: "331430680486",
  appId: "1:331430680486:web:bf9c5880015fde63496167",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const proContainer = document.querySelector(".pro-container");

async function requestAndBuild(category = "all") {
    proContainer.innerHTML = "";

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
            <img src="${imageURL}" alt="${title}" onerror="this.src='placeholder-image.jpg';">
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

requestAndBuild();

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.classList.contains("all-btn") ? "all" : button.classList[1].replace("-btn", "");
        requestAndBuild(category);
    });
});
